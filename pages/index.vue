<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import type { News } from '~/interfaces/news.interface';
import type { JudgeList } from '~/interfaces/judge.interface';
import type { PastVideo } from '~/interfaces/past.interface';
import type { Sponsor } from '~/interfaces/sponsor.interface';
import { useDialogStore } from '~/stores/dialogStore';
import { ROUTE_PATHS } from '~/constants/routes';

const dialogStore = useDialogStore();
const { activeDialog } = storeToRefs(dialogStore);

const { tm } = useI18n();
const runtimeConfig = useRuntimeConfig();

const headerHeight = ref(0);
const bannerHeight = ref('100vh');

/** banner content 列表 */
const bannerContentList = computed<{ label: string; value: string }[]>(() => {
  const data = tm('hero_banner.content');
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});

/** 評審列表 */
const judgeList = computed<JudgeList[]>(() => {
  const data = tm('rules.judges');
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});

/** 重要時程 */
const scheduleList = computed(() => {
  const data = tm('schedule.list');
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});
/** 選中的重要時程 */
const activeSchedule = ref(scheduleList.value[2]);

/** 最新消息列表 */
const newsList = computed<News[]>(() => {
  const data = tm('news.list');
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});
/** 目前顯示的最新消息 */
const availableNews = computed(() => newsList.value.filter(item => item.available));
/** 選中的最新消息 */
const activeNews = ref<News | null>(null);

/** 影音回顧 */
const videoList = computed<PastVideo[]>(() => {
  const data = tm('past.videos.list');
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});

/**
 * 參賽回顧 - 當前頁數
 */
const pastCurrentPage = ref(1);
/**
 * 參賽回顧 - 每次顯示影片數量
 */
const pastSlidesPerPage = 3;
/**
 * 參賽回顧 - 總頁數
 */

const pastTotalPages = computed(() => Math.ceil(videoList.value.length / pastSlidesPerPage));

const currentScheduleIndex = computed(() =>
  scheduleList.value.findIndex(tab => tab.id === activeSchedule.value.id)
);

// 監聽 Swiper 變更時，更新 `pastCurrentPage`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onPastSlideChange = (event: any) => {
  // console.log(event);
  if (event) {
    pastCurrentPage.value = Math.ceil(event.realIndex / pastSlidesPerPage) + 1;
  }
};

/** 贊助單位 */
const sponsorList = computed<Sponsor[]>(() => {
  const data = tm('sponsor.list');
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});

const duplicatedSponsorList = computed(() => [...sponsorList.value, ...sponsorList.value]);

// 存放距離
const tabToContentDistance = ref(0);
// 存放高度
const tabHeight = ref(0);

const isRegistrationClosed = computed(() => {
  const deadline = new Date(tm('schedule.apply_count_down'));
  return new Date() > deadline;
});

onMounted(() => {
  calculateBannerHeight();
  calculateDistance();

  window.addEventListener('resize', () => {
    calculateBannerHeight();
    calculateDistance();
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    calculateBannerHeight();
    calculateDistance();
  });
});

const calculateBannerHeight = () => {
  const header = document.querySelector('header');
  const controlbar = document.querySelector('.controlbar');
  if (header && controlbar) {
    const headerRect = header.getBoundingClientRect();
    const controlbarRect = controlbar.getBoundingClientRect();
    headerHeight.value = headerRect.height;
    const availableHeight = window.innerHeight - headerRect.height - controlbarRect.height + 20;
    bannerHeight.value = `${availableHeight}px`;
  }
};

const calculateDistance = () => {
  nextTick(() => {
    const activeTab = document.querySelector('.schedule-tab');
    const rightContent = document.querySelector('.right-content'); // 右側內容區

    if (activeTab && rightContent) {
      const tabRect = activeTab.getBoundingClientRect();
      const contentRect = rightContent.getBoundingClientRect();
      tabToContentDistance.value = parseFloat((contentRect.left - tabRect.right).toFixed(2));
      tabHeight.value = parseFloat(tabRect.height.toFixed(2));
    }
  });
};

const showPopup = (activeNews?: News) => {
  if (activeNews?.id === 2) {
    if (window.dataLayer) {
      // console.log('popup_view', window.dataLayer);
      window.dataLayer.push({
        event: 'popup_view',
        popup_name: 'newsletter_modal',
      });
    }
  }
};
</script>

<template>
  <div>
    <!-- 第1幀 - Hero Banner -->
    <section class="flex flex-col h-full lg:p-0 p-5 relative" :style="{ minHeight: bannerHeight }">
      <div class="lg:border-0 border border-white flex flex-1">
        <div
          class="lg:border-0 m-1 border border-white text-white flex-1 flex items-center justify-center text-center bg-tp"
        >
          <!-- desktop noise -->
          <img
            class="lg:block hidden hero-banner-noise hero-banner-noise--1"
            src="@/assets/images/hero-banner-noise1.svg"
            alt="noise"
          />
          <img
            class="lg:block hidden hero-banner-noise hero-banner-noise--3"
            src="@/assets/images/hero-banner-noise3.svg"
            alt="noise"
          />
          <div class="p-10 flex flex-col justify-around h-full max-h-[500px] relative">
            <!-- desktop noise -->
            <img
              class="lg:block hidden hero-banner-noise hero-banner-noise--2"
              src="@/assets/images/hero-banner-noise2.svg"
              alt="noise"
            />
            <!-- mobile noise -->
            <img
              class="lg:hidden block hero-banner-noise"
              src="@/assets/images/hero-banner-noise-mobile.svg"
              alt="noise"
            />
            <!-- title -->
            <p class="lg:text-2xl text-xl font-fusion-pixel text-are-you-ready mt-6">
              {{ tm('hero_banner.section_title') }}
            </p>
            <img
              src="@/assets/images/hero-banner-title.svg"
              class="mx-auto"
              alt="城市儀表板大黑克松"
            />
            <!-- <p class="text-7xl">
              城市儀表板
              <br />
              大黑克松
            </p> -->
            <p
              v-for="item in bannerContentList"
              :key="item.label"
              class="lg:flex items-center font-fusion-pixel"
            >
              <span class="lg:mr-4 lg:text-base text-sm lg:inline block lg:mb-0 mb-2">{{
                item.label
              }}</span>
              <span class="lg:text-4xl text-2xl lg:inline block">{{ item.value }}</span>
            </p>
            <div class="flex justify-center">
              <AtomButton
                v-kb-focus="{ id: 'index-button-1-2', x: 1, y: 2 }"
                class="min-w-60"
                :icon-type="isRegistrationClosed ? null : 'arrow'"
                :disabled="isRegistrationClosed"
                @click="dialogStore.openDialog('apply')"
                @keydown.enter.prevent="dialogStore.openDialog('apply')"
              >
                {{ isRegistrationClosed ? '報名截止' : '立即報名' }}
              </AtomButton>
            </div>
          </div>
        </div>
      </div>
    </section>
    <AtomSectionDecoration class="lg:block hidden" />
    <AtomSectionDecoration class="lg:hidden" />
    <!-- 第2幀 - 競賽規則 -->
    <template v-if="tm('rules').available">
      <div class="lg:flex justify-end hidden">
        <MoleculeSectionNav active-nav-name="rules" :focus-y="3" />
      </div>
      <section id="rules" class="2xl:p-0 p-5">
        <div class="border border-white relative">
          <div class="m-1 border border-white">
            <p class="section-title font-fusion-pixel">
              {{ tm('rules.section_title') }}
            </p>
            <div class="text-white p-10 text-center border border-b-white">
              <p class="whitespace-pre-wrap">{{ tm('rules.description') }}</p>
            </div>
            <div class="grid lg:grid-cols-5 grid-cols-1 border border-b-white">
              <div class="lg:col-span-3 lg:p-16 p-4 lg:border lg:border-r-white">
                <div class="relative">
                  <!-- desktop 背景圖 -->
                  <img
                    src="@/assets/images/img-rules-bg.png"
                    class="lg:w-2/3 w-[95%] lg:block hidden"
                    alt="背景圖"
                  />
                  <!-- desktop image -->
                  <img
                    src="@/assets/images/img-rules.jpg"
                    class="absolute top-[12%] left-[12%] right-0 lg:block hidden"
                    :style="{ width: 'calc(100% - 12%)' }"
                    alt="程式儀表板大黑克松宣傳圖"
                  />
                  <!-- mobile 背景圖 -->
                  <img
                    src="@/assets/images/img-rules-bg-mobile.png"
                    class="lg:w-2/3 w-[95%] lg:hidden block"
                    alt="背景圖"
                  />
                  <!-- mobile image -->
                  <img
                    src="@/assets/images/img-rules-mobile.jpg"
                    class="absolute top-[10%] left-[16%] lg:hidden block"
                    :style="{ width: 'calc(100% - 16%)' }"
                    alt="程式儀表板大黑克松宣傳圖"
                  />
                  <!-- desktop noise1 -->
                  <img
                    class="lg:block hidden rules-noise rules-noise--1"
                    src="@/assets/images/rules-noise1.svg"
                    alt="noise"
                  />
                  <!-- desktop noise2 -->
                  <img
                    class="lg:block hidden rules-noise rules-noise--2"
                    src="@/assets/images/rules-noise2.svg"
                    alt="noise"
                  />
                </div>
              </div>

              <div class="lg:col-span-2 lg:p-10 p-4">
                <div class="text-white leading-loose mb-6">
                  <p class="text-xl text-center my-4">
                    {{ tm('rules.content_title') }}
                  </p>
                  <p class="whitespace-pre-wrap">{{ tm('rules.content') }}</p>
                </div>
                <div class="flex lg:justify-start justify-between space-x-4">
                  <a
                    v-for="(btn, index) in tm('rules.buttons')"
                    :key="index"
                    v-kb-focus="{
                      id: `index-rules-${index + 1}-4`,
                      x: index + 1,
                      y: 4,
                    }"
                    :href="btn.link"
                    target="_blank"
                    class="connect-btn font-px437"
                  >
                    {{ btn.name }}
                  </a>
                </div>
              </div>
            </div>
            <div
              class="flex flex-col lg:flex-row justify-between items-center lg:p-10 p-4 bg-primary-300 m-1"
            >
              <!-- 文字區塊 (lg 以上才顯示) -->
              <div class="hidden lg:block flex-1">
                <p class="font-px437 text-white typing-container">
                  LEARN MORE OR JOIN NOW? ( Y / N )
                </p>
              </div>

              <!-- 按鈕區塊 -->
              <div
                class="w-full lg:w-auto flex flex-nowrap justify-center lg:justify-end space-x-8"
              >
                <AtomButton
                  v-kb-focus="{
                    id: `index-rules-button-1-5`,
                    x: 1,
                    y: 5,
                  }"
                  :to="ROUTE_PATHS.RULES"
                  :icon-type="'arrow'"
                  class="w-1/2 lg:w-auto lg:min-w-60 text-center block"
                >
                  瞭解詳情
                </AtomButton>
                <AtomButton
                  v-kb-focus="{
                    id: `index-rules-button-2-5`,
                    x: 2,
                    y: 5,
                  }"
                  :icon-type="isRegistrationClosed ? null : 'arrow'"
                  :disabled="isRegistrationClosed"
                  class="w-1/2 lg:w-auto lg:min-w-60"
                  @click="dialogStore.openDialog('apply')"
                  @keydown.enter.prevent="dialogStore.openDialog('apply')"
                >
                  {{ isRegistrationClosed ? '報名截止' : '立即報名' }}
                </AtomButton>
              </div>
            </div>

            <!-- 評審介紹 -->
            <div v-if="tm('rules.judges').available" class="judge border border-t-white">
              <div class="judge border border-t-white">
                <div class="p-10">
                  <p class="font-fusion-pixel text-2xl text-white text-center">本屆評審介紹</p>
                </div>

                <template v-for="(item, index) in judgeList" :key="index">
                  <Disclosure v-slot="{ open }" :default-open="true">
                    <DisclosureButton
                      v-kb-focus="{
                        id: `index-rules-judge-1-${index + 6}`,
                        x: 1,
                        y: index + 6,
                      }"
                      class="w-full flex items-center justify-between p-2 border border-t-white border-b-white"
                    >
                      <p class="text-white text-center font-fusion-pixel mx-auto">
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
                          <div
                            v-for="judge in item.list"
                            :key="judge.id"
                            class="w-1/5 p-4 flex-shrink-0"
                          >
                            <div class="judge-box relative">
                              <img
                                :src="judge.thumbnail"
                                class="w-full h-full object-cover"
                                alt=""
                              />
                              <p class="px-4 py-2 bg-white absolute -left-3 -bottom-3">
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
                            :modules="[Navigation, Pagination]"
                            :slides-per-view="'auto'"
                            :space-between="20"
                            :centered-slides="true"
                            :loop="false"
                            :pagination="{ type: 'bullets', clickable: true }"
                          >
                            <SwiperSlide
                              v-for="judge in item.list"
                              :key="judge.id"
                              class="swiper-judge-slide"
                            >
                              <div class="judge-box relative">
                                <img
                                  :src="runtimeConfig.app.baseURL + judge.thumbnail"
                                  class="w-full h-full object-cover"
                                  alt=""
                                />
                                <p class="px-4 py-2 bg-white absolute -left-3 -bottom-3">
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
            </div>
          </div>
        </div>
      </section>
      <AtomSectionDecoration direction="right" />
    </template>
    <!-- 第3幀 - 重要時程 -->
    <template v-if="tm('schedule').available">
      <div class="lg:flex justify-start hidden">
        <MoleculeSectionNav active-nav-name="schedule" :focus-y="8" />
      </div>
      <section id="schedule" class="2xl:p-0 p-5">
        <div class="border border-white relative">
          <div class="m-1 border border-white">
            <p class="section-title font-fusion-pixel">
              {{ tm('schedule.section_title') }}
            </p>
            <div
              class="lg:flex block justify-center items-center font-fusion-pixel text-white lg:p-10 px-2 py-4 pt-6 text-center border border-b-white"
            >
              <p class="mb-4 lg:mb-0">競賽倒數</p>
              <MoleculeCountDown :target-date="new Date(tm('schedule.count_down'))" />
            </div>
            <!-- desktop -->
            <div class="hidden p-4 lg:grid lg:grid-cols-7">
              <div class="col-span-2">
                <div class="flex">
                  <!-- 左側 Tabs -->
                  <div class="relative flex flex-col font-fusion-pixel">
                    <div
                      v-for="(tab, index) in scheduleList"
                      :key="tab.id"
                      v-kb-focus="{
                        id: `index-schedule-tab-1-${9 + index}`,
                        x: 1,
                        y: 9 + index,
                      }"
                      class="schedule-tab relative p-6 border border-white text-xl text-center cursor-pointer mb-4 hover:bg-primary-50 hover:text-primary-500"
                      :class="
                        activeSchedule.id === tab.id
                          ? 'bg-primary-50 text-primary-500 border-0 shadow-[4px_4px_0px_black]'
                          : 'text-white'
                      "
                      @click="activeSchedule = tab"
                    >
                      {{ tab.schedule_name }}

                      <!-- 第一個選項：純水平線 -->
                      <div
                        v-if="
                          index === 0 &&
                          scheduleList.findIndex(tab => tab.id === activeSchedule.id) === index
                        "
                        class="absolute top-1/2 right-[-100%] w-[100%] h-[2px] bg-white"
                      ></div>

                      <!-- 其他選項：水平 → 垂直 → 水平的折線 -->
                      <div
                        v-if="
                          index > 0 &&
                          scheduleList.findIndex(tab => tab.id === activeSchedule.id) === index
                        "
                        class="absolute right-[-20px] top-1/2 h-[2px] bg-white"
                        :style="{
                          width: tabToContentDistance / 2 + 'px',
                          right: -tabToContentDistance / 2 + 'px',
                        }"
                      ></div>
                      <div
                        v-if="
                          index > 0 &&
                          scheduleList.findIndex(tab => tab.id === activeSchedule.id) === index
                        "
                        class="absolute w-[2px] bg-white"
                        :style="{
                          right: -tabToContentDistance / 2 + 'px',
                          height: (tabHeight + 16) * index + 2 + 'px',
                          bottom: tabHeight / 2 - 1 + 'px',
                        }"
                      ></div>
                      <div
                        v-if="
                          index > 0 &&
                          scheduleList.findIndex(tab => tab.id === activeSchedule.id) === index
                        "
                        class="absolute h-[2px] bg-white"
                        :style="{
                          width: tabToContentDistance / 2 + 2 + 'px',
                          right: -tabToContentDistance + 'px',
                          bottom: tabHeight / 2 + (tabHeight + 16) * index + 'px',
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-span-5 bg-primary-300 border border-white z-0 right-content">
                <!-- 右側內容區 -->
                <div class="flex-1 text-white">
                  <div
                    class="flex justify-between items-center p-4 border border-b-white min-h-[83px]"
                  >
                    <p class="text-xl whitespace-pre-wrap">
                      {{ activeSchedule.schedule_sub_name }}
                    </p>

                    <!-- 按鈕（根據類型顯示）-->
                    <template v-if="activeSchedule.button?.text">
                      <AtomButton
                        v-kb-focus="{
                          id: `index-schedule-button-${activeSchedule.button.type}-${9 + currentScheduleIndex}`,
                          x: 2,
                          y: 9 + currentScheduleIndex,
                        }"
                        class="min-w-60"
                        :href="
                          activeSchedule.button.type === 'outside_link'
                            ? activeSchedule.button.link
                            : undefined
                        "
                        :to="
                          activeSchedule.button.type === 'route'
                            ? activeSchedule.button.link
                            : undefined
                        "
                        @click="
                          () => {
                            if (activeSchedule.button.type === 'dialog') {
                              dialogStore.openDialog(activeSchedule.button.link);
                            }
                          }
                        "
                      >
                        {{ activeSchedule.button.text }}
                      </AtomButton>
                    </template>
                  </div>
                  <div class="p-4 w-full overflow-auto">
                    <table
                      v-show="
                        activeSchedule.id === 'online' ||
                        activeSchedule.id === 'workshop' ||
                        activeSchedule.id === 'competition'
                      "
                      class="w-full min-w-max border-collapse text-white"
                    >
                      <thead>
                        <tr class="border-white custom-dashed text-left">
                          <th
                            v-for="(header, index) in activeSchedule.schedule_headers"
                            :key="index"
                            class="p-2"
                          >
                            {{ header.name }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in activeSchedule.schedule" :key="index">
                          <td class="p-2 whitespace-pre-wrap">{{ item.col1 }}</td>
                          <td class="p-2 whitespace-pre-wrap">{{ item.col2 }}</td>
                          <td class="p-2 whitespace-pre-wrap">{{ item.col3 }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <!-- mobile -->
            <div class="lg:hidden">
              <Disclosure
                v-for="(tab, index) in scheduleList"
                v-slot="{ open }"
                :key="index"
                :default-open="activeSchedule.id === tab.id"
              >
                <DisclosureButton
                  class="w-full flex items-center justify-between p-6 border border-t-white border-b-white"
                  :class="{ 'bg-primary-50': open }"
                >
                  <p class="text-center mx-auto" :class="open ? 'text-primary-500' : 'text-white'">
                    {{ tab.schedule_name }}
                  </p>
                  <img
                    src="@/assets/images/icons/white-down-arrow.svg"
                    alt="arrow"
                    width="20"
                    class="absolute right-5 transition-transform duration-300"
                    :class="{ 'rotate-180': open }"
                  />
                </DisclosureButton>
                <DisclosurePanel class="bg-primary-300">
                  <!-- 右側內容區 -->
                  <div class="flex-1 text-white">
                    <div class="flex flex-col text-center p-4 border border-b-white">
                      <p class="text-xl mb-2 whitespace-pre-wrap">
                        {{ tab.schedule_sub_name }}
                      </p>
                      <!-- 按鈕（根據類型顯示）-->
                      <template v-if="tab.button?.text">
                        <AtomButton
                          class="min-w-60"
                          :href="tab.button.type === 'outside_link' ? tab.button.link : undefined"
                          :to="tab.button.type === 'route' ? tab.button.link : undefined"
                          @click="
                            () => {
                              if (tab.button.type === 'dialog') {
                                dialogStore.openDialog(tab.button.link);
                              }
                            }
                          "
                        >
                          {{ tab.button.text }}
                        </AtomButton>
                      </template>
                    </div>
                    <div class="p-4 w-full overflow-auto">
                      <table
                        v-show="
                          tab.id === 'online' || tab.id === 'workshop' || tab.id === 'competition'
                        "
                        class="w-full min-w-max border-collapse text-white"
                      >
                        <thead>
                          <tr class="border-white custom-dashed text-left">
                            <th
                              v-for="(header, headerIndex) in tab.schedule_headers"
                              :key="headerIndex"
                              class="p-2"
                            >
                              {{ header.name }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, itemIndex) in tab.schedule" :key="itemIndex">
                            <td class="p-2 whitespace-pre-wrap">{{ item.col1 }}</td>
                            <td class="p-2 whitespace-pre-wrap">{{ item.col2 }}</td>
                            <td class="p-2 whitespace-pre-wrap">{{ item.col3 }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p class="custom-dashed dashed-top p-4 text-center scroll-arrow">
                      向右滑看更多資訊
                    </p>
                  </div>
                </DisclosurePanel>
              </Disclosure>
            </div>
          </div>
        </div>
      </section>
      <AtomSectionDecoration />
    </template>
    <!-- 第4幀 - 最新消息 -->
    <template v-if="tm('news').available">
      <div class="lg:flex justify-end hidden">
        <MoleculeSectionNav active-nav-name="news" :focus-y="20" />
      </div>
      <section id="news" class="2xl:p-0 p-5">
        <div class="grid grid-cols-5">
          <div class="lg:col-span-3 col-span-5">
            <div class="border border-white relative">
              <div class="m-1 border border-white">
                <p class="section-title font-fusion-pixel">最新消息</p>

                <div class="lg:px-10 lg:py-14 p-4 pt-10 border border-b-white">
                  <div class="space-y-6 text-white max-h-[347px] lg:pr-4 overflow-auto">
                    <a
                      v-for="(news, index) in availableNews"
                      :key="index"
                      v-kb-focus="{
                        id: `index-news-1-${21 + index}`,
                        x: 1,
                        y: 21 + index,
                      }"
                      href="javascript:void(0)"
                      class="block border border-white p-4 transition hover:bg-primary-50 hover:text-primary-500 m-1"
                      @click="
                        activeNews = news;
                        dialogStore.openDialog('news');
                        showPopup(news);
                      "
                      @keydown.enter.prevent="
                        activeNews = news;
                        dialogStore.openDialog('news');
                        showPopup(news);
                      "
                    >
                      <p class="text-lg mb-2">{{ news.date }}</p>
                      <p class="text-xl text-ellipsis right-arrow">
                        {{ news.title }}
                      </p>
                    </a>
                  </div>
                </div>
                <div class="hidden lg:flex justify-between items-center p-10 bg-primary-300 m-1">
                  <!-- 文字區塊 (lg 以上才顯示) -->
                  <div class="flex-1">
                    <p class="font-px437 text-white typing-container">READ MORE：⭡⭣</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="relative lg:col-span-2 p-10 lg:flex hidden items-center justify-center">
            <img id="img-news" src="@/assets/images/img-news.png" alt="" />
            <div id="penguin-container" class="relative hidden">
              <img src="@/assets/images/img-news2.png" alt="" />
              <AtomPenguinAscii />
            </div>
            <!-- desktop noise1 -->
            <img
              class="lg:block hidden news-noise news-noise--1"
              src="@/assets/images/news-noise1.svg"
              alt="noise"
            />
            <!-- desktop noise2 -->
            <img
              class="lg:block hidden news-noise news-noise--2"
              src="@/assets/images/news-noise2.svg"
              alt="noise"
            />
          </div>
        </div>
      </section>
      <AtomSectionDecoration direction="right" />
    </template>
    <!-- 第5幀 - 參賽回顧 -->
    <template v-if="tm('past').available">
      <div class="lg:flex justify-start hidden">
        <MoleculeSectionNav active-nav-name="past" :focus-y="30" />
      </div>
      <section id="past" class="2xl:p-0 p-5">
        <div class="border border-white relative">
          <div class="m-1 border border-white">
            <p class="section-title font-fusion-pixel">參賽回顧</p>
            <div class="lg:p-10 p-6 border border-b-white">
              <!-- 影片列表 -->
              <!-- pc swiper -->
              <div class="hidden lg:block">
                <Swiper
                  :modules="[Navigation, Pagination]"
                  :slides-per-view="3"
                  :slides-per-group="3"
                  :space-between="20"
                  :loop="false"
                  :direction="'horizontal'"
                  :navigation="{
                    nextEl: '.past-swiper-button-next', // 下一則
                    prevEl: '.past-swiper-button-prev', // 上一則
                  }"
                  @slide-change="onPastSlideChange"
                >
                  <SwiperSlide v-for="(group, index) in videoList" :key="index">
                    <div :key="group.id">
                      <a
                        v-kb-focus="{
                          id: `index-video-${index + 1}-31`,
                          x: index + 1,
                          y: 31,
                        }"
                        :href="group.video_url"
                        target="_blank"
                        class="m-1 inline-block"
                      >
                        <div class="video-box relative">
                          <img
                            :src="group.thumbnail"
                            class="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                            alt=""
                          />
                          <!-- 播放按鈕 -->
                          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <img src="@/assets/images/icons/play.png" width="40" alt="play_btn" />
                          </div>
                        </div>
                        <div class="flex justify-between items-center mt-2 text-lg text-white">
                          <span>{{ group.title }}</span>
                          <span>
                            <img
                              src="@/assets/images/icons/white-right-arrow.svg"
                              width="24"
                              alt=""
                            />
                          </span>
                        </div>
                      </a>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
              <!-- mobile -->
              <div class="lg:hidden block">
                <div v-for="(group, index) in videoList.slice(0, 3)" :key="index" class="mb-8">
                  <a :href="group.video_url" target="_blank">
                    <div class="video-box relative">
                      <img
                        :src="group.thumbnail"
                        class="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                        alt=""
                      />
                      <!-- 播放按鈕 -->
                      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div
                          class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_6px]"
                        >
                          <span class="text-black text-4xl font-bold">▶</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex justify-between items-center mt-2 text-lg text-white">
                      <span>{{ group.title }}</span>
                      <span>→</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div v-if="pastTotalPages > 1" class="hidden lg:block py-4 px-10 border border-b-white">
              <!-- 分頁控制 -->
              <div class="flex justify-end items-center space-x-2 text-white font-px437">
                <button
                  v-kb-focus="{
                    id: `index-video-1-32`,
                    x: 1,
                    y: 32,
                  }"
                  class="past-swiper-button-prev"
                >
                  <img
                    src="@/assets/images/icons/white-down-arrow.svg"
                    alt="arrow"
                    width="14"
                    class="rotate-90"
                  />
                </button>
                <span>&nbsp;{{ pastCurrentPage }} / {{ pastTotalPages }}&nbsp;</span>
                <button
                  v-kb-focus="{
                    id: `index-video-2-32`,
                    x: 2,
                    y: 32,
                  }"
                  class="past-swiper-button-next"
                >
                  <img
                    src="@/assets/images/icons/white-down-arrow.svg"
                    alt="arrow"
                    width="14"
                    class="-rotate-90"
                  />
                </button>
              </div>
            </div>
            <div class="flex justify-between items-center p-10 bg-primary-300 m-1">
              <!-- 文字區塊 (lg 以上才顯示) -->
              <div class="hidden lg:block flex-1">
                <p class="font-px437 text-white typing-container">READ MORE COMPETITIONS：VIEW⭢</p>
              </div>

              <!-- 按鈕區塊 -->
              <div
                class="w-full lg:w-auto flex flex-nowrap justify-center lg:justify-end space-x-8"
              >
                <AtomButton
                  v-kb-focus="{
                    id: `index-video-1-33`,
                    x: 1,
                    y: 33,
                  }"
                  :to="ROUTE_PATHS.PAST"
                  :icon-type="'arrow'"
                  class="min-w-60"
                >
                  查看更多
                </AtomButton>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AtomSectionDecoration />
    </template>
    <!-- 第6幀 - 贊助單位 -->
    <template v-if="tm('sponsor').available">
      <div class="lg:flex justify-end hidden">
        <MoleculeSectionNav active-nav-name="sponsor" :focus-y="40" />
      </div>
      <section id="sponsor" class="2xl:p-0 p-5">
        <div class="border border-white relative">
          <div class="m-1 border border-white">
            <p class="section-title font-fusion-pixel">贊助單位</p>
            <div class="p-10 border border-b-white">
              <!-- 輪播效果 -->
              <div class="relative w-full overflow-hidden">
                <div class="marquee-container overflow-hidden">
                  <div class="marquee-content marquee-left flex">
                    <div
                      v-for="sponsor in duplicatedSponsorList"
                      :key="sponsor.id"
                      class="max-w-[200px] p-4 flex-shrink-0 mr-10"
                    >
                      <div class="group block">
                        <img
                          :src="runtimeConfig.app.baseURL + sponsor.image_url"
                          alt=""
                          class="w-full h-auto"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="lg:hidden block">
                  <div class="marquee-container marquee-right overflow-hidden">
                    <div class="marquee-content marquee-right flex">
                      <div
                        v-for="sponsor in duplicatedSponsorList"
                        :key="sponsor.id"
                        class="max-w-[200px] p-4 flex-shrink-0 mr-10"
                      >
                        <div class="group block">
                          <img
                            :src="runtimeConfig.app.baseURL + sponsor.image_url"
                            alt=""
                            class="w-full h-auto"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
    <OrganismNewsDialog
      :is-open="activeDialog === 'news'"
      :active-news="activeNews"
      @close="
        activeNews = null;
        dialogStore.closeDialog();
      "
    />
  </div>
</template>

<style lang="postcss">
.text-are-you-ready {
  @apply relative;
  &::before {
    content: url('@/assets/images/are-you-ready.svg');
    position: absolute;
    top: -50px;
    left: 40px;

    @media (max-width: 1024px) {
      left: 0;
    }
  }
}

.bg-tp {
  @apply relative;
  &::before {
    content: url('@/assets/images/hero-banner-tpe.svg');
    background-repeat: no-repeat;
    position: absolute;
    left: 0;
    bottom: 0;
  }

  &::after {
    content: url('@/assets/images/hero-banner-ntpc.svg');
    background-repeat: no-repeat;
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
@media (max-width: 1024px) {
  .bg-tp::before,
  .bg-tp::after {
    display: none;
  }

  .bg-tp {
    background-image: url('@/assets/images/hero-banner-tp.svg');
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: contain;
  }
}

.hero-banner-noise {
  @apply absolute;
  &--1 {
    @apply left-16 top-14;
  }
  &--2 {
    @apply left-6 top-[36%];
  }
  &--3 {
    @apply right-16 top-20;
  }

  animation: move-noise 1s infinite steps(1);

  @media (max-width: 1024px) {
    @apply left-4 top-[8%];
  }
}

.rules-noise {
  @apply absolute;
  &--1 {
    @apply top-1/2 -translate-y-1/2 right-8;
  }

  &--2 {
    @apply -bottom-12 right-0;
  }
  animation: move-noise 1s infinite steps(1);
}

.news-noise {
  @apply absolute;
  &--1 {
    @apply top-[24%] right-2;
  }

  &--2 {
    @apply bottom-16 left-[24%];
  }
  animation: move-noise 1s infinite steps(1);
}

@keyframes move-noise {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0);
  }
}

.section-title {
  @apply text-white lg:text-4xl text-[28px] absolute -top-7 left-1/2 -translate-x-1/2;
  @apply px-6 py-2 bg-primary-500;
}

.connect-btn {
  @apply px-6 py-2 border border-white text-white;
}

.typing-container {
  display: inline-block; /* 保持游標跟隨文字 */
  white-space: pre-wrap; /* 支援換行 */
  word-wrap: break-word; /* 響應式適應容器寬度 */
  font-size: 20px; /* 文字大小 */

  &::after {
    content: '';
    display: inline-block;
    width: 4px;
    height: 1em;
    background-color: white;
    animation: blink 1s steps(1) infinite;
  }
}

/* 定義閃爍動畫 */
@keyframes blink {
  50% {
    opacity: 0;
  }
}

/** 輪播 */
.marquee-container {
  height: 101%;
  transform: translate(-1px, -1px);
  overflow: hidden;
  display: flex;

  .marquee-content {
    animation-play-state: running;

    img {
      max-width: initial;
      transform: scale(1.001);
    }
  }

  .marquee-content.marquee-left {
    animation: marquee-left 30s linear infinite;
  }

  .marquee-content.marquee-right {
    animation: marquee-right 30s linear infinite;
  }

  &:hover .marquee-content {
    animation-play-state: paused;
  }
  /* 向左滑動 */
  @keyframes marquee-left {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
  /* 向右滑動 */
  @keyframes marquee-right {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(0);
    }
  }
}

.swiper-judge-slide {
  width: 80%;
}

.scroll-arrow {
  display: flex;
  align-items: center;
  justify-content: center; /* 讓文字置中 */
  gap: 10px; /* 圖示與文字間距 */

  &::before {
    content: url('@/assets/images/icons/scroll-left.svg');
    width: 30px;
    height: 30px;
  }

  &::after {
    content: url('@/assets/images/icons/scroll-right.svg');
    width: 30px;
    height: 30px;
  }
}

.text-ellipsis {
  white-space: nowrap; /* 禁止換行 */
  overflow: hidden; /* 隱藏超出部分 */
  text-overflow: ellipsis; /* 超出顯示省略號 */
}

.right-arrow {
  @apply relative block w-full pr-8;
  &::after {
    content: url('@/assets/images/icons/white-right-arrow.svg');
    position: absolute;
    right: 0;
  }
}

.penguin {
  display: block;
}
</style>
