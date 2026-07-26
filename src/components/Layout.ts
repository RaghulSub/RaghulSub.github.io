import type { SiteData, AppData, LayoutOpts } from '../types';
import { Nav } from './Nav';
import { Footer } from './Footer';

export function Layout(site: SiteData, content: string, data: AppData, opts: LayoutOpts = {}): string {
  let containerClass = 'container';
  if (opts.fullWidth) containerClass = 'container container--full';
  if (opts.fluid) containerClass = 'container container--fluid';

  return `
    ${Nav(site, data)}
    <main class="main">
      <div class="${containerClass}">
        <div id="app">${content}</div>
      </div>
    </main>
    ${Footer(site)}
  `;
}
