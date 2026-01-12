import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import {
  Category,
  CreateCategoryRequest,
  AvailableIcon
} from '../models/kakeibo.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private apiService: ApiService) {}

  // カテゴリ一覧を取得
  public getCategories(userId: string): Observable<ApiResponse<Category[]>> {
    return this.apiService.get<Category[]>('/categories', { userId });
  }

  // カテゴリを作成
  public createCategory(request: CreateCategoryRequest): Observable<ApiResponse<Category>> {
    return this.apiService.post<Category>('/categories', request);
  }

  // カテゴリを更新
  public updateCategory(id: string, request: Partial<CreateCategoryRequest>): Observable<ApiResponse<Category>> {
    return this.apiService.put<Category>(`/categories/${id}`, request);
  }

  // カテゴリを削除
  public deleteCategory(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`/categories/${id}`);
  }

  // 利用可能なアイコン一覧を取得
  public getAvailableIcons(): Observable<ApiResponse<AvailableIcon[]>> {
    return this.apiService.get<AvailableIcon[]>('/icons');
  }
}
