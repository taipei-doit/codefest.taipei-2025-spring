import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useModalStore = defineStore('modalStore', () => {
  const isModalOpen = ref(false);

  // 監聽 modal 狀態變化，控制 body 滾動
  watch(isModalOpen, newVal => {
    if (newVal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  return { isModalOpen };
});
