import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
    baseUrl: 'http://localhost:5000/api',
    timeout: 30000
  };

  constructor(private http: HttpClient) {}

  // GET リクエスト
  public get<T>(endpoint: string, params?: any): Observable<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.append(key, params[key]);
      });
    }

    return this.http.get<ApiResponse<T>>(url, { params: httpParams }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // POST リクエスト
  public post<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    return this.http.post<ApiResponse<T>>(url, body).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // PUT リクエスト
  public put<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    return this.http.put<ApiResponse<T>>(url, body).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // DELETE リクエスト
  public delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    return this.http.delete<ApiResponse<T>>(url).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // 設定を更新
  public updateConfig(config: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...config };
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

    // TODO: エラーメッセージをポップアップで表示する処理を追加
    // 現時点ではコンソールに出力
    console.error('[API Error]', errorMessage, error);
    alert(errorMessage);

    return throwError(() => new Error(errorMessage));
  }
}
