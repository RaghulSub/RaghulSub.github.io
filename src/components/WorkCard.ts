import type { Work } from '../types';
import { formatDate } from '../utils/date';
import type { ExtendedWork } from '../pages/WorksPage';
import { Tag } from './Tag';
import { escapeHTML } from '../utils/security';

export function WorkCard(item: ExtendedWork): string {
  const isExperience = item.type === 'experience';

  if (isExperience) {
    const bulletsHtml = item.bullets ? `
      <ul class="simple-list">
        ${item.bullets.map(b => `<li>${escapeHTML(b)}</li>`).join('')}
      </ul>
    ` : '';

    return `
      <div class="simple-item">
        <div class="simple-item__header">
          <span class="simple-item__role">${escapeHTML(item.company)}</span>
          <span class="simple-item__period">${escapeHTML(item.period)}</span>
        </div>
        <div class="simple-item__company">${escapeHTML(item.role)}</div>
        ${bulletsHtml}
      </div>
    `;
  }

  return `
    <div class="simple-item">
      <div class="simple-item__header">
        <a href="#/works/${escapeHTML(item.slug)}" data-nav class="simple-item__title">${escapeHTML(item.title)}</a>
        <span class="simple-item__date">${formatDate(item.date)}</span>
      </div>
      <p class="simple-item__desc">${escapeHTML(item.description)}</p>
      ${item.tags && item.tags.length ? `
        <div class="tags" style="margin-top: 0.5rem">
          ${item.tags.map(t => Tag(t)).join('')}
        </div>
      ` : ''}
    </div>
  `;
}
