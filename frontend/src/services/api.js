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
    let message = `Request failed with ${response.status}`;
    let code = 'REQUEST_ERROR';
    try {
      const payload = await response.json();
      if (payload?.error?.message) message = payload.error.message;
      if (payload?.error?.code) code = payload.error.code;
    } catch {
      const errorText = await response.text();
      if (errorText) message = errorText;
    }
    const err = new Error(message);
    err.code = code;
    throw err;
  }
  return response.json();
}

async function apiPostAuth(path, body) {
  const url = `${API_BASE_URL}${path}`;
  const token = localStorage.getItem('devquiz_token');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    let message = `Request failed with ${response.status}`;
    let code = 'REQUEST_ERROR';
    try {
      const payload = await response.json();
      if (payload?.error?.message) message = payload.error.message;
      if (payload?.error?.code) code = payload.error.code;
    } catch {
      const errorText = await response.text();
      if (errorText) message = errorText;
    }
    const err = new Error(message);
    err.code = code;
    throw err;
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

export async function fetchMetadata() {
  return apiGet('/api/questions/metadata');
}

export async function fetchCounts(categoryId) {
  const query = categoryId ? `?categoryId=${encodeURIComponent(categoryId)}` : '';
  return apiGet(`/api/questions/counts${query}`);
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

export async function createResult(payload) {
  return apiPostAuth('/api/results', payload);
}
