import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import {
  Transaction,
  MonthlyDataRequest,
  MonthlyDataResponse,
  GetMonthlyResultRequest,
  GetMonthlyResultResponse
} from '../models/kakeibo.model';

@Injectable({
  providedIn: 'root'
})
export class KakeiboService {
  constructor(private apiService: ApiService) {}

  // 月別データを取得
  public getMonthlyData(request: MonthlyDataRequest): Observable<ApiResponse<MonthlyDataResponse>> {
    return this.apiService.get<MonthlyDataResponse>(
      `/kakeibo/${request.kakeiboId}/monthly`,
      { year: request.year, month: request.month }
    );
  }

  // 取引を作成
  public createTransaction(transaction: Partial<Transaction>): Observable<ApiResponse<Transaction>> {
    return this.apiService.post<Transaction>('/transactions', transaction);
  }

  // 取引を更新
  public updateTransaction(id: string, transaction: Partial<Transaction>): Observable<ApiResponse<Transaction>> {
    return this.apiService.put<Transaction>(`/transactions/${id}`, transaction);
  }

  // 取引を削除
  public deleteTransaction(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`/transactions/${id}`);
  }

  // 月間レポートを取得
  public getMonthlyResult(request: GetMonthlyResultRequest): Observable<ApiResponse<GetMonthlyResultResponse>> {
    return this.apiService.get<GetMonthlyResultResponse>(
      '/kakeibo/monthly-result',
      { userId: request.userId }
    );
  }
}
