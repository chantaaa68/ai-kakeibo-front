import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

// バックエンド接続設定
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // バックエンドのベースURL（環境変数から取得可能にする）
  private config: ApiConfig = {
    baseUrl: 'http://localhost:3000/api',
    timeout: 30000
  };

  constructor() {}

  // GET リクエスト
  public get<T>(endpoint: string, params?: any): Observable<ApiResponse<T>> {
    // TODO: 実際のHTTPリクエストに置き換える
    console.log(`[API GET] ${this.config.baseUrl}${endpoint}`, params);
    return this.mockResponse<T>();
  }

  // POST リクエスト
  public post<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    // TODO: 実際のHTTPリクエストに置き換える
    console.log(`[API POST] ${this.config.baseUrl}${endpoint}`, body);
    return this.mockResponse<T>();
  }

  // PUT リクエスト
  public put<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    // TODO: 実際のHTTPリクエストに置き換える
    console.log(`[API PUT] ${this.config.baseUrl}${endpoint}`, body);
    return this.mockResponse<T>();
  }

  // DELETE リクエスト
  public delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    // TODO: 実際のHTTPリクエストに置き換える
    console.log(`[API DELETE] ${this.config.baseUrl}${endpoint}`);
    return this.mockResponse<T>();
  }

  // 設定を更新
  public updateConfig(config: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // モックレスポンスを返す（開発用）
  private mockResponse<T>(data?: T, success: boolean = true): Observable<ApiResponse<T>> {
    const response: ApiResponse<T> = {
      status: success,
      message: success ? null : 'エラーが発生しました',
      data: data as T
    };

    // ネットワーク遅延をシミュレート
    return of(response).pipe(delay(500));
  }
}
