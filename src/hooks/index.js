import { useState, useEffect, useRef, useCallback } from 'react';
import { getSettings, saveSettings } from '../utils/storage';

// ── useTheme ───────────────────────────────────
export function useTheme() {
  const [theme, setTheme] = useState(() => getSettings().theme || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const settings = getSettings();
    saveSettings({ ...settings, theme });
  }, [theme]);

  const toggleTheme = useCallback(() =>
    setTheme(t => (t === 'dark' ? 'light' : 'dark')), []);

  return { theme, toggleTheme };
}

// ── useTimer ───────────────────────────────────
export function useTimer(initialSeconds = 120) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const [expired, setExpired] = useState(false);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    setExpired(false);
    setRunning(true);
  }, []);

  const pause = useCallback(() => setRunning(false), []);
  const reset = useCallback((s = initialSeconds) => {
    setRunning(false);
    setExpired(false);
    setSeconds(s);
  }, [initialSeconds]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            setRunning(false);
            setExpired(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const formatted = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const percent = Math.round((seconds / initialSeconds) * 100);

  return { seconds, formatted, percent, running, expired, start, pause, reset };
}

// ── useSpeechRecognition ──────────────────────
export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = 'en-US';

      recog.onresult = (e) => {
        let final = '';
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) final += e.results[i][0].transcript;
          else interim += e.results[i][0].transcript;
        }
        setTranscript(prev => prev + final + (interim ? ` ${interim}` : ''));
      };

      recog.onerror = (e) => {
        setError(e.error);
        setListening(false);
      };

      recog.onend = () => setListening(false);

      recognitionRef.current = recog;
    }
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    setListening(true);
    recognitionRef.current.start();
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setListening(false);
  }, []);

  const resetTranscript = useCallback(() => setTranscript(''), []);

  return { transcript, setTranscript, listening, supported, error, startListening, stopListening, resetTranscript };
}

// ── useLocalStorage ────────────────────────────
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });

  const setStoredValue = useCallback((val) => {
    try {
      const toStore = typeof val === 'function' ? val(value) : val;
      setValue(toStore);
      localStorage.setItem(key, JSON.stringify(toStore));
    } catch (e) { console.warn('localStorage error:', e); }
  }, [key, value]);

  return [value, setStoredValue];
}
