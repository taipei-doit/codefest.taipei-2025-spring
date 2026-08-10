<script setup lang="ts">
import { useDialogStore } from '~/stores/dialogStore';

const dialogStore = useDialogStore();
const { activeDialog } = storeToRefs(dialogStore);

const footerTop = ref(0);
const scrollY = ref(0);
const isAboveFooter = ref(false);

const updateScroll = () => {
  scrollY.value = window.scrollY;

  const footer = document.getElementById('footer');
  if (footer) {
    footerTop.value = footer.getBoundingClientRect().top + window.scrollY;
  }

  const viewportBottom = scrollY.value + window.innerHeight;
  isAboveFooter.value = viewportBottom >= footerTop.value;
};

onMounted(() => {
  window.addEventListener('scroll', updateScroll);
  updateScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateScroll);
});
</script>

<template>
  <noscript
    ><iframe
      src="https://www.googletagmanager.com/ns.html?id=GTM-MQCC8H3V"
      height="0"
      width="0"
      style="display: none; visibility: hidden"
      title="Google Tag Manager"
    ></iframe
  ></noscript>
  <div class="container mx-auto">
    <OrganismLayoutHeader
      id="header"
      class="lg:h-[100px] h-[80px] fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300"
    />
    <NuxtPage class="lg:mt-[100px] mt-[80px]" />
  </div>
  <OrganismControlBar :is-above-footer="isAboveFooter" />
  <OrganismLayoutFooter id="footer" :class="isAboveFooter ? 'mt-4' : 'mt-[162px]'" />

  <OrganismApplyDialog :is-open="activeDialog === 'apply'" @close="dialogStore.closeDialog()" />
</template>