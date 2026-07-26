import type { AppData, RouteParams } from '../types';
import { Layout } from '../components/Layout';
import { Hero } from '../components/Hero';
import { SocialLinks } from '../components/SocialLinks';
import { Section } from '../components/Section';
import { WorkGrid } from '../components/WorkGrid';
import { Button } from '../components/Button';
import { unwrap, unwrapWorks } from '../utils/data';

export function HomePage(data: AppData, params: RouteParams): string {
  const { site, home, works } = data;

  const worksData = unwrapWorks(works);
  const featuredWorks = worksData
    .filter((w: any) => w.featured)
    .slice(0, typeof home.featuredWorks === 'number' ? home.featuredWorks : home.featuredWorks?.data || 3);

  const socials = unwrap(site.socials);
  const ctaLinks = unwrap(home.ctaLinks);

  const content = `
    ${Hero(home.hero)}
    ${SocialLinks(socials)}
    ${featuredWorks.length > 0 ? Section({ 
      title: 'Featured Works',
      description: "A handpicked selection of my best work (aka the projects that didn't crash during the demo)."
    }, WorkGrid(featuredWorks)) : ''}
    <div class="cta-group">
      ${ctaLinks.map((link: any) => Button(link)).join('')}
    </div>
  `;

  return Layout(site, content, data);
}
