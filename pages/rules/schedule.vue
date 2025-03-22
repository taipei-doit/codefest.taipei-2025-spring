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
      :default-open="index === 0"
    >
      <DisclosureButton
        class="w-full flex items-center justify-between p-6 border border-t-white border-b-white"
        :class="{ 'bg-primary-50 lg:bg-primary-500': open }"
      >
        <p
          class="text-center font-fusion-pixel mx-auto"
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
        <div class="flex-1 font-fusion-pixel font-px437 text-white">
          <div
            class="text-center p-4 border border-b-white flex lg:flex-row flex-col items-center justify-between"
          >
            <p class="text-xl font-fusion-pixel mb-2">
              {{ tab.schedule_sub_name }}
            </p>
            <!-- 按鈕（根據類型顯示）-->
            <template v-if="tab.button?.text">
              <!-- 外部連結 -->
              <a
                v-if="tab.button.type === 'outside_link'"
                :href="tab.button.link"
                target="_blank"
                rel="noopener noreferrer"
                class="icon-btn icon-btn--arrow min-w-60"
              >
                <span>{{ tab.button.text }}</span>
              </a>

              <!-- Nuxt 內部跳轉 -->
              <NuxtLink
                v-else-if="tab.button.type === 'route'"
                :to="tab.button.link"
                class="icon-btn icon-btn--arrow min-w-60"
              >
                <span>{{ tab.button.text }}</span>
              </NuxtLink>

              <!-- 開啟 Dialog -->
              <button
                v-else-if="tab.button.type === 'dialog'"
                @click="dialogStore.openDialog(tab.button.link)"
                class="icon-btn icon-btn--arrow min-w-60"
              >
                <span>{{ tab.button.text }}</span>
              </button>
            </template>
          </div>
          <div class="p-4 w-full overflow-auto">
            <div v-show="tab.id === 'apply'">報名期間</div>
            <div v-show="tab.id === 'online'">線上說明會</div>
            <table
              v-show="tab.id === 'workshop'"
              class="w-full min-w-max border-collapse text-white font-fusion-pixel"
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
                  <td class="p-2">{{ item.time }}</td>
                  <td class="p-2">{{ item.name }}</td>
                  <td class="p-2">{{ item.presenter }}</td>
                </tr>
              </tbody>
            </table>
            <div v-show="tab.id === 'competition'">競賽日</div>
          </div>
          <p class="lg:!hidden custom-dashed dashed-top p-4 text-center scroll-arrow">
            向右滑看更多資訊
          </p>
        </div>
      </DisclosurePanel>
    </Disclosure>
  </div>
</template>
