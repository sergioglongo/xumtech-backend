'use strict';

const express = require('express');
const router = express.Router();
const questionAnswerController = require('../controllers/questionAnswerController');

router.post('/', questionAnswerController.createQuestionAnswer);

router.get('/', questionAnswerController.getAllQuestionAnswers);

router.get('/question', questionAnswerController.findBestAnswer);

router.get('/:id', questionAnswerController.getQuestionAnswerById);

router.put('/:id', questionAnswerController.updateQuestionAnswer);

router.patch('/:id/synonyms', questionAnswerController.addSynonyms);

router.delete('/:id', questionAnswerController.deleteQuestionAnswer);

module.exports = router;