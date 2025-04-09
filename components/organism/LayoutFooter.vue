<script setup lang="ts">
const { tm } = useI18n();

/** 聯絡資訊 */
const contactBtns = computed(() => {
  const data = tm('contact.buttons');
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});
</script>

<template>
  <footer class="bg-black p-5 pt-0 font-fusion-pixel">
    <div class="container mx-auto border border-white">
      <div class="m-1 border border-white">
        <div class="grid lg:grid-cols-5 grid-cols-1 text-white">
          <div class="lg:col-span-1 p-4 flex flex-col border border-r-white">
            <div class="grid lg:grid-cols-1 grid-cols-2 gap-x-4">
              <span class="col-span-2 lg:col-span-1 text-center lg:text-left mb-4"
                >主辦單位<span class="lg:inline hidden">：</span></span
              >
              <span class="text-center lg:text-left lg:mb-4">新北市政府資訊中心</span>
              <span class="text-center lg:text-left lg:mb-4">臺北市政府資訊局</span>
            </div>
            <div v-if="tm('policy').available" class="lg:block hidden mt-auto text-center">
              <a
                v-for="(item, index) in tm('policy.list')"
                :key="index"
                v-kb-focus="{ id: `footer-1-${index + 200}`, x: 1, y: index + 200 }"
                :href="item.link"
                class="lg:block mb-2"
                target="_blank"
              >
                {{ item.name }}
              </a>
            </div>
          </div>
          <div class="lg:col-span-3 p-4 flex flex-col border border-r-white">
            <OrganismLayoutNavbar type="footer" nav-class="lg:flex mb-6 lg:mb-0 text-white" />
            <div class="mt-auto">
              <p>{{ tm('contact.address_ntpc') }}</p>
              <p>{{ tm('contact.address_tpe') }}</p>
              <p>LINE {{ tm('contact.line_id') }}</p>
              <p>EMAIL {{ tm('contact.email') }}</p>
              <p>服務時間：{{ tm('contact.office_hours') }}</p>
            </div>
          </div>
          <div class="lg:col-span-1 p-4 border border-r-white font-px437">
            <p class="mb-3">Connect with us......</p>
            <div class="grid lg:grid-flow-row grid-flow-col lg:grid-cols-1 grid-rows-2">
              <div v-for="(btn, index) in contactBtns" :key="index" class="flex items-center mb-3">
                <img src="@/assets/images/icons/white-arrow-down-right.svg" class="mr-2" alt="" />
                <a
                  v-kb-focus="{
                    id: `footer-6-${index + 203}`,
                    x: 6,
                    y: index + 203,
                  }"
                  :href="btn.link"
                  target="_blank"
                >
                  <span class="connect-btn">{{ btn.name }}</span>
                </a>
              </div>
            </div>
          </div>
          <div v-if="tm('policy').available" class="lg:hidden block p-4 mt-auto">
            <a
              v-for="(item, index) in tm('policy.list')"
              :key="index"
              :href="item.link"
              class="block text-center mb-2"
              target="_blank"
            >
              {{ item.name }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="postcss">
.connect-btn {
  @apply inline-block px-6 py-2 border border-white text-white uppercase;
}
</style>
