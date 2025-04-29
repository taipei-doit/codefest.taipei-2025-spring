<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import type { PastVideo, PastWinningTeam } from '~/interfaces/past.interface';

const { t, tm } = useI18n();
const dialogStore = useDialogStore();
const { activeDialog } = storeToRefs(dialogStore);
const runtimeConfig = useRuntimeConfig();

/** 獲獎團隊 */
const winningTeamList = computed<PastWinningTeam[]>(() => {
  const data = tm('past.winning_teams.list');
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});
/** 選中的獲獎團隊 */
const activeWinningTeam = ref<PastWinningTeam | null>(null);

/** 影音回顧 */
const videoList = computed<PastVideo[]>(() => {
  const data = tm('past.videos.list');
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});
</script>

<template>
  <div>
    <section class="2xl:px-0 p-5 pt-10">
      <div class="border border-white relative">
        <div class="m-1 border border-white">
          <p class="section-title font-fusion-pixel">
            {{ tm('past.section_title') }}
          </p>
          <div
            class="lg:flex block justify-center items-center font-fusion-pixel text-white lg:p-10 px-2 py-6 text-center border border-b-white"
          >
            <p class="lg:text-2xl text-lg">{{ tm('past.description') }}</p>
          </div>
          <!-- 獲獎團隊 -->
          <Disclosure v-slot="{ open }" :default-open="true">
            <DisclosureButton
              v-kb-focus="{
                id: `past-button-1-2`,
                x: 1,
                y: 2,
              }"
              class="w-full h-16 flex items-center justify-between p-2 border border-t-white border-b-white bg-primary-300"
            >
              <p class="font-fusion-pixel text-white text-lg text-center mx-auto">
                {{ tm('past.winning_teams.title') }}
              </p>
              <img
                src="@/assets/images/icons/white-down-arrow.svg"
                alt="arrow"
                width="20"
                class="absolute right-5 transition-transform duration-300"
                :class="{ 'rotate-180': open }"
              />
            </DisclosureButton>
            <DisclosurePanel>
              <div class="lg:p-12 p-6 border-b border-white">
                <div class="grid lg:grid-cols-3 grid-cols-1 gap-8">
                  <div
                    v-for="(group, index) in winningTeamList"
                    :key="index"
                    v-kb-focus="{
                      id: `past-team-${index + 1}-${index + 3}`,
                      x: index + 1,
                      y: index + 3,
                    }"
                  >
                    <div :key="group.id">
                      <a
                        href="javascript:void(0)"
                        @click="
                          activeWinningTeam = group;
                          dialogStore.openDialog('winningTeam');
                        "
                      >
                        <div class="video-box relative">
                          <img
                            :src="runtimeConfig.app.baseURL + group.thumbnail"
                            class="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                            alt=""
                          />
                        </div>
                        <div
                          class="lg:block flex items-center mt-2 lg:text-lg text-base text-white"
                        >
                          <p class="mr-2 lg:mr-0">{{ group.ranking }}</p>
                          <p class="flex justify-between items-center">
                            <span>{{ group.team_name }}</span>
                            <img
                              src="@/assets/images/icons/white-right-arrow.svg"
                              width="24"
                              class="lg:inline-block hidden"
                              alt="white-right-arrow"
                            />
                          </p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="t('past.winning_teams.more_winning_team_photos_url')"
                class="flex flex-col lg:flex-row justify-between items-center p-4 m-1"
              >
                <!-- 文字區塊 (lg 以上才顯示) -->
                <div class="hidden lg:block flex-1">
                  <p class="font-px437 text-white typing-container mr-2">
                    View More Photos：View →
                  </p>
                </div>

                <!-- 按鈕區塊 -->
                <div
                  class="w-full lg:w-auto flex flex-nowrap justify-center lg:justify-end space-x-8"
                >
                  <AtomButton
                    :href="t('more_winning_team_photos_url')"
                    :icon-type="'arrow'"
                    class="w-1/2 lg:w-auto lg:min-w-60"
                  >
                    更多照片回顧
                  </AtomButton>
                </div>
              </div>
            </DisclosurePanel>
          </Disclosure>
          <!-- 影音回顧 -->
          <Disclosure v-slot="{ open }" :default-open="true">
            <DisclosureButton
              v-kb-focus="{
                id: `past-button-1-30`,
                x: 1,
                y: 30,
              }"
              class="w-full h-16 flex items-center justify-between p-2 border border-t-white border-b-white bg-primary-300"
            >
              <p class="font-fusion-pixel text-white text-lg text-center mx-auto">
                {{ tm('past.videos.title') }}
              </p>
              <img
                src="@/assets/images/icons/white-down-arrow.svg"
                alt="arrow"
                width="20"
                class="absolute right-5 transition-transform duration-300"
                :class="{ 'rotate-180': open }"
              />
            </DisclosureButton>
            <DisclosurePanel>
              <div class="lg:p-12 p-6 border-b border-white">
                <div class="grid lg:grid-cols-3 grid-cols-1 gap-8">
                  <div
                    v-for="(group, index) in videoList"
                    :key="index"
                    v-kb-focus="{
                      id: `past-video-${index + 1}-${index + 31}`,
                      x: index + 1,
                      y: index + 31,
                    }"
                  >
                    <div :key="group.id">
                      <a :href="group.video_url" target="_blank">
                        <div class="video-box relative">
                          <img
                            :src="runtimeConfig.app.baseURL + group.thumbnail"
                            class="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                            alt=""
                          />
                          <!-- 播放按鈕 -->
                          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <img src="@/assets/images/icons/play.png" width="40" alt="play_btn" />
                          </div>
                        </div>
                        <div
                          class="flex justify-between items-center mt-2 lg:text-lg text-base text-white"
                        >
                          <span>{{ group.title }}</span>
                          <span>
                            <img
                              src="@/assets/images/icons/white-right-arrow.svg"
                              width="24"
                              class="lg:inline-block hidden"
                              alt="white-right-arrow"
                            />
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="t('past.videos.more_videos_url')"
                class="flex flex-col lg:flex-row justify-between items-center p-4 m-1"
              >
                <!-- 文字區塊 (lg 以上才顯示) -->
                <div class="hidden lg:block flex-1">
                  <p class="font-px437 text-white typing-container mr-2">
                    View More Videos：View →
                  </p>
                </div>

                <!-- 按鈕區塊 -->
                <div
                  class="w-full lg:w-auto flex flex-nowrap justify-center lg:justify-end space-x-8"
                >
                  <AtomButton
                    :href="t('past.videos.more_videos_url')"
                    :icon-type="'arrow'"
                    class="w-1/2 lg:w-auto lg:min-w-60"
                  >
                    更多影片回顧
                  </AtomButton>
                </div>
              </div>
            </DisclosurePanel>
          </Disclosure>
        </div>
      </div>
    </section>

    <OrganismWinningTeamDialog
      :is-open="activeDialog === 'winningTeam'"
      :active-winning-team="activeWinningTeam"
      @close="
        activeWinningTeam = null;
        dialogStore.closeDialog();
      "
    />
  </div>
</template>
