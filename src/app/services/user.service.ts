import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
    return this.apiService.put<User>(`/users/${userId}`, request).pipe(
      tap(response => {
        // 成功時、ローカルストレージのユーザー情報も更新
        if (response.status && response.data) {
          localStorage.setItem('currentUser', JSON.stringify(response.data));
        }
      })
    );
  }

  // ユーザー情報を取得
  public getUser(userId: string): Observable<ApiResponse<User>> {
    return this.apiService.get<User>(`/users/${userId}`);
  }
}
