<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
} from "@headlessui/vue";
import type { News } from "~/interfaces/news.interface";

defineProps<{
  isOpen: boolean;
  activeNews?: News | null;
}>();

const emit = defineEmits(["close"]);
</script>

<template>
  <Dialog :open="isOpen" class="relative z-50" @close="emit('close')">
    <!-- The backdrop, rendered as a fixed sibling to the panel container -->
    <div class="fixed inset-0 bg-black/85" aria-hidden="true" />

    <!-- Full-screen scrollable container -->
    <div class="fixed inset-0 w-screen overflow-y-auto">
      <!-- Container to center the panel -->
      <div class="flex min-h-full items-center justify-center p-4">
        <!-- The actual dialog panel -->
        <DialogPanel
          class="bg-white relative w-full max-w-[862px] min-h-[684px] p-10 font-fusion-pixel"
        >
          <button class="absolute top-0 right-0" @click="emit('close')">
            <img src="@/assets/images/icons/btn-close.svg" alt="" />
          </button>
          <p class="text-primary-500 text-lg mb-2">{{ activeNews?.date }}</p>
          <DialogTitle
            class="text-primary-500 text-2xl pb-4 mb-4 custom-dashed dashed-black"
            >{{ activeNews?.title }}</DialogTitle
          >
          <DialogDescription class="text-lg leading-8">
            <img
              v-if="activeNews?.image_url"
              :src="activeNews?.image_url"
              alt=""
              class="mb-4"
            />
            {{ activeNews?.content }}
          </DialogDescription>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
</template>

<style scoped lang="postcss"></style>
