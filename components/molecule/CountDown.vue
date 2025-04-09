<script setup lang="ts">
const props = defineProps<{
  targetDate: Date;
}>();

/**
 * 倒數目標時間
 * Ex：2025-06-01 00:00:00
 */
const targetDate = props.targetDate.getTime();

const timeLeft = ref<{
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
} | null>(null);

/** 每秒更新倒數時間 */
const interval = ref<ReturnType<typeof setInterval> | null>(null);

/**
 * 計算剩餘時間
 */
const getTimeLeft = (date: Date) => {
  const now = date.getTime();
  const diff = targetDate - now;

  if (diff <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00' };

  return {
    days: formatNumber(diff / (1000 * 60 * 60 * 24)),
    hours: formatNumber((diff / (1000 * 60 * 60)) % 24),
    minutes: formatNumber((diff / (1000 * 60)) % 60),
    seconds: formatNumber((diff / 1000) % 60),
  };
};

// 格式化數字（確保雙位數，例如 "5" -> "05"）
const formatNumber = (num: number) => {
  return String(Math.floor(num)).padStart(2, '0');
};

onMounted(() => {
  interval.value = setInterval(() => {
    const date = new Date();
    timeLeft.value = getTimeLeft(date);
  }, 1000);
});

onUnmounted(() => {
  clearInterval(interval.value!);
});
</script>

<template>
  <p>
    <!-- 天數 -->
    <span class="mx-1">
      <span v-for="char in timeLeft?.days" :key="'days' + char" class="countdown-box">
        {{ char }}
      </span>
    </span>
    <span>日</span>

    <!-- 小時 -->
    <span class="mx-1">
      <span v-for="char in timeLeft?.hours" :key="'hours' + char" class="countdown-box">
        {{ char }}
      </span>
    </span>
    <span>時</span>

    <!-- 分鐘 -->
    <span class="mx-1">
      <span v-for="char in timeLeft?.minutes" :key="'minutes' + char" class="countdown-box">
        {{ char }}
      </span>
    </span>
    <span>分</span>

    <!-- 秒數 -->
    <span class="mx-1">
      <span v-for="char in timeLeft?.seconds" :key="'seconds' + char" class="countdown-box">
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
