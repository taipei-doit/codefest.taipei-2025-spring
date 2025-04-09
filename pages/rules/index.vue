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
        <AtomButton
          v-kb-focus="{
            id: `rules-button-2-20`,
            x: 2,
            y: 20,
          }"
          href="https://firebasestorage.googleapis.com/v0/b/tuic-taipei-hackathon.firebasestorage.app/o/2025%E9%9B%99%E5%8C%97%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%88%E7%AF%80%E5%9F%8E%E5%B8%82%E5%84%80%E8%A1%A8%E6%9D%BF%E5%A4%A7%E9%BB%91%E5%AE%A2%E6%9D%BE_%E7%AB%B6%E8%B3%BD%E8%A6%8F%E5%89%87.pdf?alt=media&token=b798ca4f-fa39-4a63-8fdd-72edc6b8a8b6"
          class="w-1/2 lg:w-auto lg:min-w-60"
          :icon-type="'download'"
        >
          下載規則
        </AtomButton>
      </div>
    </div>
    <div class="lg:p-10 p-4 border-b border-white">
      <p class="text-2xl text-center mb-8">
        {{ tm('rules.prospectus.title') }}
      </p>
      <div v-for="(content, index) in prospectusContents" :key="index" class="mb-8">
        <p>{{ content.sub_title }}</p>
        <p class="whitespace-pre-wrap">
          <AtomSaveHtml :html="content.sub_content" />
        </p>
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
