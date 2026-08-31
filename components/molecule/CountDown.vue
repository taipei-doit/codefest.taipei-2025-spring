<script setup lang="ts">
const props = defineProps<{
  targetDate: Date;
}>();

const targetTime = props.targetDate.getTime();

const timeLeft = ref<{
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
} | null>(null);

const interval = ref<ReturnType<typeof setInterval> | null>(null);

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

/**
 * 計算剩餘時間
 */
const getTimeLeft = (now: Date) => {
  const diff = targetTime - now.getTime();

  if (diff <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00' };

  return {
    days: formatNumber(diff / MS_PER_DAY),
    hours: formatNumber((diff / MS_PER_HOUR) % 24),
    minutes: formatNumber((diff / MS_PER_MINUTE) % 60),
    seconds: formatNumber((diff / MS_PER_SECOND) % 60),
  };
};

// 格式化數字（確保雙位數，例如 "5" -> "05"）
const formatNumber = (num: number) => {
  return String(Math.floor(num)).padStart(2, '0');
};

onMounted(() => {
  timeLeft.value = getTimeLeft(new Date());
  interval.value = setInterval(() => {
    timeLeft.value = getTimeLeft(new Date());
  }, 1000);
});

onUnmounted(() => {
  if (interval.value) clearInterval(interval.value);
});
</script>

<template>
  <p>
    <!-- 天數 -->
    <span class="mx-1">
      <span v-for="(char, index) in timeLeft?.days" :key="'days' + index" class="countdown-box">
        {{ char }}
      </span>
    </span>
    <span>日</span>

    <!-- 小時 -->
    <span class="mx-1">
      <span v-for="(char, index) in timeLeft?.hours" :key="'hours' + index" class="countdown-box">
        {{ char }}
      </span>
    </span>
    <span>時</span>

    <!-- 分鐘 -->
    <span class="mx-1">
      <span v-for="(char, index) in timeLeft?.minutes" :key="'minutes' + index" class="countdown-box">
        {{ char }}
      </span>
    </span>
    <span>分</span>

    <!-- 秒數 -->
    <span class="mx-1">
      <span v-for="(char, index) in timeLeft?.seconds" :key="'seconds' + index" class="countdown-box">
        {{ char }}
      </span>
    </span>
    <span>秒</span>
  </p>
</template>
<style scoped lang="postcss">
/* 倒數計時數字的白色方塊 */
.countdown-box {
  @apply bg-white text-primary-500 font-bold px-2 py-1 text-xl border border-black;
}
</style>