<script setup lang="ts">
import { useDialogStore } from '~/stores/dialogStore';

const dialogStore = useDialogStore();
const { activeDialog } = storeToRefs(dialogStore);
</script>

<template>
  <header class="bg-black p-5 pb-0">
    <div class="container mx-auto border border-white h-full flex flex-col">
      <div class="m-1 border border-white flex-1 flex justify-between items-center lg:px-10">
        <NuxtLink
          v-kb-focus="{ id: 'header-logo-1-1', x: 1, y: 1 }"
          to="/"
          class="px-4 flex space-x-2"
          tabindex="0"
        >
          <img src="/images/logos/logo-icon-ntpc.svg" class="lg:w-[40px] w-[30px]" alt="" />
          <img src="/images/logos/logo-icon-tpe.svg" class="lg:w-[40px] w-[30px]" alt="" />
        </NuxtLink>
        <!-- web -->
        <OrganismLayoutNavbar
          class="hidden lg:block"
          type="header"
          nav-class="flex text-white font-fusion-pixel"
        />
        <!-- mobile hamburger -->
        <button
          type="button"
          class="lg:hidden z-30 px-4 py-2"
          @click="dialogStore.openDialog('mobileMenu')"
        >
          <img src="@/assets/images/icons/menu.png" width="24" alt="" />
        </button>
      </div>
      <!-- moblie nav modal -->
      <Transition name="fade">
        <div v-if="activeDialog === 'mobileMenu'" class="modal-open">
          <div
            class="fixed top-0 bottom-0 left-0 right-0 z-50 w-full overflow-y-auto bg-black bg-opacity-80 flex flex-col p-4 transition-all duration-500"
          >
            <div class="border border-white flex-1 flex flex-col">
              <div class="flex-1 m-1 border border-white py-10 text-center">
                <NuxtLink
                  to="/"
                  class="inline-flex p-8 space-x-2"
                  @click="dialogStore.closeDialog()"
                >
                  <img src="/images/logos/logo-icon-ntpc.svg" width="40" alt="" />
                  <img src="/images/logos/logo-icon-tpe.svg" width="40" alt="" />
                </NuxtLink>
                <OrganismLayoutNavbar
                  type="mobile-header"
                  nav-class="text-white font-fusion-pixel text-center"
                />
                <button type="button" class="p-8" @click="dialogStore.closeDialog()">
                  <img src="@/assets/images/icons/close.png" width="24" alt="" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<style scoped lang="postcss">
/* 淡入淡出動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
