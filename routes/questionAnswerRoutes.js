'use strict';

const express = require('express');
const router = express.Router();
const questionAnswerController = require('../controllers/questionAnswerController');

// Define las rutas para el CRUD de QuestionAnswer

// Crear un nuevo registro
router.post('/', questionAnswerController.createQuestionAnswer);

// Obtener todos los registros
router.get('/', questionAnswerController.getAllQuestionAnswers);

// Encontrar la mejor respuesta para una pregunta dada
router.get('/question', questionAnswerController.findBestAnswer);

// Obtener un registro específico por ID
router.get('/:id', questionAnswerController.getQuestionAnswerById);

// Actualizar un registro por ID
router.put('/:id', questionAnswerController.updateQuestionAnswer);

// Añadir o actualizar sinónimos para un registro por ID
router.patch('/:id/synonyms', questionAnswerController.addSynonyms);

// Eliminar un registro por ID
router.delete('/:id', questionAnswerController.deleteQuestionAnswer);

module.exports = router;