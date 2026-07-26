import type { HeroData } from '../types';
import { escapeHTML, sanitizeURL } from '../utils/security';

export function Hero(data: HeroData): string {
  const image = data.image ? `<img src="${sanitizeURL(data.image)}" alt="${escapeHTML(data.name)}" class="hero__image" />` : '';
  return `
    <div class="hero">
      <div class="hero__row">
        ${image}
        <div class="hero__text">
          <p class="hero__greeting">${escapeHTML(data.greeting)}</p>
          <h1 class="hero__name">${escapeHTML(data.name)}</h1>
          <p class="hero__title">${escapeHTML(data.title)}</p>
        </div>
      </div>
      <p class="hero__bio">${escapeHTML(data.bio)}</p>
    </div>
  `;
}