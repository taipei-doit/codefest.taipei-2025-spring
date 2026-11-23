export enum NewsTag {
  NEWS = 'news',
  MEDIA = 'media',
}

export interface News {
  /** 消息唯一識別碼 */
  id: number;
  /** 發布日期 */
  date: string;
  /** 標題 */
  title: string;
  /** 內文 */
  content: string;
  /** 是否可用 */
  available: boolean;
  /** 標籤 */
  tag: NewsTag;
  /**
   * 內文圖片
   * - 僅限一張，排在 content 前方
   */
  image_url?: string;
}
