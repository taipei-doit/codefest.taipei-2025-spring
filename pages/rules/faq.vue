<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
const { tm } = useI18n();

/** FAQ */
const faqList = computed(() => {
  const data = tm('faq.list');
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});

const activeTab = ref(0);
</script>

<template>
  <div>
    <div class="lg:block hidden p-10">
      <p class="font-fusion-pixel text-2xl text-white text-center">
        {{ tm('faq.section_title') }}
      </p>
    </div>

    <div class="flex">
      <div
        v-for="(item, index) in faqList"
        :key="index"
        v-kb-focus="{
          id: `rules-faq-${index + 2}-50`,
          x: index + 2,
          y: 50,
        }"
        class="w-1/2 cursor-pointer transition-colors text-center p-5 border border-white"
        :class="
          activeTab === index
            ? 'bg-primary-50 text-primary-500 font-bold'
            : 'bg-primary-500 text-white'
        "
        @click="activeTab = index"
      >
        {{ item.type }}
      </div>
    </div>

    <template v-for="(item, index) in faqList[activeTab]?.list" :key="`${activeTab}-${index}`">
      <Disclosure v-slot="{ open }" :default-open="index === 0">
        <DisclosureButton
          v-kb-focus="{
            id: `rules-faq-${activeTab + 2}-${index + 51}`,
            x: activeTab + 2,
            y: index + 51,
          }"
          class="w-full min-h-16 flex items-center justify-between lg:px-10 p-3 pr-8 border border-t-white border-b-white lg:last:mb-40"
          :class="{ 'bg-primary-300': open }"
        >
          <p class="text-left text-lg text-white">{{ index + 1 }}. {{ item.title }}</p>
          <img
            v-if="open"
            src="@/assets/images/icons/white-minus.svg"
            alt="plus"
            class="absolute right-5 lg:w-[40px] w-[20px]"
          />
          <img
            v-else
            src="@/assets/images/icons/white-plus.svg"
            alt="minus"
            width="40"
            class="absolute right-5 lg:w-[40px] w-[20px]"
          />
        </DisclosureButton>
        <DisclosurePanel>
          <div class="relative w-full py-4 lg:px-10 px-3 border-b border-white bg-primary-300">
            <AtomSaveHtml :html="item.content" />
          </div>
        </DisclosurePanel>
      </Disclosure>
    </template>
  </div>
</template>
