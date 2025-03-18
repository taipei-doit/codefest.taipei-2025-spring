<script setup lang="ts">
const props = defineProps<{
  isAboveFooter: boolean;
}>();
</script>

<template>
  <div
    class="lg:block hidden border border-white bg-primary-500 z-10 m-5"
    :class="isAboveFooter ? '' : 'fixed bottom-0 left-0 right-0'"
  >
    <div class="m-1 flex flex-1 border border-white">
      <div
        class="container mx-auto p-3 text-xl flex justify-between items-center"
      >
        <div class="flex">
          <p class="text-white font-fusion-pixel mr-10">⭠⭡⭢⭣：Select Item</p>
          <p class="text-white font-fusion-pixel mr-10">Enter：Open Link</p>
          <p class="text-white font-fusion-pixel">F1：Open Scanlines</p>
        </div>
        <p class="text-white font-fusion-pixel">⌫：Back</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
