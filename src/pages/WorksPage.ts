import type { AppData, RouteParams, Work } from '../types';
import { unwrapWorks, unwrapProjects } from '../utils/data';
import { Layout } from '../components/Layout';
import { Section } from '../components/Section';
import { WorkGrid } from '../components/WorkGrid';
import { ProjectGrid } from '../components/ProjectGrid';

export interface ExtendedWork extends Work {
  type?: string;
  role?: string;
  company?: string;
  period?: string;
  bullets?: string[];
}

export function WorksPage(data: AppData, params: RouteParams): string {
  const { site, works, projects } = data;
  const worksObj = works as any;
  const expData = worksObj?.experience?.data || [];
  const worksData = unwrapWorks(works);
  const projectsData = unwrapProjects(projects);

  const experienceItems = expData.map((exp: any) => ({
    ...exp,
    type: 'experience',
    title: exp.role,
    description: exp.description || exp.bullets?.[0] || '',
    tags: [],
    featured: false,
    date: exp.period?.split('–')[0]?.trim() || ''
  })) as ExtendedWork[];

  const sortedWorks = [...worksData].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const sortedProjects = [...projectsData].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const content = `
    ${Section({ 
      title: 'Experience',
      description: 'Companies that trusted me with their codebases, and the fires I put out (or started) along the way.'
    }, WorkGrid(experienceItems))}
    ${sortedWorks.length > 0 ? Section({ title: 'Works' }, WorkGrid(sortedWorks)) : ''}
    ${Section({ 
      title: 'Projects',
      description: 'A collection of late-night experiments, open-source tools, and side projects powered entirely by caffeine.'
    }, ProjectGrid(sortedProjects))}
  `;

  return Layout(site, content, data);
}
