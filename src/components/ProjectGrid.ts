import type { Project } from '../types';
import { ProjectCard } from './ProjectCard';

export function ProjectGrid(projects: Project[]): string {
  if (!projects || projects.length === 0) {
    return '<p class="text-muted">No projects yet.</p>';
  }

  return `
    <div class="work-grid">
      ${projects.map(p => ProjectCard(p)).join('')}
    </div>
  `;
}