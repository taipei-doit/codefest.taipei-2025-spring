ts
import { defineNuxtPlugin } from '#app';

interface KbFocusData {
  id: string;
  x: number;
  y: number;
}

let currentId: string | null = null;
let hasFocused = false;
const registry: Map<string, { el: HTMLElement; id: string; x: number; y: number }> = new Map();

// 聚焦元素，套用樣式
function focusElement(id: string | null) {
  if (!id || !registry.has(id)) return;
  const { el } = registry.get(id)!;

  el.focus();
  el.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest',
  });

  registry.forEach(({ el }) => {
    el.classList.remove('is-focused', 'is-focused-border');
  });

  if (el.classList.contains('focus-border-item')) {
    el.classList.add('is-focused-border');
  } else {
    el.classList.add('is-focused');
  }

  currentId = id;
}

// 通用移動焦點邏輯
function moveFocusCommon(
  dir: 'up' | 'down' | 'left' | 'right',
  sortFn: (a: { id: string; entry: { el: HTMLElement; id: string; x: number; y: number }; dx: number; dy: number }, b: { id: string; entry: { el: HTMLElement; id: string; x: number; y: number }; dx: number; dy: number }) => number,
  filterFn?: (dx: number, dy: number, entry: { el: HTMLElement; id: string; x: number; y: number }) => boolean,
) {
  if (!currentId && !hasFocused && registry.size > 0) {
    const firstEntry = registry.values().next().value;
    if (firstEntry) {
      focusElement(firstEntry.id);
      hasFocused = true;
      return;
    }
  }

  if (!currentId) return;
  const current = registry.get(currentId);
  if (!current) return;

  const candidates = [...registry.entries()]
    .filter(([id]) => id !== currentId)
    .map(([id, entry]) => {
      const dx = entry.x - current.x;
      const dy = entry.y - current.y;
      return { id, entry, dx, dy };
    })
    .filter(({ dx, dy, entry }) => {
      if (filterFn) {
        return filterFn(dx, dy, entry);
      }

      switch (dir) {
        case 'up':
          return dy < 0;
        case 'down':
          return dy > 0;
        case 'left':
          return dx < 0;
        case 'right':
          return dx > 0;
        default:
          return false;
      }
    });

  if (candidates.length === 0) return;

  candidates.sort(sortFn);

  focusElement(candidates[0]?.id);
}

// moveFocus：Index 頁邏輯
function moveFocusIndex(dir: 'up' | 'down' | 'left' | 'right') {
  moveFocusCommon(
    dir,
    (a, b) => {
      if (dir === 'up' || dir === 'down') {
        const dyDiff = Math.abs(a.entry.y - current!.y) - Math.abs(b.entry.y - current!.y);
        if (dyDiff !== 0) return dyDiff;
        return Math.abs(a.entry.x - current!.x) - Math.abs(b.entry.x - current!.x);
      } else {
        return Math.abs(a.entry.x - current!.x) - Math.abs(b.entry.x - current!.x);
      }
    },
    (dx, dy, entry) => {
      if (dir === 'left') {
        return dx < 0 && entry.y === registry.get(currentId)!.y;
      } else if (dir === 'right') {
        return dx > 0 && entry.y === registry.get(currentId)!.y;
      }
      return true;
    },
  );
}

// moveFocus：Rules 頁邏輯（優先同軸）
function moveFocusRules(dir: 'up' | 'down' | 'left' | 'right') {
  moveFocusCommon(
    dir,
    (a, b) => {
      if (dir === 'up' || dir === 'down') {
        const aAligned = a.dx === 0 ? 0 : 1;
        const bAligned = b.dx === 0 ? 0 : 1;
        if (aAligned !== bAligned) return aAligned - bAligned;
        const aY = Math.abs(a.dy);
        const bY = Math.abs(b.dy);
        if (aY !== bY) return aY - bY;
        return Math.abs(a.dx) - Math.abs(b.dx);
      } else {
        const aAligned = a.dy === 0 ? 0 : 1;
        const bAligned = b.dy === 0 ? 0 : 1;
        if (aAligned !== bAligned) return aAligned - bAligned;
        const aX = Math.abs(a.dx);
        const bX = Math.abs(b.dx);
        if (aX !== bX) return aX - bX;
        return Math.abs(a.dy) - Math.abs(b.dy);
      }
    },
  );
}

// 初始預設 moveFocus
let moveFocus = moveFocusIndex;

// 元件註冊函式
function setupKbFocus(el: HTMLElement, value: KbFocusData) {
  if (!value || typeof value !== 'object' || !value.id || value.x == null || value.y == null)
    return;

  const { id, x, y } = value;

  requestAnimationFrame(() => {
    el.setAttribute('tabindex', '0');
    el.setAttribute('data-kb-id', id);
    registry.set(id, { el, id, x, y });

    el.addEventListener('focus', () => {
      focusElement(id);
    });
  });
}

export default defineNuxtPlugin(nuxtApp => {
  const router = useRouter();

  // 根據路由切換 focus 行為
  router.afterEach(to => {
    if (to.path.startsWith('/rules')) {
      moveFocus = moveFocusRules;
    } else {
      moveFocus = moveFocusIndex;
    }
  });

  // 鍵盤事件
  window.addEventListener('keydown', e => {
    // 如果當前焦點在輸入框上，不處理鍵盤導航
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

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
          registry.get(currentId)?.el?.click();
        }
        break;
      case 'F1': {
        e.preventDefault();
        document.body.classList.toggle('scanlines');

        // 企鵝
        const imgNews = document.getElementById('img-news');
        imgNews?.classList.toggle('hidden');
        document.getElementById('penguin-container')?.classList.toggle('penguin');
        break;
      }
      case 'Backspace':
        e.preventDefault();
        router.back();
        break;
    }
  });

  // 自訂 directive：v-kb-focus
  nuxtApp.vueApp.directive('kb-focus', {
    mounted(el, binding) {
      setupKbFocus(el, binding.value);
    },
    updated(el, binding) {
      setupKbFocus(el, binding.value);
    },
    unmounted(el) {
      const id = el.getAttribute('data-kb-id');
      if (id) registry.delete(id);
    },
  });
});