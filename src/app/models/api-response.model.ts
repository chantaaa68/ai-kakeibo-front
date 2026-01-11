// APIレスポンスの共通型定義
export interface ApiResponse<T> {
  // 成功・失敗を示すステータス
  status: boolean;
  // エラーメッセージ（成功時はnull）
  message: string | null;
  // レスポンスデータ
  data: T;
}
