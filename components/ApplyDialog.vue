<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue';
defineProps<{
  isOpen: boolean;
}>();

const { tm } = useI18n();
const emit = defineEmits(['close']);
</script>

<template>
  <Dialog :open="isOpen" class="relative z-50">
    <!-- 遮罩 -->
    <div class="fixed inset-0 bg-black/85" aria-hidden="true" />

    <!-- 讓 DialogPanel 佔滿整個畫面，並有 padding -->
    <div class="fixed inset-0 w-screen h-screen p-4">
      <DialogPanel
        class="bg-white w-full h-full font-fusion-pixel flex flex-col relative"
      >
        <!-- 關閉按鈕 -->
        <button class="absolute top-4 right-4 z-10" @click="emit('close')">
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
            ></iframe>
          </div>
        </DialogDescription>
      </DialogPanel>
    </div>
  </Dialog>
</template>

