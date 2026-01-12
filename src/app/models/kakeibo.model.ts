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

// カテゴリ作成リクエスト
export interface CreateCategoryRequest {
  name: string;
  icon: string;
  type: TransactionType;
  userId: string;
}

// 利用可能なアイコン情報
export interface AvailableIcon {
  id: string;
  name: string;           // アイコン名（例：shopping_cart）
  displayName: string;    // 表示名（例：買い物）
  category: string;       // カテゴリ（例：shopping, food, transportなど）
}

// ===== 月間レポート関連 =====

// カテゴリ別レポートアイテム
export interface CategoryReportItem {
  categoryName: string;   // カテゴリ名
  totalAmount: number;    // カテゴリごとの合計金額
}

// 月間レポートアイテム
export interface MonthlyReportItem {
  usedMonth: string;                         // 集計月(yyyy-mm)
  categoryReportItems: CategoryReportItem[]; // 集計月別データ
}

// 月間レポート取得リクエスト
export interface GetMonthlyResultRequest {
  userId: number;         // ユーザーID
}

// 月間レポート取得レスポンス
export interface GetMonthlyResultResponse {
  monthlyExpenses: MonthlyReportItem[]; // 各カテゴリごとの支出合計データ
  monthlyIncomes: MonthlyReportItem[];  // 各カテゴリごとの収入合計データ
}
