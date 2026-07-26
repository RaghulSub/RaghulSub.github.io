import { escapeHTML, sanitizeURL } from './security';
import DOMPurify from 'dompurify';


export interface BlogHeading {
  level: number;
  text: string;
  id: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  author: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
  headings?: BlogHeading[];
}

export function parseFrontmatter(content: string): { metadata: Record<string, string | string[]>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, content };
  }

  const yamlContent = match[1];
  const remainingContent = content.slice(match[0].length);
  const metadata: Record<string, string | string[]> = {};

  const lines = yamlContent.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    if (value.startsWith('[') && value.endsWith(']')) {
      const items = value.slice(1, -1).split(',').map(s => s.trim().replace(/^"|"$/g, ''));
      metadata[key] = items;
    } else {
      metadata[key] = value;
    }
  }

  return { metadata, content: remainingContent };
}

export function parseMarkdown(markdown: string, outHeadings: BlogHeading[] = []): string {
  let html = markdown;

  function slugify(text: string) {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  }

  html = html.replace(/^(#{1,3})\s+(.*$)/gim, (_, hashes, text) => {
    const level = hashes.length;
    // Remove markdown bold/italic inside headers for the ID
    const cleanText = text.replace(/[*_]/g, '').trim();
    const id = slugify(cleanText);
    outHeadings.push({ level, text: cleanText, id });
    return `<h${level} id="${id}">${escapeHTML(text)}</h${level}>`;
  });

  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/==([^=]+)==/g, '<mark>$1</mark>');

  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<div class="code-block">
      <button class="code-block__copy" aria-label="Copy code" title="Copy code">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
      </button>
      <pre><code class="language-${lang || ''}">${escapeHTML(code.trim())}</code></pre>
    </div>`;
  });

  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, url) => {
    url = sanitizeURL(url);
    alt = escapeHTML(alt);

    const isVideo = url.match(/\.(mp4|webm|ogg|avi|mov)$/i);
    const caption = alt ? `<figcaption>${alt}</figcaption>` : '';
    if (isVideo) {
      return `<figure class="blog-figure"><video controls src="${url}" class="blog-media"><a href="${url}">Video: ${alt || 'Click to play'}</a></video>${caption}</figure>`;
    }
    return `<figure class="blog-figure"><img src="${url}" alt="${alt}" class="blog-image" loading="lazy" />${caption}</figure>`;
  });

 html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
    const safeUrl = sanitizeURL(url);
    const safeText = escapeHTML(text);
    return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeText}</a>`;
  });


  html = html.replace(/(?:^>.*(?:\n|$))+/gm, (match) => {
    const content = match.replace(/^>\s?/gm, '');
    return `<blockquote>${content.trim()}</blockquote>`;
  });

  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';

  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[1-3] [^>]+>)/g, '$1');
  html = html.replace(/(<\/h[1-3]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  html = html.replace(/<p>(<div class="code-block">)/g, '$1');
  html = html.replace(/(<\/div>)<\/p>/g, '$1');
  html = html.replace(/<p>(<figure)/g, '$1');
  html = html.replace(/(<\/figure>)<\/p>/g, '$1');
  html = html.replace(/<p>(<blockquote)/g, '$1');
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');

  return html;
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`/blogs/${slug}.md`);
    if (!response.ok) return null;

    const rawContent = await response.text();
    const { metadata, content } = parseFrontmatter(rawContent);
    const headings: BlogHeading[] = [];
    const htmlContent = DOMPurify.sanitize(parseMarkdown(content, headings));

    return {
      slug,
      title: (metadata.title as string) || 'Untitled',
      author: (metadata.author as string) || 'Unknown',
      date: (metadata.date as string) || '',
      description: (metadata.description as string) || '',
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      content: htmlContent,
      headings
    };
  } catch (err) {
    console.error('Error fetching blog post:', err);
    return null;
  }
}

export async function fetchAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch('/data/blogs.json');
    if (!response.ok) return [];
    const { data: blogs } = await response.json();
    const posts = await Promise.all(blogs.map((b: any) => fetchBlogPost(b.slug)));
    return posts.filter((p): p is BlogPost => p !== null);
  } catch (err) {
    console.error('Error fetching all blog posts:', err);
    return [];
  }
}
