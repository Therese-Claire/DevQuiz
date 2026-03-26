const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    categoryId: { type: String, required: true, index: true },
    topicId: { type: String, required: true, index: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
