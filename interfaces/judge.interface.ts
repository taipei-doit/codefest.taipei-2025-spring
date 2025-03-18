export interface JudgeList {
  name: string;
  list: Judge[];
}

/**
 * 評審
 */
export interface Judge {
  id: number;
  /** 評審縮圖 */
  thumbnail: string;
  /** 評審姓名 */
  name: string;
  /** 所屬單位 */
  corporation: string;
  /** 職稱 */
  position: string;
}
