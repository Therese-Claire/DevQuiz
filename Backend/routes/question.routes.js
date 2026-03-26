const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestionsByCategoryTopic,
  getMetadata,
  getCounts,
} = require('../controllers/question.controller');

// GET /api/questions?categoryId=...&topicId=...
router.get('/', getQuestions);

// GET /api/questions/metadata
router.get('/metadata', getMetadata);

// GET /api/questions/counts?categoryId=...
router.get('/counts', getCounts);

// GET /api/questions/:categoryId/:topicId
router.get('/:categoryId/:topicId', getQuestionsByCategoryTopic);

module.exports = router;
