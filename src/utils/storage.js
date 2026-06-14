const STORAGE_KEYS = {
  PROGRESS: 'devprep_progress',
  SESSIONS: 'devprep_sessions',
  SETTINGS: 'devprep_settings',
  API_KEY: 'devprep_openrouter_key',
};

// ── Progress Tracking ──────────────────────────
export function getProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function saveQuestionResult(questionId, category, result) {
  const progress = getProgress();
  if (!progress[category]) progress[category] = {};
  progress[category][questionId] = {
    ...result,
    timestamp: Date.now(),
  };
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
}

export function getCategoryProgress(category) {
  const progress = getProgress();
  return progress[category] || {};
}

export function getOverallStats() {
  const progress = getProgress();
  const stats = { total: 0, excellent: 0, good: 0, needsWork: 0, categories: {} };

  for (const [cat, questions] of Object.entries(progress)) {
    const q = Object.values(questions);
    stats.total += q.length;
    stats.excellent += q.filter(r => r.score >= 80).length;
    stats.good += q.filter(r => r.score >= 50 && r.score < 80).length;
    stats.needsWork += q.filter(r => r.score < 50).length;
    stats.categories[cat] = {
      answered: q.length,
      avgScore: q.length ? Math.round(q.reduce((a, b) => a + (b.score || 0), 0) / q.length) : 0,
    };
  }
  return stats;
}

export function clearProgress() {
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
}

// ── Sessions ───────────────────────────────────
export function getSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveSession(session) {
  const sessions = getSessions();
  sessions.unshift({ ...session, id: Date.now() });
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions.slice(0, 20)));
}

// ── Settings ───────────────────────────────────
export function getSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : { theme: 'dark', timerDuration: 120 };
  } catch { return { theme: 'dark', timerDuration: 120 }; }
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// ── API Key ────────────────────────────────────
export function getApiKey() {
  return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
}

export function saveApiKey(key) {
  if (key) localStorage.setItem(STORAGE_KEYS.API_KEY, key);
  else localStorage.removeItem(STORAGE_KEYS.API_KEY);
}
