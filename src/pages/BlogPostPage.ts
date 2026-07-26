import type { AppData, RouteParams } from '../types';
import { Layout } from '../components/Layout';
import { IconSync } from '../components/Icon';
import { Tag } from '../components/Tag';
import { formatDate } from '../utils/date';
import { fetchBlogPost, type BlogPost } from '../utils/blog-parser';
import { escapeHTML } from '../utils/security';

export async function BlogPostPage(data: AppData, params: RouteParams): Promise<string> {
  const { site } = data;
  const slug = params.slug;

  const post = await fetchBlogPost(slug);

  if (!post) {
    const content = `
      <div class="empty-state">
        <h1 class="empty-state__title">404</h1>
        <p class="empty-state__text">Blog post not found.</p>
        <div class="cta-group" style="justify-content:center;margin-top:2rem">
          <a href="#/blogs" class="btn" data-nav>Back to blogs</a>
        </div>
      </div>
    `;
  return Layout(site, content, data, { fluid: true });
  }

  const tocHtml = post.headings && post.headings.length > 0 ? `
    <aside class="blog-sidebar">
      <div class="blog-toc">
        <h3 class="blog-toc__title">Table of Contents</h3>
        <nav class="blog-toc__nav">
          <ul class="blog-toc__list">
            ${post.headings.map(h => `
              <li class="blog-toc__item blog-toc__item--level-${h.level}">
                <a href="#${h.id}" class="blog-toc__link">${escapeHTML(h.text)}</a>
              </li>
            `).join('')}
          </ul>
        </nav>
      </div>
    </aside>
  ` : '';

  const content = `
    <div class="blog-layout">
      ${tocHtml}
      <article class="blog-post">
        <header class="blog-post__header">
          <a href="#/blogs" class="blog-post__back" data-nav>
            ${IconSync('arrow-left', { width: '16', height: '16' })}
            <span>All Posts</span>
          </a>
          <h1 class="blog-post__title">${escapeHTML(post.title)}</h1>
          <div class="blog-post__meta">
            ${post.author ? `<span class="blog-post__author">By ${escapeHTML(post.author)}</span>` : ''}
            ${post.date ? `<span class="blog-post__date">${IconSync('calendar', { width: '14', height: '14' })} ${formatDate(post.date)}</span>` : ''}
          </div>
          ${post.tags && post.tags.length ? `
            <div class="tags">
              ${post.tags.map(tag => Tag(tag)).join('')}
            </div>
          ` : ''}
        </header>
        <div class="blog-post__content">
          ${post.content}
        </div>
        
        <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border); display: flex; justify-content: flex-end;">
          <a href="#" onclick="window.scrollTo({top: 0, behavior: 'smooth'}); event.preventDefault();" class="blog-post__back" style="margin-bottom: 0;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
            <span>Back to top</span>
          </a>
        </div>
      </article>
    </div>
  `;

  return Layout(site, content, data, { fluid: true });
}