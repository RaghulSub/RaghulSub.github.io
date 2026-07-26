import type { SectionOpts } from '../types';
import { escapeHTML } from '../utils/security';

export function Section(opts: SectionOpts, content: string): string {
  const title = opts.title ? `<h2 class="section__title">${escapeHTML(opts.title)}</h2>` : '';
  const description = opts.description ? `<p class="section__description">${escapeHTML(opts.description)}</p>` : '';
  return `
    <section class="section">
      ${title}
      ${description}
      ${content}
    </section>
  `;
}
