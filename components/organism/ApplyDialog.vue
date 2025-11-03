<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue'; // 假設 ConfirmDialog.vue 位於 components 資料夾中

defineProps<{
  isOpen: boolean;
}>();

const { tm } = useI18n();

const emit = defineEmits(['close']);

const showConfirm = ref(false);

const openConfirm = () => {
  showConfirm.value = true;
};

const handleConfirmCancel = () => {
  showConfirm.value = false;
};

const handleConfirmConfirm = () => {
  showConfirm.value = false; // 關閉確認對話框
  emit('close'); // 觸發主對話框的關閉事件
};
</script>

<template>
  <Dialog :open="isOpen" class="relative z-50">
    <!-- 遮罩 -->
    <div class="fixed inset-0 bg-black/85" aria-hidden="true" />

    <!-- 外層容器：滿版 + padding -->
    <div class="fixed inset-0 w-screen h-screen p-4">
      <!-- DialogPanel：最大寬 1024px + 高度撐滿 -->
      <DialogPanel
        class="bg-white w-full h-full font-fusion-pixel max-w-[1024px] mx-auto flex flex-col relative"
      >
        <!-- 關閉按鈕 -->
        <button class="absolute top-4 right-4 z-10" @click="openConfirm">
          <img src="@/assets/images/icons/btn-close.svg" alt="" />
        </button>

        <!-- 標題 -->
        <DialogTitle
          class="text-primary-500 text-2xl text-center pb-4 mb-4 pt-16 custom-dashed dashed-black"
        >
          報名表單
        </DialogTitle>

        <!-- 滾動區域 -->
        <DialogDescription class="flex-1 overflow-y-auto px-4 pb-6">
          <div class="w-full aspect-[9/16] max-h-full">
            <iframe
              :src="tm('apply_url')"
              class="w-full h-full border-none"
              frameborder="0"
              allowfullscreen
              title="黑客松報名表單"
            ></iframe>
          </div>
        </DialogDescription>

        <!-- ConfirmOverlay -->
        <ConfirmDialog
          :is-open="showConfirm"
          @cancel="handleConfirmCancel"
          @confirm="handleConfirmConfirm"
          title="提示"
          message="請確認是否已送出報名表單，資料將不會儲存。"
          cancel-button-text="取消"
          confirm-button-text="確認"
        />
      </DialogPanel>
    </div>
  </Dialog>
</template>
```