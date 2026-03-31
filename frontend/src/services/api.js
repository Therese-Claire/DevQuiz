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

export function clearCache() {
  cache.clear();
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
      .select('id, category_id, topic_id, question, options', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    query = query.eq('is_archived', false);

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

export async function fetchQuizSets() {
  const cacheKey = 'quiz_sets';
  const cached = getCache(cacheKey);
  try {
    const { data, error } = await supabase
      .from('quiz_sets')
      .select('id, name, description, difficulty, created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    const payload = data || [];
    setCache(cacheKey, payload);
    return payload;
  } catch (err) {
    if (cached) return cached;
    throw err;
  }
}

export async function fetchQuizSetQuestions(setId) {
  const cacheKey = `quiz_set:${setId}`;
  const cached = getCache(cacheKey);
  try {
    const { data: setData, error: setError } = await supabase
      .from('quiz_sets')
      .select('id, name, description, difficulty')
      .eq('id', setId)
      .single();
    if (setError) throw setError;

    const { data, error } = await supabase
      .from('quiz_set_questions')
      .select('question_id, questions(id, category_id, topic_id, question, options, correct_answer, difficulty, is_archived)')
      .eq('quiz_set_id', setId)
      .eq('questions.is_archived', false);
    if (error) throw error;

    const questions = (data || [])
      .map((row) => row.questions)
      .filter(Boolean);

    const payload = { set: setData, questions };
    setCache(cacheKey, payload);
    return payload;
  } catch (err) {
    if (cached) return cached;
    throw err;
  }
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
  const email = payload.email?.trim().toLowerCase();
  const password = payload.password; // Don't trim/lowercase passwords!
  const username = payload.username?.trim();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function loginUser(payload) {
  const email = payload.email?.trim().toLowerCase();
  const password = payload.password;
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
  await evaluateBadges({ userId, percentage });
  return data;
}

async function evaluateBadges({ userId, percentage }) {
  // Fetch user results for streak
  const { data: results, error } = await supabase
    .from('results')
    .select('created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) return;

  const days = new Set(
    results
      .map((r) => new Date(r.created_at))
      .filter((d) => !Number.isNaN(d.getTime()))
      .map((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime())
  );
  const sortedDays = Array.from(days).sort((a, b) => b - a);
  let streak = 0;
  let current = new Date();
  current = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
  for (const day of sortedDays) {
    if (day === current) {
      streak += 1;
      current -= 24 * 60 * 60 * 1000;
    } else if (day < current) {
      break;
    }
  }

  const toAward = [];
  toAward.push('first_quiz');
  if (percentage === 100) toAward.push('perfect_score');
  if (streak >= 3) toAward.push('hot_streak_3');
  if (streak >= 7) toAward.push('hot_streak_7');

  const rows = toAward.map((badgeId) => ({ user_id: userId, badge_id: badgeId }));
  await supabase.from('user_badges').upsert(rows);
}

export async function fetchLeaderboard({ categoryId, topicId, since } = {}) {
  const { data, error } = await supabase.rpc('get_leaderboard', {
    p_category_id: categoryId || null,
    p_topic_id: topicId || null,
    p_since: since || null,
  });
  if (error) throw error;
  return data || [];
}

export async function validateAnswer(questionId, userAnswer) {
  const { data, error } = await supabase.rpc('validate_answer', {
    p_question_id: questionId,
    p_user_answer: userAnswer,
  });
  if (error) throw error;
  return data; // { is_correct: boolean, correct_answer: string }
}

export async function createQuizSetResult({ setId, score, total }) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) throw new Error('Not authenticated');

  const percentage = Math.round((score / total) * 100);
  const { error } = await supabase.from('quiz_set_results').insert({
    user_id: userId,
    quiz_set_id: setId,
    score,
    total,
    percentage,
  });
  if (error) throw error;
}

export async function fetchCategoryStats(categoryId) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) return null;

  const { data, error } = await supabase.rpc('get_category_stats', {
    p_user_id: userId,
    p_category_id: categoryId
  });
  if (error) throw error;
  return data || null;
}

export async function fetchTopicMastery(categoryId) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) return null;

  const { data, error } = await supabase.rpc('get_topic_mastery', {
    p_user_id: userId,
    p_category_id: categoryId
  });
  if (error) throw error;
  return data || [];
}

export async function reportQuestion({ questionId, reason }) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase.from('question_reports').insert({
    question_id: questionId,
    user_id: userId,
    reason,
  });
  if (error) throw error;
}

export async function fetchUserStats() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) return null;

  const { data, error } = await supabase.rpc('get_user_stats', { user_uuid: userId });
  if (error) throw error;
  return data;
}

export async function uploadAvatar(file) {
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only JPG, PNG, WebP, or GIF images are allowed.');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Image must be smaller than 2 MB.');
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) throw new Error('Not authenticated');

  // Always overwrite the same path so no orphan files accumulate
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/gif' ? 'gif' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const path = `${userId}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
  const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`; // cache-busting

  const { error: rpcError } = await supabase.rpc('update_avatar_url', {
    p_user_id: userId,
    p_url: publicUrl,
  });
  if (rpcError) throw rpcError;

  return publicUrl;
}

export async function updateUsername(newUsername) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase.rpc('update_username', {
    p_user_id: userId,
    p_username: newUsername,
  });
  if (error) throw error;
}

export async function fetchUserLeaderboardRank({ categoryId, topicId, since } = {}) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) return null;

  const { data, error } = await supabase.rpc('get_user_leaderboard_rank', {
    p_user_id: userId,
    p_category_id: categoryId || null,
    p_topic_id: topicId || null,
    p_since: since || null,
  });
  if (error) throw error;
  return data; // { rank, total_users, score, avg, percentile }
}

export async function fetchLeaderboardMeta() {
  const { data, error } = await supabase.rpc('get_leaderboard_meta');
  if (error) throw error;
  return data; // { total_xp, top_category }
}
