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
   * @param targetDate 対象日（yyyy-MM-dd形式、省略時は当月）
   * @returns カテゴリ別トレンドレポートデータ
   */
  public getCategoryTrend(categoryId: number, targetDate?: string): Observable<CategoryTrendResponse> {
    const params: Record<string, string | number> = {};
    if (targetDate) {
      params['targetDate'] = targetDate;
    }

    return this.apiService
      .get<CategoryTrendResponse>(`/reports/category-trend/${categoryId}`, params)
      .pipe(
        map(response => {
          if (!response.status || !response.result) {
            throw new Error(response.message || 'データの取得に失敗しました');
          }
          return response.result;
        })
      );
  }
}
