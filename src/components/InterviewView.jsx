import React, { useState, useEffect, useCallback } from 'react';
import { CATEGORIES, QUESTIONS, getRandomQuestions, getAllQuestions } from '../data/questions';
import { getAIFeedback } from '../utils/openrouter';
import { saveQuestionResult, getApiKey, getSettings } from '../utils/storage';
import { useTimer, useSpeechRecognition } from '../hooks/index';
import FeedbackPanel from './FeedbackPanel';
import './InterviewView.css';

const TIMER_DURATION = 120; // 2 min default

export default function InterviewView({ selectedCategory, setSelectedCategory }) {
  const settings = getSettings();
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);
  const [sessionResults, setSessionResults] = useState([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [phase, setPhase] = useState('setup'); // setup | answering | reviewing | done

  const timer = useTimer(settings.timerDuration || TIMER_DURATION);
  const speech = useSpeechRecognition();

  // Load questions when category selected
  useEffect(() => {
    if (selectedCategory) {
      loadQuestions(selectedCategory);
    }
  }, [selectedCategory]);

  // Sync speech transcript to answer
  useEffect(() => {
    if (speech.transcript) {
      setAnswer(speech.transcript);
    }
  }, [speech.transcript]);

  const loadQuestions = (catId) => {
    let qs;
    if (catId === 'mixed') {
      qs = getAllQuestions(['html', 'css', 'js', 'react'], 10);
    } else {
      qs = getRandomQuestions(catId, 10).map(q => ({ ...q, category: catId }));
    }
    setQuestions(qs);
    setCurrentIdx(0);
    setAnswer('');
    setFeedback(null);
    setFeedbackError(null);
    setSessionResults([]);
    setSessionComplete(false);
    setPhase('answering');
    timer.reset(settings.timerDuration || TIMER_DURATION);
    speech.resetTranscript();
  };

  const currentQ = questions[currentIdx];

  const handleStartTimer = () => timer.start();

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      setFeedbackError('Please write or speak your answer before submitting.');
      return;
    }

    setPhase('reviewing');
    setLoadingFeedback(true);
    setFeedbackError(null);
    timer.pause();
    if (speech.listening) speech.stopListening();

    const apiKey = getApiKey();
    try {
      const result = await getAIFeedback({
        question: currentQ.text,
        answer,
        category: currentQ.category || selectedCategory,
        apiKey,
        model: settings.aiModel || 'mistralai/mistral-7b-instruct',
      });
      setFeedback(result);

      // Save to progress
      saveQuestionResult(currentQ.id, currentQ.category || selectedCategory, {
        score: result.score,
        grade: result.grade,
        question: currentQ.text,
        answer,
      });

      setSessionResults(prev => [...prev, {
        questionId: currentQ.id,
        question: currentQ.text,
        answer,
        score: result.score,
        grade: result.grade,
        category: currentQ.category || selectedCategory,
      }]);

    } catch (err) {
      if (err.message === 'NO_API_KEY') {
        setFeedbackError('no_api_key');
      } else if (err.message === 'INVALID_API_KEY') {
        setFeedbackError('invalid_api_key');
      } else if (err.message === 'RATE_LIMITED') {
        setFeedbackError('rate_limited');
      } else {
        setFeedbackError(err.message);
      }
      // Still save answer without score
      setSessionResults(prev => [...prev, {
        questionId: currentQ.id,
        question: currentQ.text,
        answer,
        score: null,
        grade: 'Unscored',
        category: currentQ.category || selectedCategory,
      }]);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const handleNext = () => {
    if (currentIdx >= questions.length - 1) {
      setPhase('done');
      setSessionComplete(true);
    } else {
      setCurrentIdx(i => i + 1);
      setAnswer('');
      setFeedback(null);
      setFeedbackError(null);
      setPhase('answering');
      timer.reset(settings.timerDuration || TIMER_DURATION);
      speech.resetTranscript();
    }
  };

  const handleSkip = () => {
    setSessionResults(prev => [...prev, {
      questionId: currentQ.id,
      question: currentQ.text,
      answer: '',
      score: 0,
      grade: 'Skipped',
      category: currentQ.category || selectedCategory,
    }]);
    handleNext();
  };

  const handleRestart = () => {
    setPhase('setup');
    setSelectedCategory(null);
    setQuestions([]);
    setAnswer('');
    setFeedback(null);
    setFeedbackError(null);
    setSessionResults([]);
    setSessionComplete(false);
    timer.reset();
    speech.resetTranscript();
  };

  const handleMicToggle = () => {
    if (speech.listening) {
      speech.stopListening();
    } else {
      speech.resetTranscript();
      setAnswer('');
      speech.startListening();
    }
  };

  const catInfo = CATEGORIES.find(c => c.id === (currentQ?.category || selectedCategory));
  const progress = questions.length > 0 ? ((currentIdx + (phase === 'done' ? 1 : 0)) / questions.length) * 100 : 0;

  // ── SETUP PHASE ──────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="interview-wrap animate-fade-up">
        <div className="setup-panel">
          <h1 className="setup-title">Choose Your Practice</h1>
          <p className="setup-sub">Select a category to start your interview session</p>
          <div className="setup-cats">
            {[
              ...CATEGORIES,
              { id: 'mixed', label: 'Mixed Mode', icon: '🎯' }
            ].map(cat => (
              <button
                key={cat.id}
                className="setup-cat-btn"
                onClick={() => { setSelectedCategory(cat.id); loadQuestions(cat.id); }}
              >
                <span className="setup-cat-icon">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── DONE PHASE ───────────────────────────────
  if (phase === 'done') {
    const scored = sessionResults.filter(r => r.score !== null && r.grade !== 'Skipped');
    const avg = scored.length ? Math.round(scored.reduce((a, b) => a + b.score, 0) / scored.length) : 0;
    const grade = avg >= 80 ? 'Excellent' : avg >= 60 ? 'Good' : avg >= 40 ? 'Needs Work' : 'Keep Practicing';
    const gradeColor = avg >= 80 ? 'var(--success)' : avg >= 60 ? 'var(--accent)' : avg >= 40 ? 'var(--warning)' : 'var(--danger)';

    return (
      <div className="interview-wrap animate-fade-up">
        <div className="done-panel">
          <div className="done-emoji">{avg >= 80 ? '🏆' : avg >= 60 ? '🎉' : avg >= 40 ? '💪' : '📚'}</div>
          <h1 className="done-title">Session Complete!</h1>
          <div className="done-score" style={{ color: gradeColor }}>
            <span className="done-score-num">{avg}</span>
            <span className="done-score-label">/ 100 avg</span>
          </div>
          <div className="done-grade" style={{ color: gradeColor }}>{grade}</div>

          <div className="done-breakdown">
            {sessionResults.map((r, i) => (
              <div key={i} className="done-item">
                <span className="done-item-num mono">{i + 1}</span>
                <span className="done-item-q">{r.question.slice(0, 60)}…</span>
                <span className="done-item-grade" style={{
                  color: r.score >= 80 ? 'var(--success)' : r.score >= 50 ? 'var(--accent)' : 'var(--danger)'
                }}>
                  {r.grade === 'Skipped' ? '⏭ Skip' : r.score !== null ? `${r.score}%` : '—'}
                </span>
              </div>
            ))}
          </div>

          <div className="done-actions">
            <button className="btn btn-primary btn-lg" onClick={handleRestart}>Practice Again</button>
            <button className="btn btn-ghost btn-lg" onClick={() => {}}>View Progress →</button>
          </div>
        </div>
      </div>
    );
  }

  // ── ANSWERING / REVIEWING PHASE ──────────────
  return (
    <div className="interview-wrap">
      {/* Progress bar */}
      <div className="session-progress">
        <div className="session-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="interview-layout">
        {/* Left: Question */}
        <div className="question-col animate-fade-up">
          <div className="q-header">
            <div className="q-meta">
              {catInfo && (
                <span className={`badge badge-${catInfo.id}`}>
                  {catInfo.icon} {catInfo.label}
                </span>
              )}
              <span className={`badge badge-diff badge-diff--${currentQ?.difficulty}`}>
                {currentQ?.difficulty}
              </span>
            </div>
            <span className="q-counter mono">{currentIdx + 1} / {questions.length}</span>
          </div>

          <div className="question-card">
            <p className="question-text">{currentQ?.text}</p>
            {currentQ?.hint && (
              <details className="hint-details">
                <summary className="hint-toggle">💡 Show hint</summary>
                <p className="hint-text">{currentQ.hint}</p>
              </details>
            )}
          </div>

          {/* Timer */}
          <div className={`timer-card ${timer.expired ? 'timer-card--expired' : timer.seconds < 30 ? 'timer-card--warning' : ''}`}>
            <div className="timer-ring">
              <svg viewBox="0 0 40 40" className="timer-svg">
                <circle cx="20" cy="20" r="16" className="timer-track" />
                <circle
                  cx="20" cy="20" r="16"
                  className="timer-fill"
                  strokeDasharray={`${timer.percent} 100`}
                  strokeDashoffset="25"
                />
              </svg>
              <span className="timer-time mono">{timer.formatted}</span>
            </div>
            <div className="timer-controls">
              {!timer.running && !timer.expired && phase === 'answering' && (
                <button className="btn btn-ghost btn-sm" onClick={handleStartTimer}>▶ Start timer</button>
              )}
              {timer.running && (
                <button className="btn btn-ghost btn-sm" onClick={timer.pause}>⏸ Pause</button>
              )}
              {timer.expired && <span className="timer-expired-msg">Time's up!</span>}
            </div>
          </div>
        </div>

        {/* Right: Answer + Feedback */}
        <div className="answer-col">
          {phase === 'answering' && (
            <div className="answer-section animate-fade-up">
              <div className="answer-toolbar">
                <label className="answer-label">Your Answer</label>
                <div className="answer-tools">
                  {speech.supported ? (
                    <button
                      className={`mic-btn ${speech.listening ? 'mic-btn--active' : ''}`}
                      onClick={handleMicToggle}
                      title={speech.listening ? 'Stop recording' : 'Start voice input'}
                    >
                      {speech.listening ? (
                        <><span className="mic-dot" />Recording…</>
                      ) : (
                        '🎙️ Voice'
                      )}
                    </button>
                  ) : (
                    <span className="mic-unsupported">🎙️ Not supported in this browser</span>
                  )}
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => { setAnswer(''); speech.resetTranscript(); }}
                  >Clear</button>
                </div>
              </div>

              <textarea
                className="answer-textarea"
                value={answer}
                onChange={e => { setAnswer(e.target.value); speech.resetTranscript(); }}
                placeholder="Type your answer here, or use voice input above…"
                rows={10}
              />

              {feedbackError === 'no_api_key' && (
                <div className="feedback-error-banner">
                  <span>🔑</span>
                  <span>Add your OpenRouter API key in Settings to get AI feedback. Your answer has been saved.</span>
                </div>
              )}
              {feedbackError && feedbackError !== 'no_api_key' && feedbackError !== 'invalid_api_key' && feedbackError !== 'rate_limited' && (
                <div className="feedback-error-banner feedback-error-banner--warn">
                  <span>⚠️</span>
                  <span>Could not get AI feedback: {feedbackError}. Moving on.</span>
                </div>
              )}
              {feedbackError === 'invalid_api_key' && (
                <div className="feedback-error-banner feedback-error-banner--warn">
                  <span>🚫</span>
                  <span>Invalid API key. Check your OpenRouter API key in Settings.</span>
                </div>
              )}
              {feedbackError === 'rate_limited' && (
                <div className="feedback-error-banner feedback-error-banner--warn">
                  <span>⏳</span>
                  <span>Rate limited. Please wait a moment and try again.</span>
                </div>
              )}
              {feedbackError && feedbackError !== 'Please write or speak your answer before submitting.' && (
                <div className="answer-skip-row">
                  <span className="text-muted" style={{fontSize:'0.85rem'}}>Answer saved without AI score</span>
                  <button className="btn btn-ghost btn-sm" onClick={handleNext}>Next question →</button>
                </div>
              )}
              {feedbackError === 'Please write or speak your answer before submitting.' && (
                <div className="feedback-error-banner feedback-error-banner--warn">
                  <span>⚠️</span>
                  <span>{feedbackError}</span>
                </div>
              )}

              <div className="answer-actions">
                <button className="btn btn-ghost btn-md" onClick={handleSkip}>Skip →</button>
                <button
                  className="btn btn-primary btn-md"
                  onClick={handleSubmitAnswer}
                  disabled={!answer.trim()}
                >
                  Submit & Get Feedback
                </button>
              </div>
            </div>
          )}

          {phase === 'reviewing' && (
            <div className="reviewing-section animate-fade-up">
              {loadingFeedback ? (
                <div className="feedback-loading">
                  <div className="feedback-spinner" />
                  <p>Analyzing your answer with AI…</p>
                  <p className="text-muted" style={{fontSize:'0.8rem', marginTop: '0.5rem'}}>This may take a few seconds</p>
                </div>
              ) : (
                <>
                  {feedback && <FeedbackPanel feedback={feedback} answer={answer} />}
                  {feedbackError && (
                    <div className="feedback-error-banner feedback-error-banner--warn">
                      <span>⚠️</span>
                      <span>AI feedback unavailable: {feedbackError}</span>
                    </div>
                  )}
                  <div className="review-actions">
                    <button className="btn btn-primary btn-lg" onClick={handleNext}>
                      {currentIdx >= questions.length - 1 ? 'Finish Session 🏁' : 'Next Question →'}
                    </button>
                    <button className="btn btn-ghost btn-md" onClick={handleRestart}>
                      Restart
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
