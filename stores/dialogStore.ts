import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { DialogName } from '~/constants/dialogs';

export const useDialogStore = defineStore('dialogStore', () => {
  // 使用 DialogName 型別控制開啟的對話框，預設為 null
  const activeDialog = ref<DialogName | null>(null);

  // 控制 body scroll
  watch(activeDialog, val => {
    document.body.style.overflow = val ? 'hidden' : '';
  });

  // 開啟指定對話框
  const openDialog = (name: DialogName | null) => {
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