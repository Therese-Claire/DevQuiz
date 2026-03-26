const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
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

async function apiGet(path) {
  const url = `${API_BASE_URL}${path}`;
  const cached = getCache(url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed with ${response.status}`);
    }
    const data = await response.json();
    setCache(url, data);
    return data;
  } catch (err) {
    if (cached) return cached;
    throw err;
  }
}

async function apiPost(path, body) {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with ${response.status}`);
  }
  return response.json();
}

async function apiGetAuth(path) {
  const url = `${API_BASE_URL}${path}`;
  const token = localStorage.getItem('devquiz_token');
  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with ${response.status}`);
  }
  return response.json();
}

export async function fetchQuestions(params = {}) {
  const query = new URLSearchParams(params).toString();
  const path = query ? `/api/questions?${query}` : '/api/questions';
  return apiGet(path);
}

export async function fetchQuestionsByCategoryTopic(categoryId, topicId) {
  return apiGet(`/api/questions/${categoryId}/${topicId}`);
}

export async function registerUser(payload) {
  return apiPost('/api/auth/register', payload);
}

export async function loginUser(payload) {
  return apiPost('/api/auth/login', payload);
}

export async function fetchMyResults() {
  return apiGetAuth('/api/results/me');
}
