'use strict';

const db = require('../models');
const { calculateLevenshteinDistance } = require('../tools/levenshtein');
const { checkKeywords } = require('../tools/keywordChecker');
const { phraseWithSynonyms } = require('../tools/phraseWithSynonyms');
const { normalizeText } = require('../tools/textTools');

// POST /api/qa - Crear un nuevo registro
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

// GET /api/qa - Obtener todos los registros
exports.getAllQuestionAnswers = async (req, res) => {
  try {
    const allQuestionAnswer = await db.QuestionAnswer.findAll();
    res.status(200).json(allQuestionAnswer);
  } catch (error) {
    console.error('Error al obtener QuestionAnswers:', error);
    res.status(500).json({ error: 'Error al obtener los registros.' });
  }
};

// GET /api/qa/:id - Obtener un registro por su ID
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

// PUT /api/qa/:id - Actualizar un registro por su ID
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

// PATCH /api/qa/:id/synonyms - Añadir o actualizar sinónimos
exports.addSynonyms = async (req, res) => {
  try {
    const { id } = req.params;
    const newSynonymsData = req.body;

    // 1. Validar que el cuerpo de la solicitud sea un objeto no vacío
    if (!newSynonymsData || typeof newSynonymsData !== 'object' || Array.isArray(newSynonymsData) || Object.keys(newSynonymsData).length === 0) {
      return res.status(400).json({ error: 'Formato incorrecto' });
    }

    // 2. Encontrar el registro existente
    const qa = await db.QuestionAnswer.findByPk(id);
    if (!qa) {
      return res.status(404).json({ error: 'Registro no encontrado.' });
    }

    // 3. Fusionar los sinónimos nuevos con los existentes
    const currentSynonyms = qa.synonyms || {};

    for (const [keyword, synonyms] of Object.entries(newSynonymsData)) {
      if (Array.isArray(synonyms)) {
        const existingSyns = currentSynonyms[keyword] || [];
        // Usamos un Set para combinar y eliminar duplicados automáticamente
        const updatedSyns = [...new Set([...existingSyns, ...synonyms])];
        currentSynonyms[keyword] = updatedSyns;
      }
    }

    // 4. Actualizar la columna de sinónimos y guardar
    qa.synonyms = currentSynonyms;
    // ¡IMPORTANTE! Notificar a Sequelize que el campo JSONB ha cambiado.
    // Sequelize no detecta cambios internos en un objeto JSONB por sí solo.
    qa.changed('synonyms', true);

    await qa.save();

    // 5. Devolver la respuesta con los datos actualizados
    res.status(200).json({ message: 'Sinónimos añadidos/actualizados exitosamente.', data: qa });

  } catch (error) {
    console.error('Error al añadir sinónimos:', error);
    res.status(500).json({ error: 'Error interno del servidor al añadir sinónimos.' });
  }
};

// DELETE /api/qa/:id - Borrar un registro por su ID
exports.deleteQuestionAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const qa = await db.QuestionAnswer.findByPk(id);
    if (!qa) {
      return res.status(404).json({ error: 'Registro no encontrado.' });
    }

    await qa.destroy();
    res.status(204).send(); // 204 No Content: Éxito sin devolver contenido
  } catch (error) {
    console.error('Error al eliminar QuestionAnswer:', error);
    res.status(500).json({ error: 'Error al eliminar el registro.' });
  }
};

// GET /api/question-answer/question?q=... - Encontrar la mejor respuesta
exports.findBestAnswer = async (req, res) => {
  const { question } = req.query;
  console.log("question recibida", question);
  
  if (!question || typeof question !== 'string' || question.trim() === '') {
    return res.status(400).json({ error: 'El parámetro "q" con la pregunta es requerido.' });
  }

  try {
    // 1. Obtener todas las preguntas y sus sinónimos de la base de datos
    const allQuestionAnswer = await db.QuestionAnswer.findAll({ raw: true });
    
    // --- NUEVO LOG PARA DEPURACIÓN ---
    // console.log('Datos crudos desde la BD:', JSON.stringify(allQuestionAnswer, null, 2));

    if (allQuestionAnswer.length === 0) {
      return res.status(404).json({ message: 'No hay preguntas en la base de datos para comparar.' });
    }

    let bestMatch = {
      distance: Infinity,
      answer: null,
      originalQuestion: null,
    };

    /**
     * Normaliza un texto: lo convierte a minúsculas, quita acentos y signos de puntuación.
     * Esto es crucial para que las comparaciones sean robustas.
     * Ej: "¿Qué tecnología usar?" -> "que tecnologia usar"
     * @param {string} text El texto a normalizar.
     * @returns {string} El texto normalizado.
     */

    const normalizedUserQuestion = normalizeText(question);

    // 2. Iterar sobre cada registro de la BD para encontrar la mejor coincidencia
    for (const qa of allQuestionAnswer) {
      const synonymsMap = qa.synonyms || {};
      const expandedUserQuestion = phraseWithSynonyms(normalizedUserQuestion, synonymsMap);
      const normalizedDbQuestion = normalizeText(qa.question_text);

      // 3. Calcular la distancia de Levenshtein
      const distance = calculateLevenshteinDistance(expandedUserQuestion, normalizedDbQuestion);

      // 4. Actualizar la mejor coincidencia si encontramos una mejor
      if (distance < bestMatch.distance) {
        bestMatch = { distance, answer: qa.answer_text, originalQuestion: qa.question_text };
      }

      // Si la distancia es 0, es una coincidencia perfecta, no necesitamos seguir buscando.
      if (distance === 0) break;
    }

    // 5. Decidir si la mejor coincidencia es "suficientemente buena"
    // Umbral: la distancia debe ser menor o igual al 25% de la longitud de la pregunta encontrada.
    const threshold = bestMatch.originalQuestion ? Math.floor(bestMatch.originalQuestion.length * 0.35) : Infinity;

    if (bestMatch.answer && bestMatch.distance <= threshold) {
      console.log("respuesta mejor por levenshtein", bestMatch.answer);
      
      return res.status(200).json({ answer: bestMatch.answer, matchMethod: 'levenshtein' });
    } else {
      // --- SEGUNDO INTENTO: BÚSQUEDA POR PALABRAS CLAVE ---
      // Si Levenshtein no dio un resultado claro, usamos checkKeywords como último recurso.
      console.log("Coincidencia por Levenshtein no es suficientemente buena. Intentando con palabras clave...");

      for (const qa of allQuestionAnswer) {
        const synonymsMap = qa.synonyms || {};
        // ¡CORRECCIÓN! Debemos expandir la pregunta del usuario con los sinónimos
        // de la pregunta actual (qa) antes de pasarla a checkKeywords.
        // Esto evita usar una versión "contaminada" del bucle de Levenshtein.
        const expandedUserQuestionForKeywords = phraseWithSynonyms(normalizedUserQuestion, synonymsMap);

        if (checkKeywords(expandedUserQuestionForKeywords, synonymsMap)) {
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