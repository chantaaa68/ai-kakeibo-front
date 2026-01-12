import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  // バックエンドのベースURL
  private config: ApiConfig = {
    baseUrl: 'http://localhost:5000/api',
    timeout: 30000
  };

  constructor(private http: HttpClient) {}

  // GET リクエスト
  public get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Observable<ApiResponse<T>> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, String(params[key]));
        }
      });
    }

    return this.http.get<ApiResponse<T>>(`${this.config.baseUrl}${endpoint}`, { params: httpParams }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // POST リクエスト
  public post<T>(endpoint: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.config.baseUrl}${endpoint}`, body).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // PUT リクエスト
  public put<T>(endpoint: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.config.baseUrl}${endpoint}`, body).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // DELETE リクエスト
  public delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.config.baseUrl}${endpoint}`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // 設定を更新
  public updateConfig(config: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // ベースURLを取得
  public getBaseUrl(): string {
    return this.config.baseUrl;
  }

  // エラーハンドリング
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'エラーが発生しました';

    if (error.error instanceof ErrorEvent) {
      // クライアント側のエラー
      errorMessage = `クライアントエラー: ${error.error.message}`;
    } else {
      // サーバー側のエラー
      if (error.status === 0) {
        errorMessage = 'サーバーに接続できません。ネットワーク接続を確認してください。';
      } else if (error.status >= 400 && error.status < 500) {
        errorMessage = error.error?.message || `クライアントエラー (${error.status})`;
      } else if (error.status >= 500) {
        errorMessage = error.error?.message || `サーバーエラー (${error.status})`;
      }
    }

    // エラーメッセージをポップアップで表示
    console.error('[API Error]', errorMessage, error);
    alert(errorMessage);

    return throwError(() => new Error(errorMessage));
  }
}
