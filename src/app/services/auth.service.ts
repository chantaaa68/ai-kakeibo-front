import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { User, LoginRequest, LoginResponse, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private token: string | null = null;

  constructor(private apiService: ApiService) {
    // ローカルストレージから認証情報を復元
    this.loadAuthData();
  }

  // ログイン
  public login(request: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.apiService.post<LoginResponse>('/auth/login', request).pipe(
      tap(response => {
        if (response.status && response.data) {
          this.currentUser = response.data.user;
          this.token = response.data.token;
          this.saveAuthData();
        }
      })
    );
  }

  // 新規登録
  public register(request: RegisterRequest): Observable<ApiResponse<LoginResponse>> {
    return this.apiService.post<LoginResponse>('/auth/register', request).pipe(
      tap(response => {
        if (response.status && response.data) {
          this.currentUser = response.data.user;
          this.token = response.data.token;
          this.saveAuthData();
        }
      })
    );
  }

  // ログアウト
  public logout(): void {
    this.currentUser = null;
    this.token = null;
    this.clearAuthData();
  }

  // 現在のユーザーを取得
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  // 認証トークンを取得
  public getToken(): string | null {
    return this.token;
  }

  // ログイン状態を確認
  public isAuthenticated(): boolean {
    return this.currentUser !== null && this.token !== null;
  }

  // 認証情報をローカルストレージに保存
  private saveAuthData(): void {
    if (this.currentUser && this.token) {
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      localStorage.setItem('token', this.token);
    }
  }

  // 認証情報をローカルストレージから読み込み
  private loadAuthData(): void {
    const userJson = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');

    if (userJson && token) {
      this.currentUser = JSON.parse(userJson);
      this.token = token;
    }
  }

  // 認証情報をクリア
  private clearAuthData(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }
}
