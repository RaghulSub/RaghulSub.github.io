import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadData } from './data-loader';

describe('loadData', () => {
  let fetchMock: any;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should successfully fetch and return all app data', async () => {
    fetchMock.mockImplementation(async (url: string) => {
      let data: any = {};

      if (url === 'data/site.json') data = { name: 'My Site' };
      if (url === 'data/home.json') data = { hero: { name: 'John Doe' } };
      if (url === 'data/works.json') data = [{ company: 'Acme' }];
      if (url === 'data/projects.json') data = [{ title: 'Project 1' }];
      if (url === 'data/blogs.json') data = [{ title: 'Blog 1' }];

      return {
        ok: true,
        json: async () => data,
      };
    });

    const result = await loadData();

    expect(fetchMock).toHaveBeenCalledWith('data/site.json');
    expect(fetchMock).toHaveBeenCalledWith('data/home.json');
    expect(fetchMock).toHaveBeenCalledWith('data/works.json');
    expect(fetchMock).toHaveBeenCalledWith('data/projects.json');
    expect(fetchMock).toHaveBeenCalledWith('data/blogs.json');

    expect(result).toEqual({
      site: { name: 'My Site' },
      home: { hero: { name: 'John Doe' } },
      works: [{ company: 'Acme' }],
      projects: [{ title: 'Project 1' }],
      blogs: [{ title: 'Blog 1' }],
    });
  });

  it('should throw an error if any fetch fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    fetchMock.mockImplementation(async (url: string) => {
      if (url === 'data/home.json') {
        return { ok: false, status: 404 };
      }
      return { ok: true, json: async () => ({}) };
    });

    await expect(loadData()).rejects.toThrow('Failed to load home.json: 404');

    consoleErrorSpy.mockRestore();
  });
});
