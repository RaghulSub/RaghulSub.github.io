import type { NavItem, AppData, SiteData } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { unwrap } from '../utils/data';
import { escapeHTML } from '../utils/security';

export function Nav(site: SiteData, data: AppData): string {
  const links = unwrap(site.nav);
  return `
    <nav class="nav">
      <div class="nav__inner">
        <div class="nav__left">
          <ul class="nav__links">
            <li class="nav__indicator" id="nav-indicator"></li>
            ${links.map((link: NavItem) => `
              <li>
                <a href="${escapeHTML(link.path)}" class="nav__link" data-nav>${escapeHTML(link.label)}</a>
              </li>
            `).join('')}
          </ul>
        </div>
        <div class="nav__right">
          ${ThemeToggle()}
        </div>
      </div>
    </nav>
  `;
}
