/**
 * 對話框名稱常數定義
 */
export const DIALOG_NAMES = {
  /** 報名對話框 */
  APPLY: 'apply',
  /** 新聞對話框 */
  NEWS: 'news',
  /** 行動選單 */
  MOBILE_MENU: 'mobileMenu',
  /** 獲勝團隊對話框 */
  WINNING_TEAM: 'winningTeam',
  /** 照片對話框 */
  PHOTO: 'photo',
} as const;

/**
 * 對話框名稱的型別 Union
 */
export type DialogName = (typeof DIALOG_NAMES)[keyof typeof DIALOG_NAMES];
