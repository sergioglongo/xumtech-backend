'use strict';

const express = require('express');
const router = express.Router();

const questionAnswerRoutes = require('./questionAnswerRoutes');

router.use('/question-answer', questionAnswerRoutes);

module.exports = router;