import { defineNuxtPlugin } from '#app';

let currentId: string | null = null;
const registry: Map<
  string,
  {
    el: HTMLElement;
    id: string;
    x: number;
    y: number;
  }
> = new Map();

function focusElement(id: string | null) {
  if (!id || !registry.has(id)) return;
  const { el } = registry.get(id)!;
  el.focus();
  registry.forEach(({ el }) => el.classList.remove('is-focused'));
  el.classList.add('is-focused');
  currentId = id;
}

function moveFocus(dir: 'up' | 'down' | 'left' | 'right') {
  if (!currentId) return;
  const current = registry.get(currentId);
  if (!current) return;

  const candidates: { id: string; dist: number; dx: number; dy: number; entry: typeof current }[] =
    [];

  for (const [id, entry] of registry.entries()) {
    if (id === currentId) continue;

    const dx = entry.x - current.x;
    const dy = entry.y - current.y;

    let isValid = false;

    switch (dir) {
      case 'up':
        isValid = dy < 0;
        break;
      case 'down':
        isValid = dy > 0;
        break;
      case 'left':
        isValid = dx < 0;
        break;
      case 'right':
        isValid = dx > 0;
        break;
    }

    if (!isValid) continue;

    const dist = dx * dx + dy * dy;
    candidates.push({ id, dist, dx, dy, entry });
  }

  if (candidates.length === 0) return;

  let filtered: typeof candidates = [];

  if (dir === 'up' || dir === 'down') {
    // 找出 y 軸最接近的目標列（允許跳號）
    const targetY = candidates.reduce((prev, curr) => {
      return Math.abs(curr.entry.y - current.y) < Math.abs(prev.entry.y - current.y) ? curr : prev;
    }).entry.y;

    filtered = candidates.filter(c => c.entry.y === targetY);
  } else {
    // x 軸邏輯同上
    const targetX = candidates.reduce((prev, curr) => {
      return Math.abs(curr.entry.x - current.x) < Math.abs(prev.entry.x - current.x) ? curr : prev;
    }).entry.x;

    filtered = candidates.filter(c => c.entry.x === targetX);
  }

  const best = filtered.sort((a, b) => a.dist - b.dist)[0];

  if (best) focusElement(best.id);
}

export default defineNuxtPlugin(nuxtApp => {
  window.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        moveFocus('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveFocus('down');
        break;
      case 'ArrowLeft':
        e.preventDefault();
        moveFocus('left');
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveFocus('right');
        break;
      case 'Enter':
        if (currentId) {
          const entry = registry.get(currentId);
          entry?.el?.click();
        }
        break;
      case 'F1':
        e.preventDefault();
        document.body.classList.toggle('scanlines');
        break;
    }
  });

  nuxtApp.vueApp.directive('kb-focus', {
    mounted(el, binding) {
      const value = binding.value;
      if (!value || typeof value !== 'object' || !value.id || value.x == null || value.y == null)
        return;

      const { id, x, y } = value;

      requestAnimationFrame(() => {
        el.setAttribute('tabindex', '0');
        el.setAttribute('data-kb-id', id);
        registry.set(id, { el, id, x, y });

        if (registry.size === 1) {
          focusElement(id);
        }

        el.addEventListener('focus', () => {
          registry.forEach(({ el }) => el.classList.remove('is-focused'));
          el.classList.add('is-focused');
          currentId = id;
        });
      });
    },
    unmounted(el) {
      const id = el.getAttribute('data-kb-id');
      if (id) registry.delete(id);
    },
  });
});
