import { IconSync } from './Icon';
import type { SiteData } from '../types';
import { unwrap } from '../utils/data';
import { escapeHTML, sanitizeURL } from '../utils/security';

export function Footer(site: SiteData): string {
  const allSocials = unwrap(site.socials);
  const mailLink = allSocials.find((s: any) => s.platform === 'mail');
  
  const connectHtml = mailLink ? `
    <div class="footer__socials">
      <a href="${sanitizeURL(mailLink.url)}" class="footer__social" aria-label="${escapeHTML(mailLink.label)}" target="_blank" rel="noopener noreferrer">
        ${IconSync('mail', { width: '16', height: '16' })}
      </a>
    </div>
  ` : '';

  return `
    <footer class="footer">
      <div class="footer__inner">
        <span class="footer__copy">&copy; ${new Date().getFullYear()} ${escapeHTML(site.name)}</span>
        ${connectHtml}
      </div>
    </footer>
  `;
}