import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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

    return this.http.get<ApiResponse<T>>(`${this.config.baseUrl}${endpoint}`, { params: httpParams });
  }

  // POST リクエスト
  public post<T>(endpoint: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.config.baseUrl}${endpoint}`, body);
  }

  // PUT リクエスト
  public put<T>(endpoint: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.config.baseUrl}${endpoint}`, body);
  }

  // DELETE リクエスト
  public delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.config.baseUrl}${endpoint}`);
  }

  // 設定を更新
  public updateConfig(config: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // ベースURLを取得
  public getBaseUrl(): string {
    return this.config.baseUrl;
  }
}
