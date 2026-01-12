import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { CategoryTrendResponse } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private apiService: ApiService) {}

  /**
   * カテゴリ別トレンドレポートを取得
   * @param categoryId カテゴリID
   * @returns カテゴリ別トレンドレポートデータ
   */
  public getCategoryTrend(categoryId: string): Observable<CategoryTrendResponse> {
    return this.apiService
      .get<CategoryTrendResponse>(`/reports/category-trend/${categoryId}`)
      .pipe(
        map(response => {
          if (!response.status || !response.data) {
            throw new Error(response.message || 'データの取得に失敗しました');
          }
          return response.data;
        })
      );
  }
}
