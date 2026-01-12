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
    const currentUser = this.authService.getCurrentUser();

    return this.apiService.post<User>('/User/Update', request).pipe(
      map(response => {
        // 認証サービスのユーザー情報も更新
        if (response.status && response.data && currentUser) {
          const newUserData: User = {
            ...currentUser,
            name: response.data.name,
            email: response.data.email
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
    return this.apiService.post<User>('/User/GetUserData', { userId });
  }
}
