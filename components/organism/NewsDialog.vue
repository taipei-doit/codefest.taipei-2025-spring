<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue';
import type { News } from '~/interfaces/news.interface';

defineProps<{
  isOpen: boolean;
  activeNews?: News | null;
}>();

const emit = defineEmits(['close']);
</script>

<template>
  <Dialog :open="isOpen" class="relative z-50" @close="emit('close')">
    <!-- 遮罩 -->
    <div class="fixed inset-0 bg-black/85" aria-hidden="true" />

    <!-- 外層容器：滿版 + padding -->
    <div class="fixed inset-0 w-screen h-screen p-4">
      <!-- DialogPanel：最大寬 862px + 高度撐滿 -->
      <DialogPanel class="bg-white w-full h-full max-w-[862px] mx-auto flex flex-col relative">
        <!-- 關閉按鈕固定右上 -->
        <button class="absolute top-4 right-4 z-10" @click="emit('close')">
          <img src="@/assets/images/icons/btn-close.svg" alt="關閉" />
        </button>

        <!-- 標題區域 -->
        <div class="pt-16 px-6">
          <p class="text-primary-500 text-lg mb-2">{{ activeNews?.date }}</p>
          <DialogTitle class="text-primary-500 text-2xl pb-4 mb-4 custom-dashed dashed-black">
            {{ activeNews?.title }}
          </DialogTitle>
        </div>

        <!-- 可捲動內容區 -->
        <DialogDescription
          class="flex-1 overflow-y-auto px-6 pb-6 text-lg leading-8 whitespace-pre-wrap"
        >
          <img v-if="activeNews?.image_url" :src="activeNews.image_url" alt="" class="mb-4" />
          <AtomSaveHtml :html="activeNews?.content ?? ''" />
          <!-- 占位 padding (可選) -->
          <div class="h-6"></div>
        </DialogDescription>
      </DialogPanel>
    </div>
  </Dialog>
</template>
