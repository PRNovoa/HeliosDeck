import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "helios-deck:theme";
const DARK = "dark";
const LIGHT = "light";

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === DARK || saved === LIGHT) return saved;
  } catch {
    // localStorage unavailable
  }
  return DARK;
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

/**
 * useTheme
 * -------------------------------------------------------
 * Manages light/dark theme. Persists preference to localStorage.
 * Applies `data-theme="light|dark"` to <html> element.
 *
 * @returns {{ theme: string, toggleTheme: () => void, isDark: boolean }}
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const t = getInitialTheme();
    applyTheme(t);
    return t;
  });

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === LIGHT ? DARK : LIGHT));
  }, []);

  return { theme, toggleTheme, isDark: theme === DARK };
}
