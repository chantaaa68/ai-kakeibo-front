import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ApiResponse } from '../models/api-response.model';
import {
  User,
  UpdateUserRequest,
  GetUserDataRequest,
  GetUserDataResponse
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  // ユーザー情報を更新
  public updateUser(request: UpdateUserRequest): Observable<ApiResponse<any>> {
    return this.apiService.post<any>('/User/Update', request).pipe(
      tap(response => {
        // 認証サービスのユーザー情報も更新
        if (response.status && response.result) {
          const currentUser = this.authService.getCurrentUser();
          if (currentUser) {
            const newUserData: User = {
              ...currentUser,
              userName: request.userName || currentUser.userName,
              email: request.email || currentUser.email,
              kakeiboName: request.kakeiboName || currentUser.kakeiboName,
              kakeiboExplanation: request.kakeiboExplanation || currentUser.kakeiboExplanation
            };
            // ローカルストレージを直接更新
            localStorage.setItem('currentUser', JSON.stringify(newUserData));
          }
        }
      })
    );
  }

  // ユーザー情報を取得
  public getUser(userId: number): Observable<ApiResponse<GetUserDataResponse>> {
    const request: GetUserDataRequest = { userId };
    return this.apiService.post<GetUserDataResponse>('/User/GetUserData', request);
  }
}
