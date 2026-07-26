import type { AppData } from '../types';

export async function loadData(): Promise<AppData> {
  try {
    const [site, home, works, projects, blogs] = await Promise.all([
      fetch('data/site.json').then(r => { if (!r.ok) throw new Error(`Failed to load site.json: ${r.status}`); return r.json(); }),
      fetch('data/home.json').then(r => { if (!r.ok) throw new Error(`Failed to load home.json: ${r.status}`); return r.json(); }),
      fetch('data/works.json').then(r => { if (!r.ok) throw new Error(`Failed to load works.json: ${r.status}`); return r.json(); }),
      fetch('data/projects.json').then(r => { if (!r.ok) throw new Error(`Failed to load projects.json: ${r.status}`); return r.json(); }),
      fetch('data/blogs.json').then(r => { if (!r.ok) throw new Error(`Failed to load blogs.json: ${r.status}`); return r.json(); }),
    ]);

    return { site, home, works, projects, blogs };
  } catch (err) {
    console.error('Data loading error:', err);
    throw err;
  }
}