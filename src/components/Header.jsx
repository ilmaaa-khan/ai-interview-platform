import React from 'react';
import './Header.css';

export default function Header({ theme, toggleTheme, activeView, setActiveView, apiKeySet }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'interview', label: 'Interview', icon: '💬' },
    { id: 'progress', label: 'Progress', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <header className="header">
      <div className="header-inner">
        <button className="logo" onClick={() => setActiveView('home')} aria-label="Go to home">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">
            <span className="logo-dev">Dev</span>
            <span className="logo-prep">Prep</span>
            <span className="logo-ai">AI</span>
          </span>
        </button>

        <nav className="nav" role="navigation" aria-label="Main navigation">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-btn ${activeView === item.id ? 'nav-btn--active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="header-actions">
          {!apiKeySet && (
            <button
              className="api-warning-btn"
              onClick={() => setActiveView('settings')}
              title="Set up OpenRouter API key for AI feedback"
            >
              <span>🔑</span>
              <span className="api-warning-text">Add API Key</span>
            </button>
          )}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}
