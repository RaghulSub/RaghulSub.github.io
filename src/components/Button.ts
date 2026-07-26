import type { ButtonOpts } from '../types';
import { IconSync } from './Icon';
import { escapeHTML } from '../utils/security';

export function Button(opts: ButtonOpts): string {
  const variant = opts.variant === 'primary' ? 'btn--primary' : '';
  const icon = opts.icon ? IconSync(opts.icon, { width: '14', height: '14' }) : '';
  return `
    <a href="${escapeHTML(opts.path)}" class="btn ${variant}" data-nav>
      ${escapeHTML(opts.label)}
      ${icon}
    </a>
  `;
}
