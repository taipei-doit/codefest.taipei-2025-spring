<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import type { News } from '~/interfaces/news.interface';
import type { JudgeList } from '~/interfaces/judge.interface';
import type { PastVideo, PastWinningTeam } from '~/interfaces/past.interface';
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
  const data = tm('rules.judges').list;
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
const availableNews = computed(() => {
  let filtered = newsList.value.filter((item: News) => item.available);

  if (newsKeyword.value) {
    const keyword = newsKeyword.value.toLowerCase();
    filtered = filtered.filter(
      (item: News) =>
        item.title.toLowerCase().includes(keyword) || item.date.toLowerCase().includes(keyword)
    );
  }

  if (newsTimeFilter.value === 'all') {
    filtered.sort((a: News, b: News) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return newsSort.value === 'newest' ? dateB - dateA : dateA - dateB;
    });
    return filtered;
  }

  const now = new Date();
  const filterDate = new Date();
  if (newsTimeFilter.value === 'week') filterDate.setDate(now.getDate() - 7);
  if (newsTimeFilter.value === 'month') filterDate.setMonth(now.getMonth() - 1);
  if (newsTimeFilter.value === 'year') filterDate.setFullYear(now.getFullYear() - 1);

  filtered = filtered.filter(
    (item: News) => new Date(item.date).getTime() >= filterDate.getTime()
  );

  filtered.sort((a: News, b: News) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return newsSort.value === 'newest' ? dateB - dateA : dateA - dateB;
  });

  return filtered;
});
/** 選中的最新消息 */
const activeNews = ref<News | null>(null);

/** 參賽回顧 */
const winningTeamList = computed<PastWinningTeam[]>(() => {
  const data = tm('past.winning_teams.list');
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

const pastTotalPages = computed(() => Math.ceil(winningTeamList.value.length / pastSlidesPerPage));

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

/** 感謝單位 */
const sponsorList = computed<Sponsor[]>(() => {
  const data = tm('sponsor.list');
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});

const duplicatedSponsorList = computed(() => {
  // 重複 4 次內容以確保無縫循環
  const originalList = sponsorList.value;
  return [...originalList, ...originalList, ...originalList, ...originalList];
});

// 存放距離
const tabToContentDistance = ref(0);
// 存放高度
const tabHeight = ref(0);

const isRegistrationClosed = computed(() => {
  const deadline = new Date(tm('schedule.apply_count_down'));
  return new Date() > deadline;
});

/** 選中的獲獎團隊 */
const activeWinningTeam = ref<PastWinningTeam | null>(null);

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

/** 最新消息排序 */
const newsSort = ref('newest');
/** 最新消息時間篩選 */
const newsTimeFilter = ref('all');
/** 最新消息關鍵字 */
const newsKeyword = ref('');
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
              alt="城市儀表板大黑客松"
            />
          </div>
        </div>
      </div>
    </section>
    <AtomSectionDecoration class="lg:block hidden" />
    <AtomSectionDecoration class="lg:hidden" />
    <!-- 第2幀 - 參賽回顧 -->
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
                  <SwiperSlide v-for="(group, index) in winningTeamList" :key="index">
                    <div :key="group.id">
                      <a
                        v-kb-focus="{
                          id: `index-video-${index + 1}-31`,
                          x: index + 1,
                          y: 31,
                        }"
                        href="javascript:void(0)"
                        class="m-1 inline-block"
                        @click="
                          activeWinningTeam = group;
                          dialogStore.openDialog('winningTeam');
                        "
                      >
                        <div class="video-box relative">
                          <img
                            :src="group.thumbnail"
                            class="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                            alt=""
                          />
                        </div>
                        <div class="flex justify-between items-center mt-2 text-lg text-white">
                          <span>{{ group.ranking }} | {{ group.team_name }}</span>
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
                <div
                  v-for="(group, index) in winningTeamList.slice(0, 3)"
                  :key="index"
                  class="mb-8"
                >
                  <a
                    href="javascript:void(0)"
                    @click="
                      activeWinningTeam = group;
                      dialogStore.openDialog('winningTeam');
                    "
                  >
                    <div class="video-box relative">
                      <img
                        :src="group.thumbnail"
                        class="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                        alt=""
                      />
                    </div>
                    <div class="flex justify-between items-center mt-2 text-lg text-white">
                      <span>{{ group.ranking }} | {{ group.team_name }}</span>
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
    <!-- 第3幀 - 競賽規則 -->
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
                    alt="程式儀表板大黑客松宣傳圖"
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
                    alt="程式儀表板大黑客松宣傳圖"
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
                                class="w-full h-full object-cover object-top"
                                :alt="`評審照片-${judge.name}`"
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
                                  class="w-full h-full object-cover object-top"
                                  :alt="`評審照片-${judge.name}`"
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
    <!-- 第4幀 - 重要時程 -->
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
            <!-- desktop -->
            <div class="hidden lg:p-10 px-2 py-4 lg:grid lg:grid-cols-7">
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
            <div class="mt-8 lg:hidden">
              <Disclosure
                v-for="(tab, index) in scheduleList"
                v-slot="{ open }"
                :key="index"
                :default-open="activeSchedule.id === tab.id"
              >
                <DisclosureButton
                  class="w-full flex items-center justify-between p-6 border border-t-white border-b-white transition-colors duration-200"
                  :class="[open ? 'bg-primary-50 text-primary-500' : 'text-white']"
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
    <!-- 第5幀 - 最新消息 -->
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
                  <!-- 功能列 -->
                  <div class="flex flex-wrap gap-4 mb-6 text-white">
                    <!-- 排序 -->
                    <div class="flex items-center">
                      <span class="mr-2">排序：</span>
                      <select
                        v-model="newsSort"
                        class="bg-primary-300 border border-white px-2 py-1 pr-8 appearance-none"
                      >
                        <option value="newest">最新優先</option>
                        <option value="oldest">最舊優先</option>
                      </select>
                    </div>
                    <!-- 時間篩選 -->
                    <div class="flex items-center">
                      <span class="mr-2">時間：</span>
                      <select
                        v-model="newsTimeFilter"
                        class="bg-primary-300 border border-white px-2 py-1 pr-8 appearance-none"
                      >
                        <option value="all">全部</option>
                        <option value="week">一週內</option>
                        <option value="month">一個月內</option>
                        <option value="year">一年內</option>
                      </select>
                    </div>
                    <!-- 關鍵字搜尋 -->
                    <div class="flex items-center flex-1">
                      <input
                        v-model="newsKeyword"
                        type="text"
                        placeholder="搜尋關鍵字..."
                        class="bg-primary-300 border border-white px-2 py-1 flex-1"
                      />
                    </div>
                  </div>

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
                      <div class="text-lg mb-2 flex items-center">
                        <span class="mr-2">{{ news.date }}</span>
                        <div
                          class="text-sm bg-secondary-500 text-white px-2 py-1 shadow-md"
                          :class="{ 'bg-primary-50 text-primary-500': news.tag === 'news' }"
                        >
                          <span>{{ news.tag === 'news' ? '最新消息' : '媒體報導' }}</span>
                        </div>
                      </div>
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
    <!-- 第6幀 - 感謝單位 -->
    <template v-if="tm('sponsor').available">
      <div class="lg:flex justify-end hidden">
        <MoleculeSectionNav active-nav-name="sponsor" :focus-y="40" />
      </div>
      <section id="sponsor" class="2xl:p-0 p-5">
        <div class="border border-white relative">
          <div class="m-1 border border-white">
            <p class="section-title font-fusion-pixel">{{ tm('sponsor').section_title }}</p>
            <div class="p-10 border border-b-white">
              <!-- 輪播效果 -->
              <div class="relative w-full overflow-hidden">
                <!-- Desktop 輪播 -->
                <div class="hidden lg:block">
                  <div class="marquee-container">
                    <div class="marquee-content marquee-left flex">
                      <!-- 重複多次內容以實現無縫循環 -->
                      <div
                        v-for="(sponsor, index) in duplicatedSponsorList"
                        :key="`desktop-${sponsor.id}-${index}`"
                        class="sponsor-item flex-shrink-0 mr-10 flex items-center justify-center"
                      >
                        <div class="group block">
                          <img
                            :src="runtimeConfig.app.baseURL + sponsor.image_url"
                            alt="sponsor"
                            class="w-auto h-[80px] object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Mobile 輪播 -->
                <div class="lg:hidden block">
                  <!-- 第一排：往右移動 -->
                  <div class="marquee-container mb-4">
                    <div class="marquee-content marquee-right flex">
                      <!-- 重複多次內容以實現無縫循環 -->
                      <div
                        v-for="(sponsor, index) in duplicatedSponsorList"
                        :key="`mobile-right-${sponsor.id}-${index}`"
                        class="sponsor-item flex-shrink-0 mr-10 flex items-center justify-center"
                      >
                        <div class="group block">
                          <img
                            :src="runtimeConfig.app.baseURL + sponsor.image_url"
                            alt="sponsor"
                            class="w-auto h-[60px] object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 第二排：往左移動 -->
                  <div class="marquee-container">
                    <div class="marquee-content marquee-left flex">
                      <!-- 重複多次內容以實現無縫循環 -->
                      <div
                        v-for="(sponsor, index) in duplicatedSponsorList"
                        :key="`mobile-left-${sponsor.id}-${index}`"
                        class="sponsor-item flex-shrink-0 mr-10 flex items-center justify-center"
                      >
                        <div class="group block">
                          <img
                            :src="runtimeConfig.app.baseURL + sponsor.image_url"
                            alt="sponsor"
                            class="w-auto h-[60px] object-contain"
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
    <OrganismWinningTeamDialog
      :is-open="activeDialog === 'winningTeam'"
      :active-winning-team="activeWinningTeam"
      @close="
        activeWinningTeam = null;
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
    @apply left-6 top-[33%];
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
  height: 120px; /* Desktop 高度 */
  overflow: hidden;
  position: relative;

  @media (max-width: 1024px) {
    height: 80px; /* Mobile 單排高度，因為有兩排 */
  }

  .marquee-content {
    display: flex;
    animation-play-state: running;
    width: max-content; /* 讓內容自然展開 */

    img {
      max-width: none; /* 移除寬度限制 */
      height: 100%; /* 讓圖片填滿容器高度 */
      object-fit: contain; /* 保持比例 */
    }
  }

  .marquee-content.marquee-left {
    animation: marquee-left 40s linear infinite;
  }

  .marquee-content.marquee-right {
    animation: marquee-right 40s linear infinite;
  }

  &:hover .marquee-content {
    animation-play-state: paused;
  }
}

/* 向左滑動 - 無限輪播 */
@keyframes marquee-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%); /* 只移動一半，因為內容已經重複了 */
  }
}

/* 向右滑動 - 無限輪播 */
@keyframes marquee-right {
  0% {
    transform: translateX(-50%); /* 從一半開始 */
  }
  100% {
    transform: translateX(0);
  }
}

/* 贊助項目樣式 */
.sponsor-item {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
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

/* 下拉選單箭頭樣式 */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 8.825L1.175 4 2.238 2.938 6 6.7l3.763-3.762L10.825 4z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 24px;
}
</style>