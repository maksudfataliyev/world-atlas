import { useState, useEffect, useCallback } from 'react';
import { Preferences } from '../types/country';

const DEFAULT_PREFERENCES: Preferences = {
  theme: 'dark',
  accentColor: 'indigo',
  animationsEnabled: true,
  units: 'metric',
  language: 'en',
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    try {
      const stored = localStorage.getItem('worldatlas_preferences');
      if (stored) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to parse preferences:', e);
    }
    return DEFAULT_PREFERENCES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('worldatlas_preferences', JSON.stringify(preferences));
    } catch (e) {
      console.error('Failed to save preferences:', e);
    }

    // Apply dark/light theme to document
    const root = window.document.documentElement;
    const isDark =
      preferences.theme === 'dark' ||
      (preferences.theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    // Set accent color data attribute for global CSS styling if needed
    root.setAttribute('data-accent', preferences.accentColor);
  }, [preferences]);

  const updatePreference = useCallback(<K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  // Helper to get tailwind class strings for current accent
  const getAccentClass = useCallback((type: 'text' | 'bg' | 'border' | 'hoverBg' | 'hoverText' | 'focusRing' | 'gradient' | 'badge' | 'fill') => {
    const color = preferences.accentColor;
    const map = {
      text: {
        indigo: 'text-indigo-600 dark:text-indigo-400',
        emerald: 'text-emerald-600 dark:text-emerald-400',
        amber: 'text-amber-600 dark:text-amber-400',
        rose: 'text-rose-600 dark:text-rose-400',
        blue: 'text-blue-600 dark:text-blue-400',
        purple: 'text-purple-600 dark:text-purple-400',
      },
      bg: {
        indigo: 'bg-indigo-600 dark:bg-indigo-500',
        emerald: 'bg-emerald-600 dark:bg-emerald-500',
        amber: 'bg-amber-600 dark:bg-amber-500',
        rose: 'bg-rose-600 dark:bg-rose-500',
        blue: 'bg-blue-600 dark:bg-blue-500',
        purple: 'bg-purple-600 dark:bg-purple-500',
      },
      hoverBg: {
        indigo: 'hover:bg-indigo-700 dark:hover:bg-indigo-600',
        emerald: 'hover:bg-emerald-700 dark:hover:bg-emerald-600',
        amber: 'hover:bg-amber-700 dark:hover:bg-amber-600',
        rose: 'hover:bg-rose-700 dark:hover:bg-rose-600',
        blue: 'hover:bg-blue-700 dark:hover:bg-blue-600',
        purple: 'hover:bg-purple-700 dark:hover:bg-purple-600',
      },
      hoverText: {
        indigo: 'hover:text-indigo-700 dark:hover:text-indigo-300',
        emerald: 'hover:text-emerald-700 dark:hover:text-emerald-300',
        amber: 'hover:text-amber-700 dark:hover:text-amber-300',
        rose: 'hover:text-rose-700 dark:hover:text-rose-300',
        blue: 'hover:text-blue-700 dark:hover:text-blue-300',
        purple: 'hover:text-purple-700 dark:hover:text-purple-300',
      },
      border: {
        indigo: 'border-indigo-500/30 focus-within:border-indigo-500',
        emerald: 'border-emerald-500/30 focus-within:border-emerald-500',
        amber: 'border-amber-500/30 focus-within:border-amber-500',
        rose: 'border-rose-500/30 focus-within:border-rose-500',
        blue: 'border-blue-500/30 focus-within:border-blue-500',
        purple: 'border-purple-500/30 focus-within:border-purple-500',
      },
      focusRing: {
        indigo: 'focus:ring-indigo-500 dark:focus:ring-indigo-400',
        emerald: 'focus:ring-emerald-500 dark:focus:ring-emerald-400',
        amber: 'focus:ring-amber-500 dark:focus:ring-amber-400',
        rose: 'focus:ring-rose-500 dark:focus:ring-rose-400',
        blue: 'focus:ring-blue-500 dark:focus:ring-blue-400',
        purple: 'focus:ring-purple-500 dark:focus:ring-purple-400',
      },
      gradient: {
        indigo: 'from-indigo-600 to-indigo-400 dark:from-indigo-500 dark:to-indigo-300',
        emerald: 'from-emerald-600 to-emerald-400 dark:from-emerald-500 dark:to-emerald-300',
        amber: 'from-amber-600 to-amber-400 dark:from-amber-500 dark:to-amber-300',
        rose: 'from-rose-600 to-rose-400 dark:from-rose-500 dark:to-rose-300',
        blue: 'from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300',
        purple: 'from-purple-600 to-purple-400 dark:from-purple-500 dark:to-purple-300',
      },
      badge: {
        indigo: 'bg-indigo-50/50 text-indigo-700 border-indigo-200/50 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800/50',
        emerald: 'bg-emerald-50/50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/50',
        amber: 'bg-amber-50/50 text-amber-700 border-amber-200/50 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/50',
        rose: 'bg-rose-50/50 text-rose-700 border-rose-200/50 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800/50',
        blue: 'bg-blue-50/50 text-blue-700 border-blue-200/50 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/50',
        purple: 'bg-purple-50/50 text-purple-700 border-purple-200/50 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800/50',
      },
      fill: {
        indigo: 'fill-indigo-600 dark:fill-indigo-500',
        emerald: 'fill-emerald-600 dark:fill-emerald-500',
        amber: 'fill-amber-600 dark:fill-amber-500',
        rose: 'fill-rose-600 dark:fill-rose-500',
        blue: 'fill-blue-600 dark:fill-blue-500',
        purple: 'fill-purple-600 dark:fill-purple-500',
      },
    };
    return map[type][color];
  }, [preferences.accentColor]);

  return {
    preferences,
    updatePreference,
    resetPreferences,
    getAccentClass,
  };
}
