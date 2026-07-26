import type { Project } from '../types';
import { formatDate } from '../utils/date';
import { Tag } from './Tag';
import { escapeHTML } from '../utils/security';

export function ProjectCard(item: Project): string {
  return `
    <div class="simple-item">
      <div class="simple-item__header">
        <a href="#/projects/${escapeHTML(item.slug)}" data-nav class="simple-item__title">${escapeHTML(item.title)}</a>
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
