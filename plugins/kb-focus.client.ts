import { defineNuxtPlugin } from '#app';

let currentId: string | null = null;
const registry: Map<string, { el: HTMLElement; id: string; x: number; y: number }> = new Map();

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

  const candidates = [...registry.entries()]
    .filter(([id]) => id !== currentId)
    .map(([id, entry]) => {
      const dx = entry.x - current.x;
      const dy = entry.y - current.y;
      const dist = dx * dx + dy * dy;
      return { id, entry, dx, dy, dist };
    })
    .filter(({ dx, dy, entry }) => {
      switch (dir) {
        case 'up':
          return dy < 0;
        case 'down':
          return dy > 0;
        case 'left':
          return dx < 0 && entry.y === current.y;
        case 'right':
          return dx > 0 && entry.y === current.y;
      }
    });

  if (candidates.length === 0) return;

  // 上下鍵：優先找 y 軸最近，然後再比較 x 差距
  if (dir === 'up' || dir === 'down') {
    candidates.sort((a, b) => {
      const dyDiff = Math.abs(a.entry.y - current.y) - Math.abs(b.entry.y - current.y);
      if (dyDiff !== 0) return dyDiff;
      return Math.abs(a.entry.x - current.x) - Math.abs(b.entry.x - current.x);
    });
  } else {
    // 左右鍵：只在同一 y 軸，找 x 軸最近的
    candidates.sort((a, b) => Math.abs(a.entry.x - current.x) - Math.abs(b.entry.x - current.x));
  }

  const best = candidates[0];
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
