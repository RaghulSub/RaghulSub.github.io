export function mount(selector: string, html: string): void {
  const el = document.querySelector(selector);
  if (el) el.innerHTML = html;
}

export function render(html: string, target = '#root'): void {
  const main = document.querySelector('.main');
  if (main) main.classList.add('main--loading');

  requestAnimationFrame(() => {
    try {
      mount(target, html);
      if (main) {
        main.classList.remove('main--loading');
      }
    } catch (err) {
      console.error('Render error:', err);
      mount(target, `<div class="error">Render error: ${(err as Error).message}</div>`);
    }
  });
}