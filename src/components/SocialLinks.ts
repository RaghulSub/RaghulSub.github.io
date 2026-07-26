import type { SocialLink } from '../types';
import { IconSync } from './Icon';
import { escapeHTML, sanitizeURL } from '../utils/security';

export function SocialLinks(socials: SocialLink[]): string {
  return `
    <div class="social-links">
      ${socials.map(s => `
        <a href="${sanitizeURL(s.url)}" class="social-link" data-platform="${escapeHTML(s.platform)}" aria-label="${escapeHTML(s.label)}" target="_blank" rel="noopener noreferrer">
          <span class="social-link__icon">
            ${IconSync(s.platform, { width: '18', height: '18' })}
          </span>
          <span class="social-link__label">${escapeHTML(s.label)}</span>
        </a>
      `).join('')}
    </div>
  `;
}
