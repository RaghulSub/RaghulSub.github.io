import { loadData } from './core/data-loader';
import { initRouter } from './core/router';
import { initTheme, toggleTheme } from './core/theme';
import { HomePage } from './pages/HomePage';
import { WorksPage } from './pages/WorksPage';
import { WorkDetailPage } from './pages/WorkDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { BlogsPage } from './pages/BlogsPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { preloadIcons } from './components/Icon';

async function bootstrap() {
  if (!location.hash) {
    location.hash = '#/home';
  }

  try {
    const data = await loadData();
    initTheme(data.site.theme.default);

    await preloadIcons(['github', 'linkedin', 'leetcode', 'codeforces', 'codeberg', 'mail', 'moon', 'sun', 'arrow-right', 'arrow-left', 'calendar', 'code', 'external-link', 'book', 'home', 'folder', 'tag']);

    await initRouter(data, {
      'home': (d, p) => HomePage(d, p),
      'works': (d, p) => WorksPage(d, p),
      'works/:slug': (d, p) => WorkDetailPage(d, p),
      'projects': (d, p) => ProjectsPage(d, p),
      'projects/:slug': (d, p) => ProjectDetailPage(d, p),
      'blogs': (d, p) => BlogsPage(d, p),
      'blogs/:slug': (d, p) => BlogPostPage(d, p),
    });

    const loader = document.querySelector('.global-loader');
    if (loader) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          loader.classList.add('global-loader--hide');
          setTimeout(() => loader.remove(), 500);
        });
      });
    }
  } catch (err) {
    console.error('Failed to initialize app:', err);
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;color:var(--text);background:var(--bg);text-align:center;padding:2rem;">
          <h2 style="margin-bottom:1rem;color:var(--accent);">Failed to load application</h2>
          <p style="margin-bottom:1rem;">There was an error loading the necessary data.</p>
          <p style="font-size:0.9rem;opacity:0.7;">If you are viewing this file directly (file://), please run a local web server (e.g. <code>npm run serve</code> or Live Server) to allow fetching data.</p>
          <p style="font-size:0.8rem;opacity:0.5;margin-top:2rem;">Error: ${err instanceof Error ? err.message : String(err)}</p>
        </div>
      `;
    }
  }
}

document.addEventListener('click', (e) => {
  const target = e.target as Element;
  if (target.closest('#theme-toggle')) {
    const next = toggleTheme();
    const icon = target.closest('#theme-toggle')?.querySelector('svg');
    if (icon) {
      const name = next === 'dark' ? 'moon' : 'sun';
      fetch(`assets/icons/${name}.svg`)
        .then(r => r.text())
        .then(svg => {
          icon.outerHTML = svg.replace('<svg', '<svg width="18" height="18"');
        });
    }
  }
});

bootstrap();