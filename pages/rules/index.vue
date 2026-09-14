<script setup lang="ts">
const { tm } = useI18n();

interface ProspectusContent {
  sub_title?: string;
  sub_content?: string;
}

/** 規則概要 - 內容 */
const prospectusContents = computed<ProspectusContent[]>(() => {
  const data = tm('rules.prospectus.contents');
  if (!data) return [];
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});
</script>

<template>
  <div>
    <div class=