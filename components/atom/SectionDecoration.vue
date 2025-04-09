<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    direction?: 'left' | 'right';
  }>(),
  {
    direction: 'left',
  }
);

const currentImage = ref(0); // 0 or 1

const toggleImage = () => {
  currentImage.value = (currentImage.value + 1) % 2;
};

let intervalId: ReturnType<typeof setInterval>;

onMounted(() => {
  intervalId = setInterval(toggleImage, 1000); // 每秒切換一次
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div
    class="p-4 overflow-hidden flex"
    :class="props.direction === 'right' ? 'justify-end' : 'justify-start'"
  >
    <!-- desktop -->
    <img
      v-show="currentImage === 0"
      src="/images/section-decoration.svg"
      class="lg:block hidden w-[750px]"
      :class="props.direction === 'right' ? 'transform scale-x-[-1]' : ''"
      alt=""
    />
    <img
      v-show="currentImage === 1"
      src="/images/section-decoration-2.svg"
      class="lg:block hidden w-[750px]"
      :class="props.direction === 'right' ? 'transform scale-x-[-1]' : ''"
      alt=""
    />
    <!-- mobile -->
    <img
      v-show="currentImage === 0"
      src="/images/section-decoration-mobile.svg"
      class="lg:hidden block"
      :class="props.direction === 'right' ? 'transform scale-x-[-1]' : ''"
      alt=""
    />
    <img
      v-show="currentImage === 1"
      src="/images/section-decoration-mobile-2.svg"
      class="lg:hidden block"
      :class="props.direction === 'right' ? 'transform scale-x-[-1]' : ''"
      alt=""
    />
  </div>
</template>
