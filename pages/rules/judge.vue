<script setup lang="ts">
const { tm } = useI18n();

/** 重要時程 */
const scheduleList = computed(() => {
  const data = tm("schedule.list");
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});
</script>

<template>
  <div>

  </div>
</template>

<style scoped lang="postcss"></style>
