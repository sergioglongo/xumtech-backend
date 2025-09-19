'use strict';

const express = require('express');
const router = express.Router();

const questionAnswerRoutes = require('./questionAnswerRoutes');

// Ruta de prueba para verificar que el servidor está funcionando (health check)
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

router.use('/question-answer', questionAnswerRoutes);

module.exports = router;