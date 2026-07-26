export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

export interface NavItem {
  label: string;
  path: string;
}

export interface SiteTheme {
  default: string;
  toggle: boolean;
}

export interface SiteData {
  name: string;
  title: string;
  description: string;
  url: string;
  socials: SocialLink[] | { data: SocialLink[] };
  nav: NavItem[] | { data: NavItem[] };
  theme: SiteTheme;
}

export interface HeroData {
  greeting: string;
  name: string;
  title: string;
  bio: string;
  image: string;
}

export interface CtaLink {
  label: string;
  path: string;
  icon: string;
}

export interface HomeData {
  hero: HeroData;
  featuredWorks: number | { data: number };
  ctaLinks: CtaLink[] | { data: CtaLink[] };
}

export interface WorkLinks {
  source?: string;
  demo?: string;
}

export interface ProjectLinks {
  source?: string;
  demo?: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  links?: ProjectLinks;
  featured: boolean;
  date: string;
  image?: string;
  joke?: string;
}

export interface Work {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  links?: WorkLinks;
  featured: boolean;
  date: string;
  image?: string;
  joke?: string;
}

export interface Blog {
  slug: string;
  title: string;
  author?: string;
  description: string;
  tags: string[];
  date: string;
  content?: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  bullets?: string[];
  description?: string;
}

export interface WorksData {
  experience?: { data: Experience[] };
  works?: { data: Work[] };
}

export interface ProjectsData {
  projects?: { data: Project[] };
}

export interface AppData {
  site: SiteData;
  home: HomeData;
  works: Work[] | WorksData;
  projects: Project[] | ProjectsData;
  blogs: Blog[] | { data: Blog[] };
}

export interface RouteParams {
  [key: string]: string;
}

export interface PageFn {
  (data: AppData, params: RouteParams): string | Promise<string>;
}

export interface RouteMap {
  [pattern: string]: PageFn;
}


export interface ButtonOpts {
  label: string;
  path: string;
  variant?: string;
  icon?: string;
}

export interface SectionOpts {
  title?: string;
  description?: string;
}

export interface LayoutOpts {
  fullWidth?: boolean;
  fluid?: boolean;
}

export type ThemeName = 'dark' | 'light';

function unwrap<T>(arr: T[] | { data: T[] } | undefined): T[] {
  if (!arr) return [];
  if (Array.isArray(arr)) return arr;
  return arr.data || [];
}