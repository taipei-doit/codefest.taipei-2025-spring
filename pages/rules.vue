<script setup lang="ts">
const { tm } = useI18n();
const route = useRoute();

const tabList = [
  {
    id: "rules",
    name: "參賽規則",
    path: `${ROUTE_PATHS.RULES}`,
  },
  {
    id: "schedule",
    name: "重要時程",
    path: `${ROUTE_PATHS.RULES}${ROUTE_PATHS.SCHEDULE}`,
  },
  {
    id: "judge",
    name: "本屆評審",
    path: `${ROUTE_PATHS.RULES}/judge`,
  },
  {
    id: "faq",
    name: "FAQ",
    path: `${ROUTE_PATHS.RULES}/faq`,
  },
];

const activeTab = computed(
  () => tabList.find((tab) => tab.path === route.path) || tabList[0]
);

const tabItems = ref<HTMLElement[]>([]);

const scrollToTab = (index: number) => {
  const scrollContainer = document.querySelector(".scroll-container"); // 取得 `overflow-x-auto` 的 div

  if (scrollContainer) {
    const scrollLeft =
      index >= 2
        ? scrollContainer.scrollWidth - scrollContainer.clientWidth // 滾動到底部
        : 0; // 回到最左

    scrollContainer.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });
  }
};

onMounted(() => {
  const currentTabIdx = tabList.findIndex(
    (tab) => tab.id === activeTab.value.id
  );
  scrollToTab(currentTabIdx);
});
</script>

<template>
  <div>
    <section class="p-5 pt-10">
      <div class="border border-white relative">
        <div class="m-1 border border-white">
          <p class="section-title font-fusion-pixel">
            {{ tm("rules.section_title") }}
          </p>
          <div
            class="lg:flex block justify-center items-center font-fusion-pixel text-white lg:p-10 p-4 pt-6 text-center border border-b-white"
          >
            <p class="mb-4 lg:mb-0">報名截止倒數</p>
            <CountDown :target-date="new Date(tm('schedule.count_down'))" />
          </div>
          <div class="lg:flex block">
            <!-- desktop 左側 Tabs -->
            <div class="lg:block hidden p-4 border-r border-white">
              <div class="flex">
                <div class="relative flex flex-col">
                  <NuxtLink
                    v-for="(tab, index) in tabList"
                    :key="tab.id"
                    :to="tab.path"
                    class="tab-item relative min-w-[220px] w-full p-6 border border-white text-xl text-center cursor-pointer font-fusion-pixel mb-4"
                    :class="
                      activeTab?.id === tab.id
                        ? 'bg-primary-50 text-primary-500 border-0 shadow-[4px_4px_0px_black]'
                        : 'text-white'
                    "
                  >
                    {{ tab.name }}
                  </NuxtLink>
                </div>
              </div>
            </div>
            <!-- Mobile 上方 Tabs -->
            <div
              class="scroll-container lg:hidden border-b border-white py-4 px-12 w-[95%] overflow-x-auto test"
            >
              <nav class="flex space-x-3" aria-label="Tabs">
                <NuxtLink
                  v-for="(tab, index) in tabList"
                  :key="tab.id"
                  :to="tab.path"
                  ref="tabItems"
                  class="mobile-tab-item"
                  :class="[
                    activeTab?.id === tab.id
                      ? 'border-b-2 border-white'
                      : 'border-none',
                    'whitespace-nowrap text-white font-fusion-pixel px-4 py-2 text-lg',
                  ]"
                  :aria-current="activeTab?.id === tab.id ? 'page' : undefined"
                  @click="scrollToTab(index)"
                >
                  {{ tab.name }}
                </NuxtLink>
              </nav>
            </div>

            <!-- 右側內容區 -->
            <div class="flex-1">
              <div class="flex-1 font-fusion-pixel font-px437 text-white">
                <div class="w-full overflow-auto">
                  <NuxtPage />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="postcss"></style>
