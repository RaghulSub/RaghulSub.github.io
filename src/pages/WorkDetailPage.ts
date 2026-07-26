import type { AppData, RouteParams } from '../types';
import { Layout } from '../components/Layout';
import { WorkDetail } from '../components/WorkDetail';
import { unwrapWorks } from '../utils/data';

export function WorkDetailPage(data: AppData, params: RouteParams): string {
  const { site, works } = data;

  const worksData = unwrapWorks(works);
  const work = worksData.find((w: any) => w.slug === params.slug);

  const content = WorkDetail(work);

  return Layout(site, content, data);
}