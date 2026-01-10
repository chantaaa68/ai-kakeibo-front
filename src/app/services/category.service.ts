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
    // モックデータ
    const mockCategories: Category[] = [
      // 収入カテゴリ
      { id: '1', name: '給料', icon: 'payments', type: TransactionType.INCOME },
      { id: '2', name: '副業', icon: 'work', type: TransactionType.INCOME },
      { id: '3', name: 'ボーナス', icon: 'card_giftcard', type: TransactionType.INCOME },
      { id: '4', name: '投資', icon: 'trending_up', type: TransactionType.INCOME },
      
      // 支出カテゴリ
      { id: '5', name: '食費', icon: 'restaurant', type: TransactionType.EXPENSE },
      { id: '6', name: '交通費', icon: 'directions_bus', type: TransactionType.EXPENSE },
      { id: '7', name: '娯楽', icon: 'sports_esports', type: TransactionType.EXPENSE },
      { id: '8', name: '光熱費', icon: 'electrical_services', type: TransactionType.EXPENSE },
      { id: '9', name: '通信費', icon: 'phone_iphone', type: TransactionType.EXPENSE },
      { id: '10', name: '日用品', icon: 'shopping_cart', type: TransactionType.EXPENSE },
      { id: '11', name: '医療費', icon: 'local_hospital', type: TransactionType.EXPENSE },
      { id: '12', name: '教育費', icon: 'school', type: TransactionType.EXPENSE },
    ];

    return this.apiService.get<Category[]>(`/categories?userId=${userId}`).pipe(
      map(response => {
        // 開発中はモックデータを使用
        response.data = mockCategories;
        return response;
      })
    );
  }

  // カテゴリを作成
  public createCategory(request: CreateCategoryRequest): Observable<ApiResponse<Category>> {
    // モックレスポンス
    const mockCategory: Category = {
      id: Date.now().toString(),
      name: request.name,
      icon: request.icon,
      type: request.type
    };

    return this.apiService.post<Category>('/categories', request).pipe(
      map(response => {
        // 開発中はモックデータを使用
        response.data = mockCategory;
        return response;
      })
    );
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
    // モックアイコンデータ
    const mockIcons: AvailableIcon[] = [
      // 食事・飲食
      { id: '1', name: 'restaurant', displayName: 'レストラン', category: 'food' },
      { id: '2', name: 'fastfood', displayName: 'ファーストフード', category: 'food' },
      { id: '3', name: 'local_cafe', displayName: 'カフェ', category: 'food' },
      { id: '4', name: 'local_bar', displayName: 'バー', category: 'food' },
      { id: '5', name: 'lunch_dining', displayName: '食事', category: 'food' },
      { id: '6', name: 'ramen_dining', displayName: 'ラーメン', category: 'food' },
      
      // 買い物
      { id: '7', name: 'shopping_cart', displayName: '買い物', category: 'shopping' },
      { id: '8', name: 'local_grocery_store', displayName: '食料品店', category: 'shopping' },
      { id: '9', name: 'store', displayName: '店舗', category: 'shopping' },
      { id: '10', name: 'shopping_bag', displayName: 'ショッピングバッグ', category: 'shopping' },
      
      // 交通
      { id: '11', name: 'directions_bus', displayName: 'バス', category: 'transport' },
      { id: '12', name: 'directions_car', displayName: '車', category: 'transport' },
      { id: '13', name: 'train', displayName: '電車', category: 'transport' },
      { id: '14', name: 'local_taxi', displayName: 'タクシー', category: 'transport' },
      { id: '15', name: 'flight', displayName: '飛行機', category: 'transport' },
      { id: '16', name: 'two_wheeler', displayName: 'バイク', category: 'transport' },
      
      // 娯楽
      { id: '17', name: 'sports_esports', displayName: 'ゲーム', category: 'entertainment' },
      { id: '18', name: 'movie', displayName: '映画', category: 'entertainment' },
      { id: '19', name: 'theaters', displayName: '劇場', category: 'entertainment' },
      { id: '20', name: 'sports_soccer', displayName: 'スポーツ', category: 'entertainment' },
      { id: '21', name: 'music_note', displayName: '音楽', category: 'entertainment' },
      
      // 光熱費・通信
      { id: '22', name: 'electrical_services', displayName: '電気', category: 'utilities' },
      { id: '23', name: 'water_drop', displayName: '水道', category: 'utilities' },
      { id: '24', name: 'local_fire_department', displayName: 'ガス', category: 'utilities' },
      { id: '25', name: 'phone_iphone', displayName: '携帯電話', category: 'utilities' },
      { id: '26', name: 'wifi', displayName: 'インターネット', category: 'utilities' },
      
      // 医療・健康
      { id: '27', name: 'local_hospital', displayName: '病院', category: 'health' },
      { id: '28', name: 'medication', displayName: '薬', category: 'health' },
      { id: '29', name: 'fitness_center', displayName: 'フィットネス', category: 'health' },
      { id: '30', name: 'spa', displayName: 'スパ', category: 'health' },
      
      // 教育
      { id: '31', name: 'school', displayName: '学校', category: 'education' },
      { id: '32', name: 'book', displayName: '本', category: 'education' },
      { id: '33', name: 'library_books', displayName: '図書館', category: 'education' },
      
      // 住宅
      { id: '34', name: 'home', displayName: '家', category: 'housing' },
      { id: '35', name: 'apartment', displayName: 'アパート', category: 'housing' },
      { id: '36', name: 'house', displayName: '一軒家', category: 'housing' },
      
      // 収入関連
      { id: '37', name: 'payments', displayName: '給料', category: 'income' },
      { id: '38', name: 'work', displayName: '仕事', category: 'income' },
      { id: '39', name: 'card_giftcard', displayName: 'ギフト', category: 'income' },
      { id: '40', name: 'trending_up', displayName: '投資', category: 'income' },
      { id: '41', name: 'account_balance', displayName: '銀行', category: 'income' },
      
      // その他
      { id: '42', name: 'pets', displayName: 'ペット', category: 'other' },
      { id: '43', name: 'checkroom', displayName: '衣類', category: 'other' },
      { id: '44', name: 'cut', displayName: '美容', category: 'other' },
      { id: '45', name: 'celebration', displayName: 'お祝い', category: 'other' },
      { id: '46', name: 'volunteer_activism', displayName: '寄付', category: 'other' },
    ];

    return this.apiService.get<AvailableIcon[]>('/icons').pipe(
      map(response => {
        // 開発中はモックデータを使用
        response.data = mockIcons;
        return response;
      })
    );
  }
}
