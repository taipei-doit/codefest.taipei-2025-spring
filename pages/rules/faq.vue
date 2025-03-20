<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';

const { tm } = useI18n();

/** 重要時程 */
const faqList = computed(() => {
  const data = tm('faq.list');
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});
</script>

<template>
  <div>
    <div class="lg:block hidden p-10">
      <p class="font-fusion-pixel text-white text-center">
        {{ tm('faq.section_title') }}
      </p>
    </div>

    <template v-for="(item, index) in faqList" :key="index">
      <Disclosure v-slot="{ open }" :default-open="index === 0">
        <DisclosureButton
          class="w-full h-16 flex items-center justify-between py-3 lg:px-10 px-3 border border-t-white border-b-white lg:last:mb-40"
          :class="{ 'bg-primary-50': open }"
        >
          <p
            class="text-left text-lg font-fusion-pixel"
            :class="open ? 'text-primary-500' : 'text-white'"
          >
            {{ item.title }}
          </p>
          <img
            v-if="open"
            src="@/assets/images/icons/primary-minus.svg"
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
          <div
            class="relative w-full py-4 lg:px-10 px-3 font-fusion-pixel border-b border-white bg-primary-300"
          >
            {{ item.content }}
          </div>
        </DisclosurePanel>
      </Disclosure>
    </template>
  </div>
</template>
