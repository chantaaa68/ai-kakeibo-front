// レポート関連の型定義

// トレンドアイテム（グラフの各項目）
export interface TrendItem {
  label: string;        // 表示用ラベル（例: "2025年10月", "10月"）
  amount: number;       // その月の合計金額
  yearMonth: string;    // 年月識別子（例: "2025-10-01"）
}

// 取引明細アイテム
export interface TransactionItem {
  id: number;           // 取引ID
  itemName: string;     // 取引名
  itemAmount: number;   // 金額
  usedDate: string;     // 使用日（DateTime）
  inoutFlg: boolean;    // 収支フラグ（true=収入、false=支出）
}

// カテゴリ別トレンドレポートのレスポンス
export interface CategoryTrendResponse {
  categoryName: string;           // カテゴリ名
  totalAmountThisMonth: number;   // 当月の合計金額
  trends: TrendItem[];            // 全期間の月別推移データ
  transactions: TransactionItem[]; // 全期間の取引明細
}

// ngx-charts用のデータ形式
export interface ChartData {
  name: string;    // ラベル
  value: number;   // 値
  extra?: any;     // 追加データ（yearMonthを格納）
}
