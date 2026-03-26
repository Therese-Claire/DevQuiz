const Question = require('../models/question');

exports.getQuestions = async (req, res, next) => {
  try {
    const { categoryId, topicId } = req.query;
    const filter = {};
    if (categoryId) filter.categoryId = categoryId;
    if (topicId) filter.topicId = topicId;

    const questions = await Question.find(filter).select('-__v');
    res.json({ count: questions.length, questions });
  } catch (error) {
    next(error);
  }
};

exports.getQuestionsByCategoryTopic = async (req, res, next) => {
  try {
    const { categoryId, topicId } = req.params;
    const questions = await Question.find({ categoryId, topicId }).select('-__v');
    res.json({ count: questions.length, questions });
  } catch (error) {
    next(error);
  }
};
