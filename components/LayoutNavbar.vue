<script setup lang="ts">
const props = defineProps<{
  type: 'header' | 'mobile-header' | 'footer';
  navClass: string;
}>();

// 計算不同類型的 nav-item class
const navItemClass = computed(() => {
  return (
    {
      header: 'header-nav-item',
      'mobile-header': 'mobile-header-nav-item',
      footer: 'footer-nav-item',
    }[props.type] || ''
  );
});
</script>

<template>
  <nav>
    <ul :class="navClass">
      <li :class="navItemClass">
        <NuxtLink :to="ROUTE_PATHS.RULES">參賽規則</NuxtLink>
      </li>
      <li :class="navItemClass">
        <NuxtLink :to="`${ROUTE_PATHS.RULES}${ROUTE_PATHS.SCHEDULE}`">重要時程</NuxtLink>
      </li>
      <li :class="navItemClass">
        <NuxtLink :to="ROUTE_PATHS.PAST">參賽回顧</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="postcss">
.header-nav-item {
  @apply px-4;
}

.footer-nav-item {
  @apply pr-4 py-2;
}

.mobile-header-nav-item {
  @apply p-8 border-b border-b-white last:border-b-0;
}
</style>
