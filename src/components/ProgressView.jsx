import React, { useState } from 'react';
import { CATEGORIES } from '../data/questions';
import { getOverallStats, getCategoryProgress, clearProgress, getSessions } from '../utils/storage';
import './ProgressView.css';

export default function ProgressView({ setActiveView, setSelectedCategory }) {
  const [confirmClear, setConfirmClear] = useState(false);
  const stats = getOverallStats();
  const sessions = getSessions();

  const handleClear = () => {
    clearProgress();
    window.location.reload();
  };

  const hasData = stats.total > 0;

  return (
    <div className="progress-view animate-fade-up">
      <div className="pv-header">
        <div>
          <h1 className="pv-title">Your Progress</h1>
          <p className="pv-sub">Track your improvement across all categories</p>
        </div>
        {hasData && (
          <div>
            {!confirmClear ? (
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirmClear(true)}>
                🗑 Clear Data
              </button>
            ) : (
              <div className="clear-confirm">
                <span style={{fontSize:'0.82rem'}}>Are you sure?</span>
                <button className="btn btn-danger btn-sm" onClick={handleClear}>Yes, clear all</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setConfirmClear(false)}>Cancel</button>
              </div>
            )}
          </div>
        )}
      </div>

      {!hasData ? (
        <div className="pv-empty">
          <div className="pv-empty-icon">📊</div>
          <h2>No Data Yet</h2>
          <p>Complete your first practice session to see your progress here.</p>
          <button
            className="btn btn-primary btn-md"
            onClick={() => setActiveView('interview')}
          >
            Start Practicing
          </button>
        </div>
      ) : (
        <>
          {/* Overall stats */}
          <div className="pv-stats-row">
            {[
              { label: 'Questions Answered', value: stats.total, icon: '💬', color: 'var(--accent)' },
              { label: 'Excellent (80+)', value: stats.excellent, icon: '🏆', color: 'var(--success)' },
              { label: 'Good (50–79)', value: stats.good, icon: '✅', color: 'var(--accent)' },
              { label: 'Needs Work (<50)', value: stats.needsWork, icon: '📚', color: 'var(--warning)' },
            ].map((s, i) => (
              <div key={i} className="pv-stat-card" style={{ '--stat-color': s.color }}>
                <span className="pv-stat-icon">{s.icon}</span>
                <span className="pv-stat-value mono" style={{ color: s.color }}>{s.value}</span>
                <span className="pv-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Per-category */}
          <section className="pv-section">
            <h2 className="pv-section-title">By Category</h2>
            <div className="pv-cats-grid">
              {CATEGORIES.map(cat => {
                const catStats = stats.categories[cat.id] || { answered: 0, avgScore: 0 };
                const catProgress = getCategoryProgress(cat.id);
                const total = 10;
                const pct = catStats.answered > 0 ? Math.round((catStats.answered / total) * 100) : 0;

                return (
                  <div key={cat.id} className="pv-cat-card">
                    <div className="pv-cat-header">
                      <span className="pv-cat-icon">{cat.icon}</span>
                      <div className="pv-cat-info">
                        <div className="pv-cat-name">{cat.label}</div>
                        <div className="pv-cat-meta mono">
                          {catStats.answered}/{total} questions
                        </div>
                      </div>
                      <div
                        className="pv-cat-score mono"
                        style={{ color: catStats.avgScore >= 80 ? 'var(--success)' : catStats.avgScore >= 50 ? 'var(--accent)' : 'var(--warning)' }}
                      >
                        {catStats.avgScore > 0 ? `${catStats.avgScore}%` : '—'}
                      </div>
                    </div>

                    <div className="pv-cat-bar-wrap">
                      <div
                        className="pv-cat-bar"
                        style={{ width: `${pct}%`, background: `var(--cat-${cat.id}, var(--accent))` }}
                      />
                    </div>

                    {catStats.answered > 0 && (
                      <div className="pv-recent-answers">
                        {Object.entries(catProgress).slice(-5).map(([qId, r]) => (
                          <div key={qId} className="pv-answer-dot" style={{
                            background: r.score >= 80 ? 'var(--success)' : r.score >= 50 ? 'var(--accent)' : 'var(--danger)',
                          }} title={`Score: ${r.score}%`} />
                        ))}
                      </div>
                    )}

                    <button
                      className="btn btn-ghost btn-sm pv-cat-practice-btn"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setActiveView('interview');
                      }}
                    >
                      Practice →
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Score distribution */}
          {stats.total > 0 && (
            <section className="pv-section">
              <h2 className="pv-section-title">Score Distribution</h2>
              <div className="pv-dist-card">
                {[
                  { label: 'Excellent', range: '80–100', count: stats.excellent, color: 'var(--success)' },
                  { label: 'Good', range: '50–79', count: stats.good, color: 'var(--accent)' },
                  { label: 'Needs Work', range: '0–49', count: stats.needsWork, color: 'var(--warning)' },
                ].map((d, i) => (
                  <div key={i} className="pv-dist-row">
                    <span className="pv-dist-label">{d.label}</span>
                    <span className="pv-dist-range mono">{d.range}</span>
                    <div className="pv-dist-bar-wrap">
                      <div
                        className="pv-dist-bar"
                        style={{
                          width: stats.total > 0 ? `${(d.count / stats.total) * 100}%` : '0%',
                          background: d.color,
                        }}
                      />
                    </div>
                    <span className="pv-dist-count mono" style={{ color: d.color }}>{d.count}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
