// ユーザー情報（画面表示用）
export interface User {
  userId: number;
  userName: string;
  email: string;
  kakeiboId: number;
  kakeiboName: string;
  kakeiboExplanation: string;
}

// ログインリクエスト（バックエンドDTO）
export interface LoginRequest {
  email: string;
  userHash: string;
}

// ログインレスポンス（バックエンドDTO）
export interface LoginResponse {
  userId: number;
  token: string;
  kakeiboId: number;
}

// ユーザー登録リクエスト（バックエンドDTO）
export interface RegisterRequest {
  userName: string;
  userHash: string;
  email: string;
  kakeiboName: string;
  kakeiboExplanation: string;
}

// ユーザー登録レスポンス（バックエンドDTO）
export interface RegisterResponse {
  userId: number;
}

// ユーザー情報取得リクエスト（バックエンドDTO）
export interface GetUserDataRequest {
  userId: number;
}

// ユーザー情報取得レスポンス（バックエンドDTO）
export interface GetUserDataResponse {
  userName: string;
  email: string;
  kakeiboName: string;
  kakeiboExplanation: string;
}

// ユーザー更新リクエスト（バックエンドDTO）
export interface UpdateUserRequest {
  userId: number;
  userName?: string | null;
  email?: string | null;
  kakeiboName?: string | null;
  kakeiboExplanation?: string | null;
}

// ユーザー削除リクエスト（バックエンドDTO）
export interface DeleteUserRequest {
  userId: number;
}

// ユーザー削除レスポンス（バックエンドDTO）
export interface DeleteUserResponse {
  userId: number;
}
