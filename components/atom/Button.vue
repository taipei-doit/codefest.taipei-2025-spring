<script setup lang="ts">
import { NuxtLink } from '#components';

const props = defineProps<{
  // 按鈕 icon
  iconType?: 'arrow' | 'download'; // 預設箭頭
  // NuxtLink
  to?: string | Record<string, any>;
  // button
  type?: 'button' | 'submit' | 'reset';
  // a
  href?: string;
  target?: string;
  rel?: string;
}>();

const tag = computed(() => {
  if (props.href) return 'a';
  if (props.to) return NuxtLink;
  return 'button';
});
</script>

<template>
  <component
    :is="tag"
    v-bind="{
      to,
      href,
      target: target || (href ? '_blank' : undefined),
      rel: rel || (href ? 'noopener noreferrer' : undefined),
      type: !to && !href ? type || 'button' : undefined,
    }"
    class="icon-btn font-fusion-pixel"
    :class="[iconType ? `icon-btn--${iconType}` : 'icon-btn--arrow']"
  >
    <span>
      <slot />
    </span>
  </component>
</template>

<style lang="postcss">
.icon-btn {
  @apply relative;
  @apply border border-white max-w-full;
  &::after {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    display: block;
    width: 24px;
    height: 24px;
  }
  &--arrow::after {
    content: url('/assets/images/icons/primary-right-arrow.svg');
  }

  &--download::after {
    content: url('/assets/images/icons/primary-download.svg');
  }

  span {
    @apply flex items-center justify-center h-[63px];
    @apply m-1 py-2 bg-white text-primary-500;
  }

  @media (max-width: 1024px) {
    &::after {
      right: 12px;
    }
  }
}
</style>
