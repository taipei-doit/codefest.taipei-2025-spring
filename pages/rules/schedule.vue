<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';

const { tm } = useI18n();

const dialogStore = useDialogStore();

/** 重要時程 */
const scheduleList = computed(() => {
  const data = tm('schedule.list');
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});
</script>

<template>
  <div>
    <Disclosure
      v-for="(tab, index) in scheduleList"
      :key="index"
      v-slot="{ open }"
      :default-open="index === 2"
    >
      <DisclosureButton
        v-kb-focus="{
          id: `rules-disclosure-2-${index + 30}`,
          x: 2,
          y: index + 30,
        }"
        class="w-full flex items-center justify-between p-6 border border-t-white border-b-white focus-border-item"
        :class="{ 'bg-primary-50 lg:bg-primary-500': open }"
      >
        <p
          class="text-center mx-auto"
          :class="open ? 'text-primary-500 lg:text-white' : 'text-white'"
        >
          {{ tab.schedule_name }}
        </p>
        <img
          src="@/assets/images/icons/white-down-arrow.svg"
          alt="arrow"
          width="20"
          class="absolute right-5 transition-transform duration-300"
          :class="{ 'rotate-180': open }"
        />
      </DisclosureButton>
      <DisclosurePanel class="bg-primary-300">
        <!-- 右側內容區 -->
        <div class="flex-1 text-white">
          <div
            class="text-center p-4 border border-b-white flex lg:flex-row flex-col items-center justify-between"
          >
            <p class="text-xl mb-2 whitespace-pre-wrap">
              {{ tab.schedule_sub_name }}
            </p>
            <!-- 按鈕（根據類型顯示）-->
            <template v-if="tab.button?.text">
              <AtomButton
                class="min-w-60"
                :href="tab.button.type === 'outside_link' ? tab.button.link : undefined"
                :to="tab.button.type === 'route' ? tab.button.link : undefined"
                @click="
                  () => {
                    if (tab.button.type === 'dialog') {
                      dialogStore.openDialog(tab.button.link);
                    }
                  }
                "
              >
                {{ tab.button.text }}
              </AtomButton>
            </template>
          </div>
          <div class="p-4 w-full overflow-auto">
            <table
              v-show="tab.id === 'online' || tab.id === 'workshop' || tab.id === 'competition'"
              class="w-full min-w-max border-collapse text-white"
            >
              <thead>
                <tr class="border-white custom-dashed text-left">
                  <th
                    v-for="(header, subIndex) in tab.schedule_headers"
                    :key="subIndex"
                    class="p-2"
                  >
                    {{ header.name }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, subIndex) in tab.schedule" :key="subIndex">
                  <td class="p-2 whitespace-pre-wrap">{{ item.col1 }}</td>
                  <td class="p-2 whitespace-pre-wrap">{{ item.col2 }}</td>
                  <td class="p-2 whitespace-pre-wrap">{{ item.col3 }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="lg:!hidden custom-dashed dashed-top p-4 text-center scroll-arrow">
            向右滑看更多資訊
          </p>
        </div>
      </DisclosurePanel>
    </Disclosure>
  </div>
</template>
