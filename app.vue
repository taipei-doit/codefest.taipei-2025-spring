<script setup lang="ts">
import { useDialogStore } from '~/stores/dialogStore';

const dialogStore = useDialogStore();
const { activeDialog } = storeToRefs(dialogStore);

const footerTop = ref(0);
const scrollY = ref(0);

const isAboveFooter = ref(false);

const updateScroll = () => {
  scrollY.value = window.scrollY; // 取得目前的滾動位置

  const footer = document.getElementById('footer');
  if (footer) {
    footerTop.value = footer.getBoundingClientRect().top + window.scrollY; // 計算 Footer 頂部的 scrollY
  }

  if (scrollY.value + window.innerHeight >= footerTop.value) {
    isAboveFooter.value = true;
  } else if (scrollY.value + window.innerHeight < footerTop.value) {
    isAboveFooter.value = false;
  }
};

onMounted(() => {
  window.addEventListener('scroll', updateScroll);
  updateScroll(); // 初始化
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateScroll);
});
</script>

<template>
  <div class="container mx-auto">
    <LayoutHeader
      id="header"
      class="lg:h-[100px] h-[80px] fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300"
    />
    <NuxtPage class="lg:mt-[100px] mt-[80px]" />
  </div>
  <!-- control bar -->
  <ControlBar :is-above-footer="isAboveFooter" />
  <LayoutFooter id="footer" :class="isAboveFooter ? 'mt-4' : 'mt-[162px]'" />

  <!-- 報名表單 -->
  <ApplyDialog :is-open="activeDialog === 'apply'" @close="dialogStore.closeDialog()" />
</template>

<style lang="postcss">
@import '@/assets/retro-effect.scss';
</style>
