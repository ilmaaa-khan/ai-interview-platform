import React from 'react';
import './FeedbackPanel.css';

export default function FeedbackPanel({ feedback, answer }) {
  if (!feedback) return null;

  const { score, grade, summary, strengths = [], improvements = [], modelAnswer, resources = [] } = feedback;

  const scoreColor =
    score >= 80 ? 'var(--success)' :
    score >= 60 ? 'var(--accent)' :
    score >= 40 ? 'var(--warning)' : 'var(--danger)';

  const gradeIcon =
    score >= 80 ? '🏆' :
    score >= 60 ? '✅' :
    score >= 40 ? '💡' : '📚';

  return (
    <div className="feedback-panel animate-fade-up">
      {/* Score header */}
      <div className="fb-score-row">
        <div className="fb-score-circle" style={{ '--score-color': scoreColor }}>
          <svg viewBox="0 0 40 40" className="fb-score-svg">
            <circle cx="20" cy="20" r="16" className="fb-score-track" />
            <circle
              cx="20" cy="20" r="16"
              className="fb-score-fill"
              style={{ stroke: scoreColor, strokeDasharray: `${score} 100` }}
            />
          </svg>
          <span className="fb-score-num mono" style={{ color: scoreColor }}>{score}</span>
        </div>
        <div className="fb-grade-info">
          <div className="fb-grade" style={{ color: scoreColor }}>
            {gradeIcon} {grade}
          </div>
          <p className="fb-summary">{summary}</p>
        </div>
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="fb-section">
          <div className="fb-section-title fb-section-title--good">
            <span>✅</span> Strengths
          </div>
          <ul className="fb-list">
            {strengths.map((s, i) => (
              <li key={i} className="fb-list-item fb-list-item--good">{s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {improvements.length > 0 && (
        <div className="fb-section">
          <div className="fb-section-title fb-section-title--improve">
            <span>💡</span> Areas to Improve
          </div>
          <ul className="fb-list">
            {improvements.map((s, i) => (
              <li key={i} className="fb-list-item fb-list-item--improve">{s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Model answer hint */}
      {modelAnswer && (
        <div className="fb-section">
          <div className="fb-section-title">
            <span>🎯</span> Ideal Answer Direction
          </div>
          <p className="fb-model-answer">{modelAnswer}</p>
        </div>
      )}

      {/* Resources */}
      {resources.length > 0 && (
        <div className="fb-section">
          <div className="fb-section-title">
            <span>📖</span> Study These Topics
          </div>
          <div className="fb-resources">
            {resources.map((r, i) => (
              <span key={i} className="fb-resource-tag">{r}</span>
            ))}
          </div>
        </div>
      )}

      {/* Your answer recap */}
      <details className="fb-answer-recap">
        <summary className="fb-answer-toggle">📝 Your submitted answer</summary>
        <p className="fb-answer-text">{answer}</p>
      </details>
    </div>
  );
}
