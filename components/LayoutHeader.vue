<script setup lang="ts">
import { ref } from 'vue';
import { useModalStore } from '@/stores/modalStore';

const modalStore = useModalStore();

const mobileMenuOpen = ref(false);

function openNav() {
  mobileMenuOpen.value = true;
  modalStore.isModalOpen = true;
}

function closeNav() {
  mobileMenuOpen.value = false;
  modalStore.isModalOpen = false;
}
</script>

<template>
  <header class="bg-black p-5 pb-0">
    <div class="border border-white h-full flex flex-col">
      <div class="m-1 border border-white flex-1 flex justify-between items-center lg:px-10">
        <NuxtLink to="/" class="px-4 flex">
          <img src="@/assets/images/logos/logo-icon-tpe.svg" alt="" />
          <img src="@/assets/images/logos/logo-icon-ntpc.svg" alt="" />
        </NuxtLink>
        <!-- web -->
        <LayoutNavbar
          class="hidden lg:block"
          type="header"
          nav-class="flex text-white font-fusion-pixel"
        />
        <!-- mobile hamburger -->
        <button type="button" class="lg:hidden z-30 px-4 py-2" @click="openNav">
          <img src="@/assets/images/icons/menu.png" width="24" alt="" />
        </button>
        <!-- moblie nav modal -->
        <Transition name="fade">
          <div v-if="mobileMenuOpen" class="modal-open">
            <div
              class="fixed top-0 bottom-0 left-0 right-0 z-30 w-full overflow-y-auto bg-black bg-opacity-80 flex flex-col p-4 transition-all duration-500"
            >
              <div class="border border-white flex-1 flex flex-col">
                <div class="flex-1 m-1 border border-white py-10 text-center">
                  <a href="" class="inline-flex p-8">
                    <img src="@/assets/images/logos/logo-icon-tpe.svg" alt="" />
                    <img src="@/assets/images/logos/logo-icon-ntpc.svg" alt="" />
                    />
                  </a>
                  <LayoutNavbar
                    type="mobile-header"
                    nav-class="text-white font-fusion-pixel text-center"
                  />
                  <button type="button" class="p-8" @click="closeNav">
                    <img src="@/assets/images/icons/close.png" width="24" alt="" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
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
