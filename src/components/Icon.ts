const iconCache: Record<string, string> = {};
const pendingRequests: Record<string, Promise<void>> = {};

export async function Icon(name: string, attrs: Record<string, string> = {}): Promise<string> {
  if (iconCache[name]) {
    return wrapSvg(iconCache[name], attrs);
  }

  try {
    const res = await fetch(`assets/icons/${name}.svg`);
    const svg = await res.text();
    iconCache[name] = svg;
    return wrapSvg(svg, attrs);
  } catch {
    return '';
  }
}

export function IconSync(name: string, attrs: Record<string, string> = {}): string {
  if (iconCache[name]) {
    return wrapSvg(iconCache[name], attrs);
  }
  const placeholder = `<span class="icon-placeholder" data-icon="${name}"></span>`;
  loadIconAsync(name, attrs);
  return placeholder;
}

async function loadIconAsync(name: string, attrs: Record<string, string>): Promise<void> {
  if (name in pendingRequests) {
    await pendingRequests[name];
    document.querySelectorAll(`[data-icon="${name}"]`).forEach(el => {
      el.outerHTML = iconCache[name] ? wrapSvg(iconCache[name], attrs) : '';
    });
    return;
  }

  pendingRequests[name] = (async () => {
    try {
      const res = await fetch(`assets/icons/${name}.svg`);
      const svg = await res.text();
      iconCache[name] = svg;
      document.querySelectorAll(`[data-icon="${name}"]`).forEach(el => {
        el.outerHTML = wrapSvg(svg, attrs);
      });
    } catch {
      document.querySelectorAll(`[data-icon="${name}"]`).forEach(el => el.remove());
    } finally {
      delete pendingRequests[name];
    }
  })();

  await pendingRequests[name];
}

function wrapSvg(svg: string, attrs: Record<string, string>): string {
  let result = svg;
  for (const [key, value] of Object.entries(attrs)) {
    const attrName = key === 'className' ? 'class' : key;
    if (result.includes(attrName + '="')) {
      result = result.replace(
        new RegExp(`${attrName}="([^"]*)"`, 'g'),
        `${attrName}="$1 ${value}"`
      );
    } else {
      result = result.replace('<svg', `<svg ${attrName}="${value}"`);
    }
  }
  return result;
}

export async function preloadIcons(names: string[]): Promise<void> {
  const uncached = names.filter(name => !iconCache[name]);
  await Promise.all(uncached.map(name => 
    fetch(`assets/icons/${name}.svg`)
      .then(r => r.text())
      .then(svg => {
        iconCache[name] = svg;
      })
      .catch(() => {})
  ));
}
