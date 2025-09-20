'use strict';

const express = require('express');
const router = express.Router();

const questionAnswerRoutes = require('./questionAnswerRoutes');

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

router.use('/question-answer', questionAnswerRoutes);

module.exports = router;