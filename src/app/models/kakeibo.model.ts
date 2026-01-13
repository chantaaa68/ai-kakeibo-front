// 家計簿情報（バックエンドDTO）
export interface Kakeibo {
  id: number;
  kakeiboName: string;
  kakeiboExplanation: string;
}

// カテゴリ情報（バックエンドDTO）
export interface CategoryItem {
  id: number;
  categoryName: string;
  inoutFlg: boolean;  // true=収入、false=支出
  iconName: string;
}

// カテゴリ取得リクエスト（バックエンドDTO）
export interface GetCategoryDataRequest {
  userId: number;
  defaultFlg: boolean;  // true=デフォルトカテゴリ、false=ユーザーカテゴリ
}

// カテゴリ取得レスポンス（バックエンドDTO）
export interface GetCategoryDataResponse {
  categories: CategoryItem[] | null;
}

// カテゴリ登録リクエスト（バックエンドDTO）
export interface RegistCategoryRequest {
  userId: number;
  categoryName: string;
  inoutFlg: boolean;
  iconName: string;
}

// カテゴリ登録レスポンス（バックエンドDTO）
export interface RegistCategoryResponse {
  categoryId: number;
}

// カテゴリ更新リクエスト（バックエンドDTO）
export interface UpdateCategoryRequest {
  id: number;
  categoryName?: string | null;
  inoutFlg?: boolean | null;
  iconName?: string | null;
}

// カテゴリ更新レスポンス（バックエンドDTO）
export interface UpdateCategoryResponse {
  categoryId: number;
}

// 利用可能なアイコン情報（バックエンドDTO）
export interface IconData {
  iconId: number;
  officialIconName: string;
  defaultIconName: string;
}

// アイコンリスト取得レスポンス（バックエンドDTO）
export interface GetIconListResponse {
  iconDatas: IconData[];
}

// 取引情報（バックエンドDTO）
export interface KakeiboItem {
  itemId: number;
  itemName: string;
  itemAmount: number;
  inoutFlg: boolean;  // true=収入、false=支出
  usedDate: string;   // DateTime形式
  iconName: string;
}

// 日別取引情報（バックエンドDTO）
export interface KakeiboItemInfo {
  dayNo: number;
  items: KakeiboItem[];
}

// 取引一覧取得リクエスト（バックエンドDTO）
export interface GetKakeiboItemListRequest {
  userId: number;
  range: string;  // "yyyy-MM"形式
}

// 取引一覧取得レスポンス（バックエンドDTO）
export interface GetKakeiboItemListResponse {
  kakeiboItemInfos: KakeiboItemInfo[];
}

// 取引詳細取得リクエスト（バックエンドDTO）
export interface GetKakeiboItemDetailRequest {
  itemId: number;
}

// 取引詳細取得レスポンス（バックエンドDTO）
export interface GetKakeiboItemDetailResponse {
  itemName: string;
  itemAmount: number;
  inoutFlg: boolean;
  usedDate: string;   // DateTime形式
  categoryId: number;
}

// 取引登録リクエスト（バックエンドDTO）
export interface RegistKakeiboItemRequest {
  kakeiboId: number;
  itemName: string;
  itemAmount: number;
  inoutFlg: boolean;
  usedDate: string;    // DateTime形式
  categoryId: number;
  frequency: number;   // 0-11 (0=なし、1=毎日、2=毎週、3=隔週、4=毎月、5=隔月、6=3ヶ月、7=6ヶ月、8=毎年、9=2年、10=3年、11=カスタム)
  fixedEndDate?: string | null;  // DateTime形式
}

// 取引登録レスポンス（バックエンドDTO）
export interface RegistKakeiboItemResponse {
  count: number;
}

// 取引更新リクエスト（バックエンドDTO）
export interface UpdateKakeiboItemRequest {
  itemId: number;
  categoryId: number;
  itemName: string;
  itemAmount: number;
  inoutFlg: boolean;
  usedDate: string;    // DateTime形式
  changeFlg: boolean;  // 繰り返し設定の変更フラグ
}

// 取引更新レスポンス（バックエンドDTO）
export interface UpdateKakeiboItemResponse {
  count: number;
}

// 取引削除リクエスト（バックエンドDTO）
export interface DeleteKakeiboItemRequest {
  id: number;
}

// 取引削除レスポンス（バックエンドDTO）
export interface DeleteKakeiboItemResponse {
  count: number;
}

// 家計簿更新リクエスト（バックエンドDTO）
export interface UpdateKakeiboRequest {
  id: number;
  kakeiboName?: string | null;
  kakeiboExplanation?: string | null;
}

// 家計簿更新レスポンス（バックエンドDTO）
export interface UpdateKakeiboResponse {
  count: number;
}

// ===== 月間レポート関連（バックエンドDTO） =====

// カテゴリ別レポートアイテム
export interface CategoryReportItem {
  categoryName: string;
  iconName: string;
  totalAmount: number;
}

// 月間レポートアイテム
export interface MonthlyReportItem {
  usedMonth: string;  // "yyyy-MM"形式
  categoryReportItems: CategoryReportItem[];
}

// 月間レポート取得リクエスト
export interface GetMonthlyResultRequest {
  userId: number;
}

// 月間レポート取得レスポンス
export interface GetMonthlyResultResponse {
  monthlyExpenses: MonthlyReportItem[];
  monthlyIncomes: MonthlyReportItem[];
}

// 月間レポート取得リクエスト
export interface GetMonthlyReportRequest {
  userId: number;
}

// 月間レポート取得レスポンス
export interface GetMonthlyReportResponse {
  monthlyExpenses: MonthlyReportItem[];
  monthlyIncomes: MonthlyReportItem[];
}

// ===== 型エイリアス（後方互換性のため） =====

// 取引情報のエイリアス
export type Transaction = KakeiboItem;

// 日別取引情報のエイリアス
export type DailySummary = KakeiboItemInfo;

// カテゴリ情報のエイリアス
export type Category = CategoryItem;
