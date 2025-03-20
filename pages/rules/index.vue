<script setup lang="ts">
const { tm } = useI18n();

/** 簡章概要 - 內容 */
const prospectusContents = computed(() => {
  const data = tm('rules.prospectus.contents');
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});
</script>

<template>
  <div>
    <div class="lg:p-10 p-4 border-b border-white">
      <img src="@/assets/images/img-rules.png" class="w-full lg:block hidden" alt="" />
      <img src="@/assets/images/img-rules-mobile.png" class="w-full lg:hidden block" alt="" />
    </div>
    <div class="lg:p-10 p-4 border-b border-white bg-primary-300">
      <div class="font-fusion-pixel text-white leading-loose mb-6">
        <p class="text-xl text-center mb-4">
          {{ tm('rules.content_title') }}
        </p>
        <p class="whitespace-pre-wrap">
          {{ tm('rules.content') }}
        </p>
      </div>
      <div class="w-full lg:w-auto flex flex-nowrap justify-center lg:justify-end space-x-8">
        <button class="icon-btn icon-btn--download w-1/2 lg:w-auto lg:min-w-60">
          <span> 下載簡章 </span>
        </button>
        <button class="icon-btn icon-btn--arrow w-1/2 lg:w-auto lg:min-w-60">
          <span> 查看詳情 </span>
        </button>
      </div>
    </div>
    <div class="lg:p-10 p-4 border-b border-white font-fusion-pixel">
      <p class="text-2xl text-center mb-8">
        {{ tm('rules.prospectus.title') }}
      </p>
      <div v-for="(content, index) in prospectusContents" :key="index" class="mb-8">
        <p>{{ content.sub_title }}</p>
        <p>{{ content.sub_content }}</p>
      </div>
      <div class="overflow-x-auto">
        <img :src="tm('rules.prospectus.image_url')" class="max-w-[800px]" alt="" />
      </div>
      <p class="lg:!hidden p-4 text-center scroll-arrow">向右滑看更多資訊</p>
    </div>
  </div>
</template>
