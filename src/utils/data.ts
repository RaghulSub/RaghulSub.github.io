export function unwrap<T>(arr: T[] | { data: T[] } | undefined): T[] {
  if (!arr) return [];
  if (Array.isArray(arr)) return arr;
  return (arr as any).data || [];
}

export function unwrapWorks(works: any): any[] {
  if (!works) return [];
  if (Array.isArray(works)) return works;
  return works.works?.data || [];
}

export function unwrapProjects(projects: any): any[] {
  if (!projects) return [];
  if (Array.isArray(projects)) return projects;
  return projects.projects?.data || [];
}