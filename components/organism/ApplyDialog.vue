<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue';
defineProps<{
  isOpen: boolean;
}>();

const { tm } = useI18n();

const emit = defineEmits(['close']);

const showConfirm = ref(false);

const openConfirm = () => {
  showConfirm.value = true;
};

const confirmClose = () => {
  showConfirm.value = false;
  emit('close');
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
        <div
          v-if="showConfirm"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4"
        >
          <div class="relative bg-white w-full max-w-sm p-6 shadow-xl">
            <!-- 關閉按鈕 -->
            <button class="absolute top-4 right-4 z-10" @click="showConfirm = false">
              <img src="@/assets/images/icons/btn-close.svg" alt="關閉" />
            </button>
            <!-- 標題 -->
            <p
              class="text-primary-500 text-xl text-center font-fusion-pixel py-4 mb-4 custom-dashed dashed-black"
            >
              提示
            </p>
            <!-- 內容 -->
            <p class="text-center text-base py-4">請確認是否已送出報名表單，資料將不會儲存。</p>
            <!-- 按鈕 -->
            <div class="flex justify-center gap-4 mt-6 font-fusion-pixel">
              <button
                class="px-4 py-2 border-2 border-primary-500 hover:bg-gray-400 text-primary-500"
                @click="showConfirm = false"
              >
                取消
              </button>
              <button
                class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white"
                @click="confirmClose"
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>
