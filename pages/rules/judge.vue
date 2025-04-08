<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import type { JudgeList } from '~/interfaces/judge.interface';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const { tm } = useI18n();
const runtimeConfig = useRuntimeConfig();

/** 評審列表 */
const judgeList = computed<JudgeList[]>(() => {
  const data = tm('rules.judges');
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});
</script>

<template>
  <div class="judge">
    <div class="lg:block hidden p-10">
      <p class="font-fusion-pixel text-2xl text-white text-center">本屆評審介紹</p>
    </div>

    <template v-for="(item, index) in judgeList" :key="index">
      <Disclosure v-slot="{ open }" :default-open="true">
        <DisclosureButton
          class="w-full h-16 flex items-center justify-between p-2 border border-t-white border-b-white bg-primary-300"
        >
          <p class="text-white text-lg text-center font-fusion-pixel mx-auto">
            {{ item.name }}
          </p>
          <img
            src="@/assets/images/icons/white-down-arrow.svg"
            alt="arrow"
            width="20"
            class="absolute right-5 transition-transform duration-300"
            :class="{ 'rotate-180': open }"
          />
        </DisclosureButton>
        <DisclosurePanel>
          <div class="relative w-full py-10 pb-4 lg:py-10">
            <!-- desktop -->
            <div class="lg:flex hidden">
              <div v-for="judge in item.list" :key="judge.id" class="w-1/5 p-4 flex-shrink-0">
                <div class="judge-box relative">
                  <img
                    :src="runtimeConfig.app.baseURL + judge.thumbnail"
                    class="w-full h-full object-cover"
                    alt=""
                  />
                  <p class="px-4 py-2 bg-white text-black absolute -left-3 -bottom-3">
                    {{ judge.name }}
                  </p>
                </div>
                <div class="mt-4 text-white text-center">
                  <p>{{ judge.corporation }}</p>
                  <p>{{ judge.position }}</p>
                </div>
              </div>
            </div>
            <!-- mobile Swiper -->
            <div class="lg:hidden">
              <Swiper
                :modules="[Pagination]"
                :slides-per-view="'auto'"
                :space-between="20"
                :centered-slides="true"
                :loop="false"
                :pagination="{ type: 'bullets', clickable: true }"
              >
                <SwiperSlide v-for="judge in item.list" :key="judge.id" class="swiper-judge-slide">
                  <div class="judge-box relative">
                    <img :src="judge.thumbnail" class="w-full h-full object-cover" alt="" />
                    <p class="px-4 py-2 bg-white text-black absolute -left-3 -bottom-3">
                      {{ judge.name }}
                    </p>
                  </div>
                  <div class="mt-8 text-white text-center">
                    <p>{{ judge.corporation }}</p>
                    <p>{{ judge.position }}</p>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </template>
  </div>
</template>
