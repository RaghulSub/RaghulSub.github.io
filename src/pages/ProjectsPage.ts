import type { AppData, RouteParams, Project } from '../types';
import { unwrapProjects } from '../utils/data';
import { Layout } from '../components/Layout';
import { Section } from '../components/Section';
import { ProjectGrid } from '../components/ProjectGrid';

export function ProjectsPage(data: AppData, params: RouteParams): string {
  const { site, projects } = data;
  const projectsData = unwrapProjects(projects);

  const sorted = [...projectsData].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const content = `
    ${Section({ title: 'Projects' }, ProjectGrid(sorted))}
  `;

  return Layout(site, content, data);
}