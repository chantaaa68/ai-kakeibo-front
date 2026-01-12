import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import {
  Category,
  CreateCategoryRequest,
  AvailableIcon,
  TransactionType
} from '../models/kakeibo.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private apiService: ApiService) {}

  // カテゴリ一覧を取得
  public getCategories(userId: string): Observable<ApiResponse<Category[]>> {
    return this.apiService.post<Category[]>('/category/GetCategoryData', { userId });
  }

  // カテゴリを作成
  public createCategory(request: CreateCategoryRequest): Observable<ApiResponse<Category>> {
    return this.apiService.post<Category>('/category/RegistCategory', request);
  }

  // カテゴリを更新
  public updateCategory(id: string, request: Partial<CreateCategoryRequest>): Observable<ApiResponse<Category>> {
    return this.apiService.post<Category>('/category/UpdateCategory', { id, ...request });
  }

  // カテゴリを削除（バックエンド未実装のため現在は使用不可）
  public deleteCategory(id: string): Observable<ApiResponse<void>> {
    // TODO: バックエンドに削除APIが実装されたら修正
    throw new Error('カテゴリ削除機能は現在バックエンドで実装されていません');
  }

  // 利用可能なアイコン一覧を取得
  public getAvailableIcons(): Observable<ApiResponse<AvailableIcon[]>> {
    return this.apiService.get<AvailableIcon[]>('/icon/GetIconList');
  }
}
