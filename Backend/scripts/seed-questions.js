require('dotenv').config();
const path = require('path');
const { pathToFileURL } = require('url');
const connectDB = require('../config/database');
const Question = require('../models/question');

async function loadMockQuizData() {
  const mockPath = path.resolve(__dirname, '../../frontend/src/data/mockQuizData.js');
  const fileUrl = pathToFileURL(mockPath).href;
  const mod = await import(fileUrl);
  return mod.quizData;
}

async function seedQuestions() {
  await connectDB();
  const quizData = await loadMockQuizData();

  const documents = [];

  for (const [categoryId, categoryData] of Object.entries(quizData)) {
    const questionsByTopic = categoryData.questions || {};
    for (const [topicId, questions] of Object.entries(questionsByTopic)) {
      for (const q of questions) {
        documents.push({
          categoryId,
          topicId,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
        });
      }
    }
  }

  await Question.deleteMany({});
  if (documents.length > 0) {
    await Question.insertMany(documents);
  }

  console.log(`Seeded ${documents.length} questions.`);
  process.exit(0);
}

seedQuestions().catch((err) => {
  console.error(err);
  process.exit(1);
});
