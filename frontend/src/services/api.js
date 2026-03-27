import { supabase } from './supabase';
const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map();

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function fetchQuestions(params = {}) {
  const cacheKey = `questions:${JSON.stringify(params)}`;
  const cached = getCache(cacheKey);
  try {
    const page = Number(params.page || 1);
    const limit = Number(params.limit || 50);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('questions')
      .select('id, category_id, topic_id, question, options, correct_answer', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (params.categoryId) query = query.eq('category_id', params.categoryId);
    if (params.topicId) query = query.eq('topic_id', params.topicId);

    const { data, error, count } = await query;
    if (error) throw error;

    const payload = {
      count: data.length,
      total: count || 0,
      page,
      limit,
      questions: data,
    };
    setCache(cacheKey, payload);
    return payload;
  } catch (err) {
    if (cached) return cached;
    throw err;
  }
}

export async function fetchQuestionsByCategoryTopic(categoryId, topicId) {
  return fetchQuestions({ categoryId, topicId });
}

export async function fetchMetadata() {
  const cacheKey = 'metadata';
  const cached = getCache(cacheKey);
  try {
    const { data, error } = await supabase
      .from('question_counts')
      .select('category_id, topic_id, count');
    if (error) throw error;

    const categoriesMap = new Map();
    const topicsByCategory = {};
    for (const row of data) {
      categoriesMap.set(row.category_id, (categoriesMap.get(row.category_id) || 0) + row.count);
      if (!topicsByCategory[row.category_id]) topicsByCategory[row.category_id] = [];
      topicsByCategory[row.category_id].push({ topicId: row.topic_id, count: row.count });
    }

    const categories = Array.from(categoriesMap.entries()).map(([categoryId, total]) => ({
      categoryId,
      total,
    }));

    const payload = { categories, topicsByCategory };
    setCache(cacheKey, payload);
    return payload;
  } catch (err) {
    if (cached) return cached;
    throw err;
  }
}

export async function fetchCounts(categoryId) {
  const cacheKey = `counts:${categoryId || 'all'}`;
  const cached = getCache(cacheKey);
  try {
    let query = supabase.from('question_counts').select('topic_id, count');
    if (categoryId) query = query.eq('category_id', categoryId);
    const { data, error } = await query;
    if (error) throw error;
    const payload = { counts: data.map((t) => ({ topicId: t.topic_id, count: t.count })) };
    setCache(cacheKey, payload);
    return payload;
  } catch (err) {
    if (cached) return cached;
    throw err;
  }
}

export async function registerUser(payload) {
  const { email, password, username } = payload;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  if (data.user) {
    const { error: profileError } = await supabase.from('users').insert({
      id: data.user.id,
      username,
      email,
    });
    if (profileError) throw profileError;
  }
  return data;
}

export async function loginUser(payload) {
  const { email, password } = payload;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function fetchMyResults() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) return { count: 0, results: [] };

  const { data, error } = await supabase
    .from('results')
    .select('id, user_id, category_id, topic_id, score, total, percentage, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return { count: data.length, results: data };
}

export async function createResult(payload) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) throw new Error('Not authenticated');

  const { categoryId, topicId, score, total } = payload;
  const percentage = Math.round((score / total) * 100);
  const { data, error } = await supabase.from('results').insert({
    user_id: userId,
    category_id: categoryId,
    topic_id: topicId,
    score,
    total,
    percentage,
  });
  if (error) throw error;
  return data;
}
