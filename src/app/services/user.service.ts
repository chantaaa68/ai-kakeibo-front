import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ApiResponse } from '../models/api-response.model';
import { User } from '../models/user.model';

// ユーザー更新リクエスト
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  // ユーザー情報を更新
  public updateUser(userId: string, request: UpdateUserRequest): Observable<ApiResponse<User>> {
    // モックレスポンス
    const currentUser = this.authService.getCurrentUser();
    const updatedUser: User = {
      id: userId,
      name: request.name || currentUser?.name || '',
      email: request.email || currentUser?.email || ''
    };

    return this.apiService.put<User>(`/users/${userId}`, request).pipe(
      map(response => {
        // 開発中はモックデータを使用
        response.data = updatedUser;

        // 認証サービスのユーザー情報も更新
        if (response.status && currentUser) {
          const newUserData: User = {
            ...currentUser,
            name: updatedUser.name,
            email: updatedUser.email
          };
          // ローカルストレージを直接更新
          localStorage.setItem('currentUser', JSON.stringify(newUserData));
        }

        return response;
      })
    );
  }

  // ユーザー情報を取得
  public getUser(userId: string): Observable<ApiResponse<User>> {
    const currentUser = this.authService.getCurrentUser();
    
    return this.apiService.get<User>(`/users/${userId}`).pipe(
      map(response => {
        // 開発中はモックデータを使用
        if (currentUser) {
          response.data = currentUser;
        }
        return response;
      })
    );
  }
}
