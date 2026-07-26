import type { AppData, RouteParams } from '../types';
import { Layout } from '../components/Layout';
import { ProjectDetail } from '../components/ProjectDetail';
import { unwrapProjects } from '../utils/data';

export function ProjectDetailPage(data: AppData, params: RouteParams): string {
  const { site, projects } = data;

  const projData = unwrapProjects(projects);
  const project = projData.find((p: any) => p.slug === params.slug);

  const content = ProjectDetail(project);

  return Layout(site, content, data);
}