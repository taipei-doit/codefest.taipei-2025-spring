<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue';
import type { PastWinningTeam } from '~/interfaces/past.interface';
import { SwiperSlide } from 'swiper/vue';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import type Swiper from 'swiper';

const props = defineProps<{
  isOpen: boolean;
  activeWinningTeam?: PastWinningTeam | null;
}>();

const emit = defineEmits(['close']);

const thumbsSwiper = ref<Swiper | null>(null);

const setThumbsSwiper = (swiper: Swiper) => {
  thumbsSwiper.value = swiper;
};
</script>

<template>
  <Dialog :open="isOpen" class="relative z-50" @close="emit('close')">
    <!-- The backdrop, rendered as a fixed sibling to the panel container -->
    <div class="fixed inset-0 bg-black/85" aria-hidden="true" />

    <!-- Full-screen scrollable container -->
    <div class="fixed inset-0 w-screen overflow-y-auto">
      <!-- Container to center the panel -->
      <div class="flex min-h-full items-center justify-center p-4">
        <!-- The actual dialog panel -->
        <DialogPanel
          class="bg-white relative w-full max-w-[1147px] min-h-[684px] lg:p-10 px-4 py-10"
        >
          <button class="absolute top-0 right-0" @click="emit('close')">
            <img src="@/assets/images/icons/btn-close.svg" alt="" />
          </button>
          <div class="grid lg:grid-cols-5 grid-cols-1 lg:space-x-8">
            <div class="col-span-3">
              <DialogTitle class="lg:hidden block text-primary-500 lg:mb-12 mb-6">
                <p class="mb-4">{{ props.activeWinningTeam?.ranking }}</p>
                <p class="text-2xl">{{ props.activeWinningTeam?.team_name }}</p>
              </DialogTitle>
              <!-- 單圖模式 -->
              <div v-if="!props.activeWinningTeam?.image_list.length" class="aspect-video">
                <img
                  :src="props.activeWinningTeam?.thumbnail"
                  class="w-full h-full object-cover lg:mb-0 mb-6"
                  alt=""
                />
              </div>

              <!-- 多圖模式 -->
              <div v-else class="lg:mb-0 mb-6">
                <div class="relative">
                  <Swiper
                    :space-between="10"
                    :navigation="{
                      prevEl: '.team-swiper-button-prev',
                      nextEl: '.team-swiper-button-next',
                    }"
                    :thumbs="{ swiper: thumbsSwiper }"
                    :modules="[FreeMode, Navigation, Thumbs]"
                    class="mb-4"
                  >
                    <SwiperSlide
                      v-for="(item, index) in props.activeWinningTeam?.image_list"
                      :key="index"
                    >
                      <div class="aspect-video">
                        <img :src="item" class="w-full h-full object-cover" alt="" />
                      </div>
                    </SwiperSlide>
                  </Swiper>
                  <!-- 自訂左按鈕 -->
                  <button class="team-swiper-button-prev custom-nav-btn">
                    <img
                      src="@/assets/images/icons/white-down-arrow.svg"
                      alt="arrow"
                      width="22"
                      class="rotate-90"
                    />
                  </button>
                  <!-- 自訂右按鈕 -->
                  <button class="team-swiper-button-next custom-nav-btn">
                    <img
                      src="@/assets/images/icons/white-down-arrow.svg"
                      alt="arrow"
                      width="22"
                      class="-rotate-90"
                    />
                  </button>
                </div>
                <Swiper
                  :space-between="10"
                  :slides-per-view="'auto'"
                  :free-mode="true"
                  :watch-slides-progress="true"
                  :modules="[FreeMode, Navigation, Thumbs]"
                  class="thumbs-swiper"
                  @swiper="setThumbsSwiper"
                >
                  <SwiperSlide
                    v-for="(item, index) in props.activeWinningTeam?.image_list"
                    :key="index"
                    class="thumb-slide"
                  >
                    <div class="aspect-square cursor-pointer">
                      <img :src="item" class="w-full h-full object-cover" alt="" />
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
            <div class="col-span-2">
              <DialogTitle class="lg:block hidden text-primary-500 mb-12">
                <p class="mb-4">{{ props.activeWinningTeam?.ranking }}</p>
                <p class="text-2xl">{{ props.activeWinningTeam?.team_name }}</p>
              </DialogTitle>
              <p class="mb-4">獲獎團隊 |</p>
              <p class="text-lg">{{ props.activeWinningTeam?.team_members }}</p>
            </div>
          </div>
          <hr class="my-8" />
          <DialogDescription class="text-lg leading-8">
            <p class="mb-4">成果說明 |</p>
            <p class="text-lg">{{ props.activeWinningTeam?.description }}</p>
          </DialogDescription>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
</template>

<style lang="postcss">
.custom-nav-btn {
  @apply absolute top-0 h-full w-10 text-white flex items-center justify-center transition-all duration-300 z-50 cursor-pointer;
}

.custom-nav-btn:hover {
  @apply bg-white/50; /* 透明白色背景 */
}

.team-swiper-button-prev {
  @apply left-0;
}

.team-swiper-button-next {
  @apply right-0;
}

.thumb-slide {
  @apply lg:!w-12 lg:!h-12 w-10 h-10; /* 調整縮圖大小 */

  &:hover,
  &.swiper-slide-thumb-active {
    @apply border-[2.4px] border-primary-500;
  }
}
</style>
