import { IconSync } from './Icon';

export function EmptyState(title: string, message: string, icon = 'book'): string {
  return `
    <div class="empty-state">
      <div class="empty-state__icon">
        ${IconSync(icon, { width: '48', height: '48' })}
      </div>
      <h3 class="empty-state__title">${title}</h3>
      <p class="empty-state__text">${message}</p>
    </div>
  `;
}
