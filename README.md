# ⚡ DevPrep AI — Interview Preparation Platform

A full-featured AI-powered frontend interview preparation platform built with React, featuring voice-to-text answers, AI feedback via OpenRouter, progress tracking, and more.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ✨ Features

### 🤖 AI-Generated Feedback
- Submit answers and receive detailed scores (0–100)
- Strengths, improvement areas, and model answer hints
- Powered by **OpenRouter** — supports Claude, GPT, Mistral, Gemma, and more

### 🎙️ Voice-to-Text Answers
- Speak your answers using the Web Speech API
- Works in Chrome, Edge, and Safari
- Real-time transcription

### 📚 Category-Wise Questions (40+ total)
- **HTML** — Semantics, Canvas, Web Workers, accessibility
- **CSS** — Flexbox, Grid, specificity, animations, stacking context
- **JavaScript** — Closures, event loop, async/await, generators
- **React** — Hooks, Virtual DOM, Context, Server Components
- **Mixed Mode** — Random selection across all categories

### ⏱️ Interview Timer
- Configurable per-question timer (1m to 5m)
- Visual ring timer with color warnings
- Auto-expires with notification

### 📊 Progress Tracking
- Scores saved to `localStorage` — persists across sessions
- Per-category breakdown with averages
- Score distribution chart
- Clear all data option

### 🌙 Dark / Light Mode
- Full dark and light theme
- Persisted via localStorage

---

## ⚙️ Setup

### OpenRouter API Key (Required for AI Feedback)

1. Go to [openrouter.ai](https://openrouter.ai) and create a free account
2. Generate an API key
3. In the app, click **Settings** → paste your key → click **Save**

**Free models available:** Mistral 7B Instruct, Gemma 2 9B

Your key is stored **only in your browser's localStorage** — never sent anywhere except directly to OpenRouter.

---

## 🏗️ Tech Stack

| Technology | Usage |
|------------|-------|
| React 18 | UI framework with hooks |
| Vite | Build tool & dev server |
| CSS Variables | Theming system (dark/light) |
| Web Speech API | Voice-to-text input |
| OpenRouter API | AI feedback (multiple models) |
| localStorage | Progress & settings persistence |
| Space Grotesk + JetBrains Mono | Typography |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Navigation + theme toggle
│   ├── HomeView.jsx         # Landing page with categories
│   ├── InterviewView.jsx    # Core interview experience
│   ├── FeedbackPanel.jsx    # AI feedback display
│   ├── ProgressView.jsx     # Stats & progress tracking
│   └── SettingsView.jsx     # API key, timer, theme config
├── hooks/
│   └── index.js            # useTheme, useTimer, useSpeechRecognition, useLocalStorage
├── data/
│   └── questions.js        # 40+ interview questions + category config
├── utils/
│   ├── openrouter.js       # OpenRouter API integration
│   └── storage.js          # localStorage utilities
└── styles/
    └── globals.css          # Design system & tokens
```

---

## 🎨 Design System

- **Font:** Space Grotesk (headings) + Inter (body) + JetBrains Mono (code/data)
- **Accent:** `#5B6BF8` (indigo)
- **Dark bg:** `#0D0F14` with layered elevation
- **Light bg:** `#F7F8FA` with white cards

---

## 📜 License

MIT — free to use, modify, and distribute.
