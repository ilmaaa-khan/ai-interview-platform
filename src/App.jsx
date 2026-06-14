import React, { useState } from 'react';
import Header from './components/Header';
import HomeView from './components/HomeView';
import InterviewView from './components/InterviewView';
import ProgressView from './components/ProgressView';
import SettingsView from './components/SettingsView';
import { useTheme } from './hooks/index';
import { getApiKey } from './utils/storage';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const apiKeySet = Boolean(getApiKey());

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return (
          <HomeView
            setActiveView={setActiveView}
            setSelectedCategory={setSelectedCategory}
          />
        );
      case 'interview':
        return (
          <InterviewView
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        );
      case 'progress':
        return (
          <ProgressView
            setActiveView={setActiveView}
            setSelectedCategory={setSelectedCategory}
          />
        );
      case 'settings':
        return (
          <SettingsView
            theme={theme}
            toggleTheme={toggleTheme}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          if (view !== 'interview') setSelectedCategory(null);
        }}
        apiKeySet={apiKeySet}
      />
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}
