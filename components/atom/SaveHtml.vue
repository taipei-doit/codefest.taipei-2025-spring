<script setup lang="ts">
const props = defineProps<{
  html: string;
}>();
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <div v-html="$sanitize(html)"></div>
</template>
