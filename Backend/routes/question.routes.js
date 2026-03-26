const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestionsByCategoryTopic,
} = require('../controllers/question.controller');

// GET /api/questions?categoryId=...&topicId=...
router.get('/', getQuestions);

// GET /api/questions/:categoryId/:topicId
router.get('/:categoryId/:topicId', getQuestionsByCategoryTopic);

module.exports = router;
