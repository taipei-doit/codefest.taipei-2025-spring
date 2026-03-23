```typescript
/**
 * 評審列表的分組資訊，例如：初審評審、複審評審等。
 */
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
```