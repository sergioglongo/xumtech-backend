'use strict';

const db = require('../models');
const { calculateLevenshteinDistance } = require('../tools/levenshtein');
const { checkKeywords } = require('../tools/keywordChecker');
const { phraseWithSynonyms } = require('../tools/phraseWithSynonyms');
const { normalizeText } = require('../tools/textTools');

exports.createQuestionAnswer = async (req, res) => {
  try {
    const { question_text, answer_text, synonyms } = req.body;

    if (!question_text || !answer_text) {
      return res.status(400).json({ error: 'Los campos question_text y answer_text son obligatorios.' });
    }

    // Validar que `synonyms` sea un objeto plano. Si no, se guarda un objeto vacío.
    let synonymsObject = {};
    if (synonyms && typeof synonyms === 'object' && !Array.isArray(synonyms)) {
      synonymsObject = synonyms;
    }

    const newQA = await db.QuestionAnswer.create({
      question_text,
      answer_text,
      synonyms: synonymsObject, // Sequelize maneja la serialización a JSONB
    });

    res.status(201).json({ message: 'Pregunta y respuesta añadidas exitosamente.', data: newQA });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Esta pregunta ya existe en la base de datos.' });
    }
    console.error('Error al crear QuestionAnswer:', error);
    res.status(500).json({ error: 'Error al crear el registro.' });
  }
};

exports.getAllQuestionAnswers = async (req, res) => {
  try {
    const allQuestionAnswer = await db.QuestionAnswer.findAll();
    res.status(200).json(allQuestionAnswer);
  } catch (error) {
    console.error('Error al obtener QuestionAnswers:', error);
    res.status(500).json({ error: 'Error al obtener los registros.' });
  }
};

exports.getQuestionAnswerById = async (req, res) => {
  try {
    const { id } = req.params;
    const qa = await db.QuestionAnswer.findByPk(id);
    if (!qa) {
      return res.status(404).json({ error: 'Registro no encontrado.' });
    }
    res.status(200).json(qa);
  } catch (error) {
    console.error('Error al obtener QuestionAnswer por ID:', error);
    res.status(500).json({ error: 'Error al obtener el registro.' });
  }
};

exports.updateQuestionAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { question_text, answer_text } = req.body;

    const qa = await db.QuestionAnswer.findByPk(id);
    if (!qa) {
      return res.status(404).json({ error: 'Registro no encontrado.' });
    }

    // Actualiza los campos y guarda los cambios
    qa.question_text = question_text || qa.question_text;
    qa.answer_text = answer_text || qa.answer_text;
    await qa.save();

    res.status(200).json(qa);
  } catch (error) {
    console.error('Error al actualizar QuestionAnswer:', error);
    res.status(500).json({ error: 'Error al actualizar el registro.' });
  }
};

exports.addSynonyms = async (req, res) => {
  try {
    const { id } = req.params;
    const newSynonymsData = req.body;

    if (!newSynonymsData || typeof newSynonymsData !== 'object' || Array.isArray(newSynonymsData) || Object.keys(newSynonymsData).length === 0) {
      return res.status(400).json({ error: 'Formato incorrecto' });
    }

    const qa = await db.QuestionAnswer.findByPk(id);
    if (!qa) {
      return res.status(404).json({ error: 'Registro no encontrado.' });
    }

    const currentSynonyms = qa.synonyms || {};

    for (const [keyword, synonyms] of Object.entries(newSynonymsData)) {
      if (Array.isArray(synonyms)) {
        const existingSyns = currentSynonyms[keyword] || [];
        const updatedSyns = [...new Set([...existingSyns, ...synonyms])];
        currentSynonyms[keyword] = updatedSyns;
      }
    }

    qa.synonyms = currentSynonyms;
    qa.changed('synonyms', true);

    await qa.save();

    res.status(200).json({ message: 'Sinónimos añadidos/actualizados exitosamente.', data: qa });

  } catch (error) {
    console.error('Error al añadir sinónimos:', error);
    res.status(500).json({ error: 'Error interno del servidor al añadir sinónimos.' });
  }
};

exports.deleteQuestionAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const qa = await db.QuestionAnswer.findByPk(id);
    if (!qa) {
      return res.status(404).json({ error: 'Registro no encontrado.' });
    }

    await qa.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar QuestionAnswer:', error);
    res.status(500).json({ error: 'Error al eliminar el registro.' });
  }
};

exports.findBestAnswer = async (req, res) => {
  const { question } = req.query;
  console.log("question recibida", question);
  
  if (!question || typeof question !== 'string' || question.trim() === '') {
    return res.status(400).json({ error: 'El parámetro "q" con la pregunta es requerido.' });
  }

  try {
    const allQuestionAnswer = await db.QuestionAnswer.findAll({ raw: true });
    
    if (allQuestionAnswer.length === 0) {
      return res.status(404).json({ message: 'No hay preguntas en la base de datos para comparar.' });
    }

    let bestMatch = {
      distance: Infinity,
      answer: null,
      originalQuestion: null,
    };

    const normalizedUserQuestion = normalizeText(question);

    for (const qa of allQuestionAnswer) {
      const synonymsMap = qa.synonyms || {};
      const expandedUserQuestion = phraseWithSynonyms(normalizedUserQuestion, synonymsMap);
      const normalizedDbQuestion = normalizeText(qa.question_text);
      const distance = calculateLevenshteinDistance(expandedUserQuestion, normalizedDbQuestion);

      if (distance < bestMatch.distance) {
        bestMatch = { distance, answer: qa.answer_text, originalQuestion: qa.question_text };
      }

      if (distance === 0) break;
    }
    const threshold = bestMatch.originalQuestion ? Math.floor(bestMatch.originalQuestion.length * 0.35) : Infinity;

    if (bestMatch.answer && bestMatch.distance <= threshold) {
      console.log("respuesta mejor por levenshtein", bestMatch.answer);
      
      return res.status(200).json({ answer: bestMatch.answer, matchMethod: 'levenshtein' });
    } else {
      console.log("Coincidencia por Levenshtein no es suficientemente buena. Intentando con palabras clave...");

      for (const qa of allQuestionAnswer) {
        const synonymsMap = qa.synonyms || {};
        
        if (checkKeywords(normalizedUserQuestion, synonymsMap)) {
          console.log("Respuesta encontrada por palabras clave:", qa.answer_text);
          return res.status(200).json({ answer: qa.answer_text, matchMethod: 'keywords' });
        }
      }

      console.log("No se encontró ninguna respuesta coincidente.");
      
      return res.status(404).json({
        message: 'No pude encontrar una respuesta precisa. ¿Podrías reformular tu pregunta?'
      });
    }

  } catch (error) {
    console.error('Error en findBestAnswer:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};