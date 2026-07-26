import type { Work } from '../types';
import { IconSync } from './Icon';
import { Tag } from './Tag';
import { formatDate } from '../utils/date';
import { escapeHTML, sanitizeURL } from '../utils/security';

export function WorkDetail(work: Work | undefined): string {
  if (!work) {
    return `<div class="container"><p>Work not found.</p></div>`;
  }

  const links: string[] = [];
  if (work.links?.source) {
    if (work.joke) {
      links.push(`
        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          <button class="btn" disabled title="Closed source">
            ${IconSync('code', { width: '14', height: '14' })}
            Source Code
          </button>
          <span style="color: var(--text-muted); font-size: 0.8125rem; font-style: italic;">
            ${escapeHTML(work.joke)}
          </span>
        </div>
      `);
    } else {
      links.push(`
        <button class="btn" disabled title="Closed source">
          ${IconSync('code', { width: '14', height: '14' })}
          Source Code
        </button>
      `);
    }
  } else if (work.joke) {
    links.push(`
      <span style="color: var(--text-muted); font-size: 0.8125rem; align-self: center; font-style: italic;">
        ${escapeHTML(work.joke)}
      </span>
    `);
  }
  
  if (work.links?.demo) {
    links.push(`
      <a href="${sanitizeURL(work.links.demo)}" class="btn" target="_blank" rel="noopener noreferrer">
        ${IconSync('external-link', { width: '14', height: '14' })}
        Live Demo
      </a>
    `);
  }

  return `
    <div class="work-detail">
      <a href="#/works" class="work-detail__back" data-nav>
        ${IconSync('arrow-left', { width: '14', height: '14' })}
        Back to all works
      </a>

      <h1 class="work-detail__title">${escapeHTML(work.title)}</h1>

      ${work.date ? `
        <p class="work-detail__date">
          ${IconSync('calendar', { width: '14', height: '14' })}
          ${formatDate(work.date)}
        </p>
      ` : ''}

      ${work.image ? `<img src="${sanitizeURL(work.image)}" alt="${escapeHTML(work.title)}" style="border-radius: 8px; margin-bottom: 1.5rem;" />` : ''}

      ${work.longDescription ? `<div class="work-detail__desc">${work.longDescription}</div>` : `<p class="work-detail__desc">${escapeHTML(work.description)}</p>`}

      ${work.tags && work.tags.length ? `
        <div class="work-detail__tags">
          <div class="tags">
            ${work.tags.map(tag => Tag(tag)).join('')}
          </div>
        </div>
      ` : ''}

      ${links.length ? `
        <div class="work-detail__links">
          ${links.join('')}
        </div>
      ` : ''}
    </div>
  `;
}
