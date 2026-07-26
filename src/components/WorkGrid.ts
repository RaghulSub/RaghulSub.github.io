import type { Work } from '../types';
import { WorkCard } from './WorkCard';
import type { ExtendedWork } from '../pages/WorksPage';

export function WorkGrid(works: ExtendedWork[] | Work[]): string {
  if (!works || works.length === 0) {
    return '<p class="text-muted">No works yet.</p>';
  }

  return `
    <div class="work-grid">
      ${works.map(w => WorkCard(w)).join('')}
    </div>
  `;
}