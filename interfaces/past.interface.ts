/**
 * 過去回顧項目的共同屬性
 */
export interface PastReviewCommonProps {
  id: number;
  /** 回顧縮圖 */
  thumbnail: string;
}

/**
 * 獲獎團隊
 */
export interface PastWinningTeam extends PastReviewCommonProps {
  /** 名次 */
  ranking: string;
  /** 團隊名稱 */
  team_name: string;
  /** 團隊成員 */
  team_members: string;
  /** 團隊簡介 */
  descriptions: {
    title: string;
    content: string;
  }[];
  /** 多圖連結 */
  image_list: string[];
}

/**
 * 照片回顧
 */
export interface PastPhoto extends PastReviewCommonProps {
  /** 回顧名稱 */
  title: string;
  /** 多圖連結 */
  image_list: string[];
  /** 更多照片連結 */
  more_photos_url: string;
}

/**
 * 參賽影音回顧
 */
export interface PastVideo extends PastReviewCommonProps {
  /** 日期 */
  date: string;
  /** 回顧名稱 */
  title: string;
  /** 回顧影片連結 */
  video_url: string;
}