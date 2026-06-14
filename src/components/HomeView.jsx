import React from 'react';
import { CATEGORIES } from '../data/questions';
import { getOverallStats } from '../utils/storage';
import './HomeView.css';

export default function HomeView({ setActiveView, setSelectedCategory }) {
  const stats = getOverallStats();

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setActiveView('interview');
  };

  const catColors = {
    html: 'var(--cat-html)',
    css: 'var(--cat-css)',
    js: 'var(--cat-js)',
    react: 'var(--cat-react)',
  };

  return (
    <div className="home animate-fade-up">
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          <span>AI-Powered Interview Training</span>
        </div>
        <h1 className="hero-title">
          Ace Your
          <span className="hero-accent"> Frontend</span>
          <br />Interview
        </h1>
        <p className="hero-sub">
          Practice with real interview questions, get instant AI feedback,
          and track your progress — all in one place.
        </p>
        <div className="hero-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => setActiveView('interview')}
          >
            <span>Start Practice</span>
            <span>→</span>
          </button>
          <button
            className="btn btn-ghost btn-lg"
            onClick={() => setActiveView('progress')}
          >
            View Progress
          </button>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num">40+</span>
            <span className="hero-stat-label">Questions</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-num">4</span>
            <span className="hero-stat-label">Categories</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-num">AI</span>
            <span className="hero-stat-label">Feedback</span>
          </div>
          {stats.total > 0 && (
            <>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-num">{stats.total}</span>
                <span className="hero-stat-label">Answered</span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-header">
          <h2 className="section-title">Choose a Category</h2>
          <p className="section-sub">Deep-dive into any topic or practice mixed questions</p>
        </div>

        <div className="categories-grid">
          {CATEGORIES.map((cat, i) => {
            const catStats = stats.categories?.[cat.id] || {};
            return (
              <button
                key={cat.id}
                className="cat-card"
                onClick={() => handleCategoryClick(cat.id)}
                style={{ '--cat-color': catColors[cat.id], animationDelay: `${i * 0.07}s` }}
              >
                <div className="cat-icon">{cat.icon}</div>
                <div className="cat-info">
                  <div className="cat-name">{cat.label}</div>
                  <div className="cat-count">10 questions</div>
                </div>
                {catStats.answered > 0 && (
                  <div className="cat-progress-badge">
                    <span>{catStats.avgScore}%</span>
                  </div>
                )}
                <div className="cat-arrow">→</div>
                <div className="cat-glow" />
              </button>
            );
          })}

          <button
            className="cat-card cat-card--mixed"
            onClick={() => handleCategoryClick('mixed')}
            style={{ animationDelay: '0.28s' }}
          >
            <div className="cat-icon">🎯</div>
            <div className="cat-info">
              <div className="cat-name">Mixed Mode</div>
              <div className="cat-count">All categories</div>
            </div>
            <div className="cat-arrow">→</div>
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2 className="section-title">Everything You Need</h2>
        <div className="features-grid">
          {[
            { icon: '🎙️', title: 'Voice Answers', desc: 'Speak your answers naturally using the Web Speech API — just like a real interview.' },
            { icon: '🤖', title: 'AI Feedback', desc: 'Get scored answers with detailed strengths, improvement areas, and model answers.' },
            { icon: '⏱️', title: 'Timed Practice', desc: 'Interview-style timer keeps you sharp and helps you pace your responses.' },
            { icon: '📈', title: 'Progress Tracking', desc: 'Track scores across sessions, see trends by category, and identify weak spots.' },
          ].map((f, i) => (
            <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
