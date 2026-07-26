import type { ThemeName } from '../types';

export function initTheme(defaultTheme: string): ThemeName {
  const stored = localStorage.getItem('theme');
  const theme = (stored || defaultTheme || 'dark') as ThemeName;
  document.documentElement.setAttribute('data-theme', theme);
  return theme;
}

export function toggleTheme(): ThemeName {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  return next;
}

export function getTheme(): ThemeName | null {
  return document.documentElement.getAttribute('data-theme') as ThemeName | null;
}
