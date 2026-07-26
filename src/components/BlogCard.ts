import type { Blog } from '../types';
import { formatDate } from '../utils/date';
import { IconSync } from './Icon';
import { escapeHTML } from '../utils/security';

export function BlogCard(blog: Blog): string {
  return `
    <a href="#/blogs/${escapeHTML(blog.slug)}" data-nav class="blog-item">
      <span class="blog-item__title">${escapeHTML(blog.title)}</span>
      <span class="blog-item__right">
        <span class="blog-item__date">${formatDate(blog.date)}</span>
        <span class="blog-item__arrow">
          ${IconSync('arrow-right', { width: '16', height: '16' })}
        </span>
      </span>
    </a>
  `;
}
