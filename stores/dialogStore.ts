ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useDialogStore = defineStore('dialogStore', () => {
  const activeDialog = ref<null | 'apply' | 'news' | 'mobileMenu' | 'winningTeam' | 'photo'>(null);

  // 控制 body scroll
  const isDialogOpen = computed(() => activeDialog.value !== null);

  const openDialog = (name: typeof activeDialog.value) => {
    activeDialog.value = name;
  };

  const closeDialog = () => {
    activeDialog.value = null;
  };

  return {
    activeDialog,
    isDialogOpen,
    openDialog,
    closeDialog,
  };
});