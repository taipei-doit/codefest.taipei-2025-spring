<script setup lang="ts">
const { tm } = useI18n();

/** 規則概要 - 內容 */
const prospectusContents = computed(() => {
  const data = tm('rules.prospectus.contents');
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});
</script>

<template>
  <div>
    <div class="lg:p-10 p-4 border-b border-white">
      <div class="relative lg:mb-0 mb-12">
        <!-- desktop 背景圖 -->
        <img
          src="@/assets/images/img-rules-bg.png"
          class="lg:w-2/3 w-[95%] lg:block hidden"
          alt="背景圖"
        />
        <!-- desktop image -->
        <img
          src="@/assets/images/img-rules.jpg"
          class="absolute top-[12%] left-[12%] right-0 lg:block hidden"
          :style="{ width: 'calc(100% - 12%)' }"
          alt="程式儀表板大黑克松宣傳圖"
        />
        <!-- mobile 背景圖 -->
        <img
          src="@/assets/images/img-rules-bg-mobile.png"
          class="lg:w-2/3 w-[95%] lg:hidden block"
          alt="背景圖"
        />
        <!-- mobile image -->
        <img
          src="@/assets/images/img-rules-mobile.jpg"
          class="absolute top-[10%] left-[16%] lg:hidden block"
          :style="{ width: 'calc(100% - 16%)' }"
          alt="程式儀表板大黑克松宣傳圖"
        />
      </div>
    </div>
    <div class="lg:p-10 p-4 border-b border-white bg-primary-300">
      <div class="text-white leading-loose mb-6">
        <p class="text-xl text-center mb-4">
          {{ tm('rules.content_title') }}
        </p>
        <p class="whitespace-pre-wrap">
          {{ tm('rules.content') }}
        </p>
      </div>
      <div class="w-full lg:w-auto flex flex-nowrap justify-center lg:justify-end space-x-8">
        <button class="icon-btn icon-btn--download w-1/2 lg:w-auto lg:min-w-60">
          <span> 下載規則 </span>
        </button>
        <!-- <button class="icon-btn icon-btn--arrow w-1/2 lg:w-auto lg:min-w-60">
          <span> 查看詳情 </span>
        </button> -->
      </div>
    </div>
    <div class="lg:p-10 p-4 border-b border-white">
      <p class="text-2xl text-center mb-8">
        {{ tm('rules.prospectus.title') }}
      </p>
      <div v-for="(content, index) in prospectusContents" :key="index" class="mb-8">
        <p>{{ content.sub_title }}</p>
        <p class="whitespace-pre-wrap">{{ content.sub_content }}</p>
      </div>
      <div class="overflow-x-auto">
        <img
          :src="tm('rules.prospectus.image_url')"
          class="w-[800px] lg:w-full max-w-none"
          alt=""
        />
      </div>
      <p class="lg:!hidden p-4 text-center scroll-arrow">向右滑看更多資訊</p>
    </div>
  </div>
</template>
