import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useDialogStore = defineStore('dialogStore', () => {
  const isMobileMenuDialogOpen = ref(false);
  const isApplyDialogOpen = ref(false);
  const isNewsDialogOpen = ref(false);

  // 監聽 modal 狀態變化，控制 body 滾動
  watch([isMobileMenuDialogOpen, isApplyDialogOpen, isNewsDialogOpen], ([mobile, apply, news]) => {
    const hasAnyOpen = mobile || apply || news;
    document.body.style.overflow = hasAnyOpen ? 'hidden' : '';
  });

  return { isMobileMenuDialogOpen, isApplyDialogOpen, isNewsDialogOpen };
});
