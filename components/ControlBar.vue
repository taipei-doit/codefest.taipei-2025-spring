<script setup lang="ts">
import { useDialogStore } from '~/stores/dialogStore';

const props = defineProps<{
  isAboveFooter: boolean;
}>();

const dialogStore = useDialogStore();

const route = useRoute();

// 只有在競賽規則頁時顯示報名按鈕
const showApplyBtn = computed(() => route.path.startsWith(ROUTE_PATHS.RULES));
</script>

<template>
  <div
    class="controlbar container mx-auto flex 2xl:px-0 p-5 border-t border-b border-white lg:border-none bg-primary-300 lg:bg-primary-500 z-40 lg:space-x-2"
    :class="[
      props.isAboveFooter ? '' : 'fixed bottom-0 left-0 right-0',
      showApplyBtn ? '' : 'lg:block hidden',
    ]"
  >
    <div class="lg:block hidden border border-white bg-primary-500 w-full">
      <div class="m-1 flex border border-white h-[96px]">
        <div class="container mx-auto p-3 text-xl flex justify-between items-center">
          <div class="flex">
            <p class="text-white font-fusion-pixel mr-10">⭠⭡⭢⭣：Select Item</p>
            <p class="text-white font-fusion-pixel mr-10">Enter：Open Link</p>
            <p class="text-white font-fusion-pixel">F1：Open Scanlines</p>
          </div>
          <p class="text-white font-fusion-pixel">⌫：Back</p>
        </div>
      </div>
    </div>
    <button
      v-if="showApplyBtn"
      v-kb-focus="{
        id: `rules-apply-1-60`,
        x: 1,
        y: 60,
      }"
      class="icon-btn icon-btn--arrow w-auto min-w-60 mx-auto"
      @click="dialogStore.openDialog('apply')"
      @keydown.enter.prevent="dialogStore.openDialog('apply')"
    >
      <span> 立即報名 </span>
    </button>
  </div>
</template>

<style scoped lang="postcss">
@media (min-width: 1024px) {
  .icon-btn {
    min-width: 263px;
    span {
      height: 96px;
    }
  }
}
</style>
