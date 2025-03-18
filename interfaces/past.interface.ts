/**
 * 參賽回顧
 */
export interface Past {
  id: number;
  /** 日期 */
  date: string;
  /** 回顧名稱 */
  title: string;
  /** 回顧縮圖 */
  thumbnail: string;
  /** 回顧影片連結 */
  video_url: string;
}

