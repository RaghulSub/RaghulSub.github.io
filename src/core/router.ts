import { render } from './renderer';
import type { AppData, RouteMap, RouteParams } from '../types';

let data: AppData;
let routes: RouteMap;

/**
 * Initializes the client-side router by storing app state and bindings.
 * 
 * @param appData - The application data loaded from JSON files.
 * @param pageMap - A mapping of route patterns to their rendering functions.
 * @returns A promise that resolves when the router is initialized.
 */
export async function initRouter(appData: AppData, pageMap: RouteMap): Promise<void> {
  data = appData;
  routes = pageMap;

  bindNavigation();
  handleRoute();

  window.addEventListener('hashchange', handleRoute);
}

/**
 * Intercepts document-level click events to override default anchor behaviors.
 * This prevents full page reloads for internal SPA links (`data-nav`),
 * manages smooth scrolling for in-page anchors, and handles copy-code button interactions.
 * 
 * @returns {void}
 */
function bindNavigation(): void {
  document.body.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    
    const link = target.closest('a[data-nav]');
    if (link) {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href) {
        window.location.hash = href.replace('#', '');
      }
      return;
    }

    // Handle copy code buttons
    const copyBtn = target.closest('.code-block__copy') as HTMLButtonElement;
    if (copyBtn) {
      const codeBlock = copyBtn.closest('.code-block');
      const pre = codeBlock?.querySelector('pre');
      if (pre) {
        const text = pre.textContent || '';
        navigator.clipboard.writeText(text).then(() => {
          const originalHTML = copyBtn.innerHTML;
          copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
          copyBtn.classList.add('copied');
          
          setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.classList.remove('copied');
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy code: ', err);
        });
      }
      return;
    }

    // Handle internal anchor links (like TOC or markdown internal links)
    const anchorLink = target.closest('a[href^="#"]:not([data-nav])') as HTMLAnchorElement;
    if (anchorLink) {
      const href = anchorLink.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const targetElement = document.getElementById(href.substring(1));
        if (targetElement) {
          // Adjust for fixed nav bar height
          const navHeight = 56; // Standard nav height fallback
          const y = targetElement.getBoundingClientRect().top + window.scrollY - navHeight - 20;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    }
  });
}

/**
 * Evaluates the current window hash against defined routes and renders the
 * matched page. Falls back to rendering the `/home` route if no match is found.
 * 
 * @returns A promise that resolves when the route is handled and rendered.
 */
async function handleRoute(): Promise<void> {
  const hash = window.location.hash.slice(1) || '/home';
  const route = findRoute(hash, routes);
  if (route) {
    const result = await route.page(data, route.params);
    render(typeof result === 'string' ? result : '');
  } else {
    const homeRoute = findRoute('/home', routes) || { page: routes['home'] };
    if (homeRoute && homeRoute.page) {
      const result = await homeRoute.page(data, {});
      render(typeof result === 'string' ? result : '');
    }
  }
}

/**
 * Scans the registered route map to find the first pattern that matches the
 * given URL path, returning both the page handler and the extracted parameters.
 * 
 * @param path - The current URL path to match.
 * @param routes - The defined application routes.
 * @returns An object containing the matched page function and extracted parameters, or null if no match.
 */
function findRoute(path: string, routes: RouteMap): { page: any; params: RouteParams } | null {
  for (const pattern in routes) {
    const params = matchRoute(pattern, path);
    if (params) {
      return { page: routes[pattern], params };
    }
  }
  return null;
}

/**
 * Parses a dynamic URL path against a routing pattern (e.g. `/works/:slug`),
 * capturing parameter segments if a match is fully verified.
 * 
 * @param pattern - The route pattern containing optional dynamic segments (e.g., '/works/:slug').
 * @param path - The actual URL path to test.
 * @returns A dictionary of extracted route parameters, or null if the path doesn't match the pattern.
 */
function matchRoute(pattern: string, path: string): RouteParams | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) return null;

  const params: RouteParams = {};

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }

  return params;
}