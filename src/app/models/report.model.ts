// レポート関連の型定義（バックエンドDTO）

// トレンドアイテム（グラフの各項目）
export interface TrendItem {
  label: string;      // 表示用ラベル（例: "2025年10月"）
  amount: number;     // その月の合計金額
  yearMonth: string;  // 年月識別子（例: "2025-10-01"）
}

// 取引明細アイテム
export interface TransactionItem {
  id: number;
  itemName: string;
  itemAmount: number;
  usedDate: string;    // DateTime形式
  inoutFlg: boolean;   // true=収入、false=支出
}

// カテゴリ別トレンドレポート取得リクエスト（クエリパラメータ）
export interface GetCategoryTrendReportRequest {
  categoryId: number;
  targetDate?: string;  // "yyyy-MM-dd"形式、省略時は当月
}

// カテゴリ別トレンドレポートのレスポンス
export interface CategoryTrendResponse {
  categoryName: string;
  totalAmountThisMonth: number;
  trends: TrendItem[];
  transactions: TransactionItem[];
}

// ngx-charts用のデータ形式（フロントエンド専用）
export interface ChartData {
  name: string;
  value: number;
  extra?: any;
}
