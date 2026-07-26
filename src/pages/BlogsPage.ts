import type { AppData, RouteParams } from '../types';
import { Layout } from '../components/Layout';
import { Section } from '../components/Section';
import { BlogCard } from '../components/BlogCard';
import { EmptyState } from '../components/EmptyState';
import { unwrap } from '../utils/data';

export function BlogsPage(data: AppData, params: RouteParams): string {
  const { site, blogs } = data;

  const blogData = unwrap(blogs);

  if (!blogData || blogData.length === 0) {
    const content = EmptyState(
      'Nothing here yet',
      'I\'m working on some posts. Stay tuned.',
      'book'
    );
    return Layout(site, content, data);
  }

  const sorted = [...blogData].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const content = `
    ${Section({ 
      title: 'Blogs', 
      description: 'Ramblings on software architecture, random tech deep-dives, and side projects I actually managed to finish.'
    }, `
      <div class="blog-list">
        ${sorted.map(blog => BlogCard(blog)).join('')}
      </div>
    `)}
  `;

  return Layout(site, content, data);
}
