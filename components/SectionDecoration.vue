<script setup lang="ts">
import { withDefaults, defineProps } from 'vue';

const props = withDefaults(
  defineProps<{
    direction?: 'left' | 'right';
  }>(),
  {
    direction: 'left',
  }
);
</script>

<template>
  <div
    class="p-4 overflow-hidden flex"
    :class="props.direction === 'right' ? 'justify-end' : 'justify-start'"
  >
    <!-- desktop -->
    <img
      src="/images/section-decoration.svg"
      class="lg:block hidden w-[750px]"
      :class="props.direction === 'right' ? 'transform scale-x-[-1]' : ''"
      alt=""
    />
    <!-- mobile -->
    <img
      src="/images/section-decoration-mobile.svg"
      class="lg:hidden block"
      :class="props.direction === 'right' ? 'transform scale-x-[-1]' : ''"
      alt=""
    />
  </div>
</template>

<style scoped lang="postcss"></style>
