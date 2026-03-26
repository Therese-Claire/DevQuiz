const Result = require('../models/result');
const httpError = require('../utils/httpError');

exports.createResult = async (req, res, next) => {
  try {
    const { categoryId, topicId, score, total } = req.body;

    if (!categoryId || !topicId || typeof score !== 'number' || typeof total !== 'number') {
      return next(httpError(400, 'VALIDATION_ERROR', 'categoryId, topicId, score, and total are required'));
    }

    if (total <= 0 || score < 0 || score > total) {
      return next(httpError(400, 'VALIDATION_ERROR', 'Invalid score or total'));
    }

    const percentage = Math.round((score / total) * 100);

    const result = await Result.create({
      user: req.user.id,
      categoryId,
      topicId,
      score,
      total,
      percentage,
    });

    res.status(201).json({ message: 'Result saved', resultId: result._id });
  } catch (error) {
    next(error);
  }
};

exports.getMyResults = async (req, res, next) => {
  try {
    const results = await Result.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('-__v');
    res.json({ count: results.length, results });
  } catch (error) {
    next(error);
  }
};
