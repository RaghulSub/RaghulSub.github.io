import { escapeHTML } from '../utils/security';

export function Tag(label: string): string {
  const displayLabel = label.startsWith('#') ? label : `#${label}`;
  return `<span class="tag">${escapeHTML(displayLabel)}</span>`;
}
