const Question = require('../models/question');
const httpError = require('../utils/httpError');

exports.getQuestions = async (req, res, next) => {
  try {
    const { categoryId, topicId, page = '1', limit = '50' } = req.query;
    if (categoryId && typeof categoryId !== 'string') {
      return next(httpError(400, 'VALIDATION_ERROR', 'categoryId must be a string'));
    }
    if (topicId && typeof topicId !== 'string') {
      return next(httpError(400, 'VALIDATION_ERROR', 'topicId must be a string'));
    }
    const pageNum = Number(page);
    const limitNum = Number(limit);
    if (!Number.isInteger(pageNum) || pageNum < 1) {
      return next(httpError(400, 'VALIDATION_ERROR', 'page must be a positive integer'));
    }
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 200) {
      return next(httpError(400, 'VALIDATION_ERROR', 'limit must be an integer between 1 and 200'));
    }
    const filter = {};
    if (categoryId) filter.categoryId = categoryId;
    if (topicId) filter.topicId = topicId;

    const skip = (pageNum - 1) * limitNum;
    const [questions, total] = await Promise.all([
      Question.find(filter).select('-__v').skip(skip).limit(limitNum),
      Question.countDocuments(filter),
    ]);
    res.json({
      count: questions.length,
      total,
      page: pageNum,
      limit: limitNum,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

exports.getQuestionsByCategoryTopic = async (req, res, next) => {
  try {
    const { categoryId, topicId } = req.params;
    const { page = '1', limit = '50' } = req.query;
    if (!categoryId || !topicId) {
      return next(httpError(400, 'VALIDATION_ERROR', 'categoryId and topicId are required'));
    }
    const pageNum = Number(page);
    const limitNum = Number(limit);
    if (!Number.isInteger(pageNum) || pageNum < 1) {
      return next(httpError(400, 'VALIDATION_ERROR', 'page must be a positive integer'));
    }
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 200) {
      return next(httpError(400, 'VALIDATION_ERROR', 'limit must be an integer between 1 and 200'));
    }
    const skip = (pageNum - 1) * limitNum;
    const filter = { categoryId, topicId };
    const [questions, total] = await Promise.all([
      Question.find(filter).select('-__v').skip(skip).limit(limitNum),
      Question.countDocuments(filter),
    ]);
    res.json({
      count: questions.length,
      total,
      page: pageNum,
      limit: limitNum,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMetadata = async (req, res, next) => {
  try {
    const aggregation = await Question.aggregate([
      {
        $group: {
          _id: { categoryId: '$categoryId', topicId: '$topicId' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.categoryId',
          topics: {
            $push: {
              topicId: '$_id.topicId',
              count: '$count',
            },
          },
          total: { $sum: '$count' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const categories = aggregation.map((c) => ({
      categoryId: c._id,
      total: c.total,
    }));

    const topicsByCategory = aggregation.reduce((acc, c) => {
      acc[c._id] = c.topics;
      return acc;
    }, {});

    res.json({ categories, topicsByCategory });
  } catch (error) {
    next(error);
  }
};

exports.getCounts = async (req, res, next) => {
  try {
    const { categoryId } = req.query;
    if (categoryId && typeof categoryId !== 'string') {
      return next(httpError(400, 'VALIDATION_ERROR', 'categoryId must be a string'));
    }
    const match = categoryId ? { categoryId } : {};
    const aggregation = await Question.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$topicId',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const counts = aggregation.map((t) => ({
      topicId: t._id,
      count: t.count,
    }));

    res.json({ counts });
  } catch (error) {
    next(error);
  }
};
