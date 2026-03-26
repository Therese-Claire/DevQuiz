const express = require('express');
const router = express.Router();
const { createResult, getMyResults } = require('../controllers/result.controller');
const auth = require('../middlewares/auth.middleware');

// POST /api/results
router.post('/', auth, createResult);

// GET /api/results/me
router.get('/me', auth, getMyResults);

module.exports = router;
