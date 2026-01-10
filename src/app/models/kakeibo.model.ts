// 家計簿情報
export interface Kakeibo {
  id: string;
  userId: string;
  description?: string;
  createdAt: Date;
}

// 取引種別
export enum TransactionType {
  INCOME = 'income',   // 収入
  EXPENSE = 'expense'  // 支出
}

// カテゴリ情報
export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
}

// 取引情報
export interface Transaction {
  id: string;
  kakeiboId: string;
  date: Date;
  name: string;
  amount: number;
  type: TransactionType;
  category: Category;
}

// 日別の集計データ
export interface DailySummary {
  date: Date;
  income: number;   // 収入合計
  expense: number;  // 支出合計
  transactions: Transaction[];
}

// 月別データ取得リクエスト
export interface MonthlyDataRequest {
  kakeiboId: string;
  year: number;
  month: number;
}

// 月別データレスポンス
export interface MonthlyDataResponse {
  year: number;
  month: number;
  dailySummaries: DailySummary[];
}
