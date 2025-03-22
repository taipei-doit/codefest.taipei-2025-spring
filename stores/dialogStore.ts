import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useDialogStore = defineStore('dialogStore', () => {
  const activeDialog = ref<null | 'apply' | 'news' | 'mobileMenu' | 'winningTeam'>(null);

  // 控制 body scroll
  watch(activeDialog, val => {
    document.body.style.overflow = val ? 'hidden' : '';
  });

  const openDialog = (name: typeof activeDialog.value) => {
    activeDialog.value = name;
  };

  const closeDialog = () => {
    activeDialog.value = null;
  };

  return {
    activeDialog,
    openDialog,
    closeDialog,
  };
});
