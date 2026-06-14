import React, { useState } from 'react';
import { getApiKey, saveApiKey, getSettings, saveSettings } from '../utils/storage';
import { OPENROUTER_MODELS } from '../data/questions';
import './SettingsView.css';

export default function SettingsView({ theme, toggleTheme }) {
  const [apiKey, setApiKey] = useState(getApiKey);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const settings = getSettings();
  const [timerDuration, setTimerDuration] = useState(settings.timerDuration || 120);
  const [aiModel, setAiModel] = useState(settings.aiModel || 'mistralai/mistral-7b-instruct');

  const handleSave = () => {
    saveApiKey(apiKey.trim());
    saveSettings({ ...settings, timerDuration: Number(timerDuration), aiModel });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const maskedKey = apiKey ? `${apiKey.slice(0, 8)}${'•'.repeat(Math.max(0, apiKey.length - 12))}${apiKey.slice(-4)}` : '';

  return (
    <div className="settings-view animate-fade-up">
      <div className="sv-header">
        <h1 className="sv-title">Settings</h1>
        <p className="sv-sub">Configure your interview experience</p>
      </div>

      <div className="sv-sections">
        {/* API Key */}
        <section className="sv-section">
          <div className="sv-section-header">
            <h2 className="sv-section-title">🔑 OpenRouter API Key</h2>
            <p className="sv-section-desc">
              Required for AI feedback. Get a free key at{' '}
              <a href="https://openrouter.ai" target="_blank" rel="noreferrer" className="sv-link">
                openrouter.ai
              </a>
              {' '}— free models like Mistral are available.
            </p>
          </div>

          <div className="sv-field">
            <label className="sv-label">API Key</label>
            <div className="sv-input-row">
              <input
                type={showKey ? 'text' : 'password'}
                className="sv-input"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                autoComplete="off"
                spellCheck={false}
              />
              <button
                className="btn btn-ghost btn-sm sv-eye-btn"
                onClick={() => setShowKey(v => !v)}
                type="button"
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
            {apiKey && (
              <p className="sv-key-hint mono">Stored: {maskedKey}</p>
            )}
          </div>

          <div className="sv-key-info">
            <div className="sv-key-info-item">
              <span>🆓</span>
              <span>Mistral 7B, Gemma 2 9B are free on OpenRouter</span>
            </div>
            <div className="sv-key-info-item">
              <span>🔒</span>
              <span>Key stored locally in your browser only — never sent to our servers</span>
            </div>
          </div>
        </section>

        {/* AI Model */}
        <section className="sv-section">
          <div className="sv-section-header">
            <h2 className="sv-section-title">🤖 AI Model</h2>
            <p className="sv-section-desc">Choose the model used for feedback generation.</p>
          </div>

          <div className="sv-field">
            <label className="sv-label">Model</label>
            <select
              className="sv-select"
              value={aiModel}
              onChange={e => setAiModel(e.target.value)}
            >
              {OPENROUTER_MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Timer */}
        <section className="sv-section">
          <div className="sv-section-header">
            <h2 className="sv-section-title">⏱️ Interview Timer</h2>
            <p className="sv-section-desc">Time allowed per question during practice sessions.</p>
          </div>

          <div className="sv-field">
            <label className="sv-label">Duration per question</label>
            <div className="sv-timer-options">
              {[60, 90, 120, 180, 300].map(secs => (
                <button
                  key={secs}
                  className={`sv-timer-btn ${timerDuration === secs ? 'sv-timer-btn--active' : ''}`}
                  onClick={() => setTimerDuration(secs)}
                  type="button"
                >
                  {secs < 60 ? `${secs}s` : `${secs / 60}m`}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Theme */}
        <section className="sv-section">
          <div className="sv-section-header">
            <h2 className="sv-section-title">🎨 Appearance</h2>
            <p className="sv-section-desc">Toggle between dark and light mode.</p>
          </div>

          <div className="sv-theme-row">
            <button
              className={`sv-theme-btn ${theme === 'dark' ? 'sv-theme-btn--active' : ''}`}
              onClick={() => theme !== 'dark' && toggleTheme()}
            >
              <span className="sv-theme-icon">🌙</span>
              <span>Dark Mode</span>
              {theme === 'dark' && <span className="sv-active-dot" />}
            </button>
            <button
              className={`sv-theme-btn ${theme === 'light' ? 'sv-theme-btn--active' : ''}`}
              onClick={() => theme !== 'light' && toggleTheme()}
            >
              <span className="sv-theme-icon">☀️</span>
              <span>Light Mode</span>
              {theme === 'light' && <span className="sv-active-dot" />}
            </button>
          </div>
        </section>

        {/* Save button */}
        <div className="sv-save-row">
          <button className={`btn btn-primary btn-lg ${saved ? 'btn-saved' : ''}`} onClick={handleSave}>
            {saved ? '✅ Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
