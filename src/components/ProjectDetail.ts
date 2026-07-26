import type { Project } from '../types';
import { IconSync } from './Icon';
import { Tag } from './Tag';
import { formatDate } from '../utils/date';
import { escapeHTML, sanitizeURL } from '../utils/security';

export function ProjectDetail(project: Project | undefined): string {
  if (!project) {
    return `<div class="container"><p>Project not found.</p></div>`;
  }

  const links: string[] = [];
  if (project.links?.source) {
    const isClosedSource = project.links.source === 'https://github.com/RaghulSub';
    
    if (isClosedSource && project.joke) {
      links.push(`
        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; width: 100%;">
          <button class="btn" disabled title="Closed source">
            ${IconSync('code', { width: '14', height: '14' })}
            Source Code
          </button>
          <span style="color: var(--text-muted); font-size: 0.8125rem; font-style: italic;">
            ${escapeHTML(project.joke)}
          </span>
        </div>
      `);
    } else if (isClosedSource) {
      links.push(`
        <button class="btn" disabled title="Closed source">
          ${IconSync('code', { width: '14', height: '14' })}
          Source Code
        </button>
      `);
    } else {
      if (project.joke) {
        links.push(`
          <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; width: 100%;">
            <a href="${sanitizeURL(project.links.source)}" class="btn" target="_blank" rel="noopener noreferrer">
              ${IconSync('github', { width: '14', height: '14' })}
              Source Code
            </a>
            <span style="color: var(--text-muted); font-size: 0.8125rem; font-style: italic;">
              ${escapeHTML(project.joke)}
            </span>
          </div>
        `);
      } else {
        links.push(`
          <a href="${sanitizeURL(project.links.source)}" class="btn" target="_blank" rel="noopener noreferrer">
              ${IconSync('github', { width: '14', height: '14' })}
              Source Code
            </a>
          `);
        }
      }
    } else if (project.joke) {
    links.push(`
      <span style="color: var(--text-muted); font-size: 0.8125rem; align-self: center; font-style: italic;">
        ${escapeHTML(project.joke)}
      </span>
    `);
  }
  
  if (project.links?.demo) {
    links.push(`
      <a href="${sanitizeURL(project.links.demo)}" class="btn" target="_blank" rel="noopener noreferrer">
        ${IconSync('external-link', { width: '14', height: '14' })}
        Live Demo
      </a>
    `);
  }

  return `
    <div class="work-detail">
      <a href="#/projects" class="work-detail__back" data-nav>
        ${IconSync('arrow-left', { width: '14', height: '14' })}
        Back to all projects
      </a>

      <h1 class="work-detail__title">${escapeHTML(project.title)}</h1>

      ${project.date ? `
        <p class="work-detail__date">
          ${IconSync('calendar', { width: '14', height: '14' })}
          ${formatDate(project.date)}
        </p>
      ` : ''}

      ${project.image ? `<img src="${sanitizeURL(project.image)}" alt="${escapeHTML(project.title)}" style="border-radius: 8px; margin-bottom: 1.5rem;" />` : ''}

      ${project.longDescription ? `<div class="work-detail__desc">${project.longDescription}</div>` : `<p class="work-detail__desc">${escapeHTML(project.description)}</p>`}

      ${project.tags && project.tags.length ? `
        <div class="work-detail__tags">
          <div class="tags">
            ${project.tags.map(tag => Tag(tag)).join('')}
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
