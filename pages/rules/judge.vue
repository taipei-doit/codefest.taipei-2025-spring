ts
// composables/useJudgeList.ts
import type { JudgeList } from '~/interfaces/judge.interface';
import { useI18n } from 'vue-i18n';

export function useJudgeList(): { judgeList: JudgeList[] } {
  const { tm } = useI18n();

  /** 評審列表 */
  const judgeList = computed<JudgeList[]>(() => {
    const data = tm('rules.judges').list;
    return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
  });

  return {
    judgeList,
  };
}