<script setup lang="ts">
const props = defineProps<{
  activeNavName: string;
  focusY: number; // 第幾個 section（從 1 開始）
}>();
const runtimeConfig = useRuntimeConfig();
const { tm } = useI18n();

const sectionNav = ref([
  {
    name: 'rules',
    zhName: '競賽規則',
    icon_url: `${runtimeConfig.app.baseURL}images/icons/icon-rules.svg`,
    is_selected: false,
    available: tm('rules').available,
  },
  {
    name: 'schedule',
    zhName: '重要時程',
    icon_url: `${runtimeConfig.app.baseURL}images/icons/icon-schedule.svg`,
    is_selected: false,
    available: tm('schedule').available,
  },
  {
    name: 'news',
    zhName: '最新消息',
    icon_url: `${runtimeConfig.app.baseURL}images/icons/icon-news.svg`,
    is_selected: false,
    available: tm('news').available,
  },
  {
    name: 'past',
    zhName: '參賽回顧',
    icon_url: `${runtimeConfig.app.baseURL}images/icons/icon-past.svg`,
    is_selected: false,
    available: tm('past').available,
  },
  {
    name: 'sponsor',
    zhName: '贊助單位',
    icon_url: `${runtimeConfig.app.baseURL}images/icons/icon-sponsor.svg`,
    is_selected: false,
    available: tm('sponsor').available,
  },
]);

const availableItems = computed(() => sectionNav.value.filter(item => item.available));

const updateSelectedNav = (activeName: string) => {
  // **找到選中的項目**
  const selectedIndex = sectionNav.value.findIndex(nav => nav.name === activeName);

  if (selectedIndex !== -1) {
    // **設定 is_selected**
    sectionNav.value.forEach(nav => (nav.is_selected = false));
    sectionNav.value[selectedIndex].is_selected = true;

    // **把選中項目和後面的項目取出，並與前面的項目交換位置**
    sectionNav.value = sectionNav.value
      .slice(selectedIndex)
      .concat(sectionNav.value.slice(0, selectedIndex));
  }
};

const scrollToSection = (id: string) => {
  const target = document.getElementById(id);
  if (target) {
    const offset = 160; // 設定上方留白的高度
    const elementPosition = target.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
};

onMounted(() => {
  updateSelectedNav(props.activeNavName);
});
</script>

<template>
  <div class="flex items-end p-4">
    <span class="text-white font-fusion-pixel text-xl mr-4">{{ props.activeNavName }}</span>
    <template v-for="(item, index) in availableItems" :key="index">
      <div class="flex items-center">
        <a
          v-kb-focus="{
            id: `section-${index + 1}-${focusY}`,
            x: index + 1,
            y: focusY, // 傳進來或 props 傳入：目前是第幾個 section
          }"
          href="javascript:void(0)"
          class="mr-1 transition-all"
          @click="scrollToSection(item.name)"
        >
          <img
            :src="item.icon_url"
            class="transition-transform duration-300"
            :class="{ 'scale-150': item.is_selected }"
            :alt="item.zhName"
          />
        </a>
      </div>
    </template>
  </div>
</template>
