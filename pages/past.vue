<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import WinningTeamDialog from "~/components/WinningTeamDialog.vue";
import type { PastVideo, PastWinningTeam } from "~/interfaces/past.interface";

const { tm } = useI18n();

/** 獲獎團隊 */
const winningTeamList = computed<PastWinningTeam[]>(() => {
  const data = tm("past.winning_teams.list");
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});
/** 選中的獲獎團隊 */
const activeWinningTeam = ref<PastWinningTeam | null>(null);

/** 影音回顧 */
const videoList = computed<PastVideo[]>(() => {
  const data = tm("past.videos.list");
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});

/** 獲獎團隊 Dialog 是否開啟 */
const isWinningTeamDialogOpen = ref(false);
</script>

<template>
  <div>
    <section class="p-5 pt-10">
      <div class="border border-white relative">
        <div class="m-1 border border-white">
          <p class="section-title font-fusion-pixel">
            {{ tm("past.section_title") }}
          </p>
          <div
            class="lg:flex block justify-center items-center font-fusion-pixel text-white lg:p-10 px-2 py-6 text-center border border-b-white"
          >
            <p class="text-2xl">{{ tm("past.description") }}</p>
          </div>
          <!-- 獲獎團隊 -->
          <Disclosure v-slot="{ open }" :default-open="true">
            <DisclosureButton
              class="w-full h-16 flex items-center justify-between p-2 border border-t-white border-b-white bg-primary-300"
            >
              <p
                class="text-white text-lg text-center font-fusion-pixel mx-auto"
              >
                {{ tm("past.winning_teams.title") }}
              </p>
              <img
                src="@/assets/images/icons/white-down-arrow.svg"
                alt="arrow"
                width="20"
                class="absolute right-5 transition-transform duration-300"
                :class="{ 'rotate-180': open }"
              />
            </DisclosureButton>
            <DisclosurePanel class="lg:p-12 p-6">
              <div class="grid lg:grid-cols-3 grid-cols-1 gap-8">
                <div v-for="(group, index) in winningTeamList" :key="index">
                  <div :key="group.id">
                    <a
                      href="javascript:void(0)"
                      @click="
                        activeWinningTeam = group;
                        isWinningTeamDialogOpen = true;
                      "
                    >
                      <div class="video-box relative">
                        <img
                          :src="group.thumbnail"
                          class="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                          alt=""
                        />
                      </div>
                      <div
                        class="lg:blck flex items-center mt-2 lg:text-lg text-base text-white font-fusion-pixel"
                      >
                        <p>{{ group.ranking }}</p>
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
            </DisclosurePanel>
          </Disclosure>
          <!-- 影音回顧 -->
          <Disclosure v-slot="{ open }" :default-open="true">
            <DisclosureButton
              class="w-full h-16 flex items-center justify-between p-2 border border-t-white border-b-white bg-primary-300"
            >
              <p
                class="text-white text-lg text-center font-fusion-pixel mx-auto"
              >
                {{ tm("past.videos.title") }}
              </p>
              <img
                src="@/assets/images/icons/white-down-arrow.svg"
                alt="arrow"
                width="20"
                class="absolute right-5 transition-transform duration-300"
                :class="{ 'rotate-180': open }"
              />
            </DisclosureButton>
            <DisclosurePanel class="lg:p-12 p-6">
              <div class="grid lg:grid-cols-3 grid-cols-1 gap-8">
                <div v-for="(group, index) in videoList" :key="index">
                  <div :key="group.id">
                    <a :href="group.video_url" target="_blank">
                      <div class="video-box relative">
                        <img
                          :src="group.thumbnail"
                          class="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                          alt=""
                        />
                        <!-- 播放按鈕 -->
                        <div
                          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        >
                          <img
                            src="@/assets/images/icons/play.png"
                            width="40"
                            alt="play_btn"
                          />
                        </div>
                      </div>
                      <div
                        class="flex justify-between items-center mt-2 lg:text-lg text-base text-white"
                      >
                        <span class="font-fusion-pixel">{{ group.title }}</span>
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
            </DisclosurePanel>
          </Disclosure>
        </div>
      </div>
    </section>

    <WinningTeamDialog
      :is-open="isWinningTeamDialogOpen"
      :active-winning-team="activeWinningTeam"
      @close="
        activeWinningTeam = null;
        isWinningTeamDialogOpen = false;
      "
    />
  </div>
</template>

<style scoped lang="postcss"></style>
