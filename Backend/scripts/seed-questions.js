require('dotenv').config();
const path = require('path');
const { pathToFileURL } = require('url');
const db = require('../config/db');

async function loadMockQuizData() {
  const mockPath = path.resolve(__dirname, '../../frontend/src/data/mockQuizData.js');
  const fileUrl = pathToFileURL(mockPath).href;
  const mod = await import(fileUrl);
  return mod.quizData;
}

async function seedQuestions() {
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

  await db.query('delete from questions');
  if (documents.length > 0) {
    const values = [];
    const params = [];
    let idx = 1;
    for (const doc of documents) {
      params.push(`($${idx}, $${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4})`);
      values.push(doc.categoryId, doc.topicId, doc.question, doc.options, doc.correctAnswer);
      idx += 5;
    }
    await db.query(
      `insert into questions (category_id, topic_id, question, options, correct_answer)
       values ${params.join(', ')}`,
      values
    );
  }

  console.log(`Seeded ${documents.length} questions.`);
  process.exit(0);
}

seedQuestions().catch((err) => {
  console.error(err);
  process.exit(1);
});
