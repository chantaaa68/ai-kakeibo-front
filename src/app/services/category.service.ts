import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import {
  GetCategoryDataRequest,
  GetCategoryDataResponse,
  RegistCategoryRequest,
  RegistCategoryResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
  GetIconListResponse
} from '../models/kakeibo.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private apiService: ApiService) {}

  // カテゴリ一覧を取得
  public getCategories(
    userId: number,
    defaultFlg: boolean = false
  ): Observable<ApiResponse<GetCategoryDataResponse>> {
    const request: GetCategoryDataRequest = { userId, defaultFlg };
    return this.apiService.post<GetCategoryDataResponse>('/category/GetCategoryData', request);
  }

  // カテゴリを作成
  public createCategory(request: RegistCategoryRequest): Observable<ApiResponse<RegistCategoryResponse>> {
    return this.apiService.post<RegistCategoryResponse>('/category/RegistCategory', request);
  }

  // カテゴリを更新
  public updateCategory(request: UpdateCategoryRequest): Observable<ApiResponse<UpdateCategoryResponse>> {
    return this.apiService.post<UpdateCategoryResponse>('/category/UpdateCategory', request);
  }

  // 利用可能なアイコン一覧を取得
  public getAvailableIcons(): Observable<ApiResponse<GetIconListResponse>> {
    return this.apiService.get<GetIconListResponse>('/icon/GetIconList');
  }
}
