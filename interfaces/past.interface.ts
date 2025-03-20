/**
 * 獲獎團隊
 */
export interface PastWinningTeam {
  id: number;
  /** 名次 */
  ranking: string;
  /** 團隊名稱 */
  team_name: string;
  /** 回顧縮圖 */
  thumbnail: string;
  /** 團隊成員 */
  team_members: string;
  /** 團隊簡介 */
  description: string;
  /** 多圖連結 */
  image_list: string[];
}

/**
 * 參賽影音回顧
 */
export interface PastVideo {
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
