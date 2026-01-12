import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
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
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.append(key, params[key]);
      });
    }

    const url = `${this.config.baseUrl}${endpoint}`;
    return this.http.get<ApiResponse<T>>(url, { params: httpParams }).pipe(
      catchError(this.handleError)
    );
  }

  // POST リクエスト
  public post<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    return this.http.post<ApiResponse<T>>(url, body).pipe(
      catchError(this.handleError)
    );
  }

  // PUT リクエスト
  public put<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    return this.http.put<ApiResponse<T>>(url, body).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE リクエスト
  public delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    return this.http.delete<ApiResponse<T>>(url).pipe(
      catchError(this.handleError)
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
      errorMessage = `エラー: ${error.error.message}`;
    } else {
      // サーバー側のエラー
      errorMessage = error.error?.message || `サーバーエラー: ${error.status}`;
    }

    console.error('API Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
