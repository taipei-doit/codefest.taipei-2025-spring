<script setup lang="ts">
defineProps<{
  /** 欲渲染的原始 HTML 字串 */
  html: string;
}>();
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <!-- 使用全域 $sanitize 確保渲染的 HTML 安全，防範 XSS 攻擊 -->
  <div v-html="$sanitize(html)"></div>
</template>