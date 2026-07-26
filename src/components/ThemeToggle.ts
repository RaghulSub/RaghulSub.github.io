import { IconSync } from './Icon';
import { getTheme } from '../core/theme';

export function ThemeToggle(): string {
  const current = getTheme() || 'dark';
  const name = current === 'dark' ? 'moon' : 'sun';
  return `
    <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
      ${IconSync(name, { width: '18', height: '18' })}
    </button>
  `;
}
