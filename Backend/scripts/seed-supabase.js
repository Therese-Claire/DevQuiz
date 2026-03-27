require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function loadQuizMeta() {
  const categoriesPath = path.resolve(__dirname, '../../database/seed/categories.json');
  const topicsPath = path.resolve(__dirname, '../../database/seed/topics.json');
  const categoriesRaw = fs.readFileSync(categoriesPath, 'utf8');
  const topicsRaw = fs.readFileSync(topicsPath, 'utf8');
  return {
    categories: JSON.parse(categoriesRaw),
    topicsByCategory: JSON.parse(topicsRaw),
  };
}

async function loadQuestionsJson() {
  const jsonPath = path.resolve(__dirname, '../../database/seed/questions.json');
  const raw = fs.readFileSync(jsonPath, 'utf8');
  return JSON.parse(raw);
}

async function seed() {
  const mode = process.argv[2] || 'all'; // all | meta | questions
  const { categories, topicsByCategory } = await loadQuizMeta();
  const quizData = await loadQuestionsJson();

  // Categories
  if ((mode === 'all' || mode === 'meta') && categories && categories.length > 0) {
    const { error } = await supabase
      .from('categories')
      .upsert(categories.map((c) => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
        description: c.description,
      })));
    if (error) throw error;
  }

  // Topics
  const topicRows = [];
  if (mode === 'all' || mode === 'meta') {
    for (const [categoryId, topics] of Object.entries(topicsByCategory || {})) {
      for (const t of topics) {
        topicRows.push({
          id: t.id,
          category_id: categoryId,
          name: t.name,
          description: t.description,
        });
      }
    }
    if (topicRows.length > 0) {
      const { error } = await supabase
        .from('topics')
        .upsert(topicRows, { onConflict: 'category_id,id' });
      if (error) throw error;
    }
  }

  // Questions (if available in mockQuizData)
  const questionRows = [];
  if (mode === 'all' || mode === 'questions') {
    for (const [categoryId, categoryData] of Object.entries(quizData || {})) {
      const questionsByTopic = categoryData.questions || {};
      for (const [topicId, questions] of Object.entries(questionsByTopic)) {
        for (const q of questions) {
          questionRows.push({
            category_id: categoryId,
            topic_id: topicId,
            question: q.question,
            options: q.options,
            correct_answer: q.correctAnswer,
          });
        }
      }
    }
    if (questionRows.length > 0) {
      const { error } = await supabase.from('questions').insert(questionRows);
      if (error) throw error;
    } else {
      console.log('No questions found in questions.json. Skipping question seed.');
    }
  }

  console.log(`Supabase seed complete (${mode}).`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
