<script setup lang="ts">
const { tm } = useI18n();

/** 聯絡資訊 */
const connectBtns = computed(() => {
  const data = tm('connect.buttons');
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
            <div class="lg:block hidden mt-auto text-center">
              <a
                v-kb-focus="{
                  id: `footer-1-50`,
                  x: 1,
                  y: 50,
                }"
                href=""
                class="lg:block mb-2"
                >政府網站資料開放宣告</a
              >
              <a
                v-kb-focus="{
                  id: `footer-1-51`,
                  x: 1,
                  y: 51,
                }"
                href=""
                class="lg:block"
                >隱私權及資訊安全政策</a
              >
            </div>
          </div>
          <div class="lg:col-span-3 p-4 flex flex-col border border-r-white">
            <LayoutNavbar type="footer" nav-class="lg:flex mb-6 lg:mb-0 text-white" />
            <div class="mt-auto">
              <p>110204 臺北市信義區市府路1號</p>
              <p>LINE @xxxxx</p>
              <p>服務時間：週一至週五 09:00-17:00</p>
            </div>
          </div>
          <div class="lg:col-span-1 p-4 border border-r-white">
            <p class="mb-3 font-px437">Connect with us......</p>
            <div class="grid lg:grid-flow-row grid-flow-col lg:grid-cols-1 grid-rows-2">
              <div
                v-for="(btn, index) in connectBtns"
                :key="index"
                v-kb-focus="{
                  id: `footer-6-${index + 56}`,
                  x: 1,
                  y: index + 56,
                }"
                class="flex items-center mb-3"
              >
                <img src="@/assets/images/icons/arrow_icon.svg" class="mr-2" alt="" />
                <button class="connect-btn font-px437">{{ btn.name }}</button>
              </div>
            </div>
          </div>
          <div class="lg:hidden block p-4 mt-auto">
            <a href="" class="block text-center mb-2">政府網站資料開放宣告</a>
            <a href="" class="block text-center">隱私權及資訊安全政策</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="postcss">
.connect-btn {
  @apply px-6 py-2 border border-white text-white uppercase;
}
</style>
