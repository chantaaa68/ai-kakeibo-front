// ユーザー情報
export interface User {
  id: string;
  name: string;
  email: string;
}

// ログインリクエスト
export interface LoginRequest {
  email: string;
  password: string;
}

// ログインレスポンス
export interface LoginResponse {
  user: User;
  token: string;
}

// ユーザー登録リクエスト
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  kakeiboDescription?: string; // 家計簿の説明（任意）
}
