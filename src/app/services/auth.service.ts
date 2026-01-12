import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  GetUserDataRequest
} from '../models/user.model';

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
    return this.apiService.post<LoginResponse>('/User/Login', request).pipe(
      tap(response => {
        if (response.status && response.result) {
          // ユーザー情報を取得してから保存
          this.token = response.result.token;
          this.fetchAndSaveUserData(response.result.userId, response.result.kakeiboId);
        }
      })
    );
  }

  // 新規登録
  public register(request: RegisterRequest): Observable<ApiResponse<RegisterResponse>> {
    return this.apiService.post<RegisterResponse>('/User/Regist', request).pipe(
      tap(response => {
        if (response.status && response.result) {
          // 登録後、自動的にログイン処理を行う
          const loginRequest: LoginRequest = {
            email: request.email,
            userHash: request.userHash
          };
          this.login(loginRequest).subscribe();
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

  // ユーザー情報を取得して保存
  private fetchAndSaveUserData(userId: number, kakeiboId: number): void {
    const request: GetUserDataRequest = { userId };
    this.apiService.post<any>('/User/GetUserData', request).subscribe(response => {
      if (response.status && response.result) {
        this.currentUser = {
          userId,
          userName: response.result.userName,
          email: response.result.email,
          kakeiboId,
          kakeiboName: response.result.kakeiboName,
          kakeiboExplanation: response.result.kakeiboExplanation
        };
        this.saveAuthData();
      }
    });
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
