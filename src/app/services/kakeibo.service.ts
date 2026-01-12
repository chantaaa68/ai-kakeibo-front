import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import {
  Kakeibo,
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
    return this.apiService.post<MonthlyDataResponse>('/kakeibo/GetMonthlyResult', request);
  }

  // 家計簿項目一覧を取得
  public getKakeiboItemList(kakeiboId: string): Observable<ApiResponse<Transaction[]>> {
    return this.apiService.post<Transaction[]>('/kakeibo/GetKakeiboItemList', { kakeiboId });
  }

  // 家計簿項目詳細を取得
  public getKakeiboItemDetail(itemId: string): Observable<ApiResponse<Transaction>> {
    return this.apiService.post<Transaction>('/kakeibo/GetKakeiboItemDetail', { itemId });
  }

  // 取引を作成
  public createTransaction(transaction: Partial<Transaction>): Observable<ApiResponse<Transaction>> {
    return this.apiService.post<Transaction>('/kakeibo/RegistKakeiboItem', transaction);
  }

  // 取引を更新
  public updateTransaction(id: string, transaction: Partial<Transaction>): Observable<ApiResponse<Transaction>> {
    return this.apiService.post<Transaction>('/kakeibo/UpdateKakeiboItem', { id, ...transaction });
  }

  // 取引を削除
  public deleteTransaction(id: string): Observable<ApiResponse<void>> {
    return this.apiService.post<void>('/kakeibo/DeleteKakeiboItem', { id });
  }

  // 家計簿を更新
  public updateKakeibo(kakeiboId: string, data: Partial<Kakeibo>): Observable<ApiResponse<Kakeibo>> {
    return this.apiService.post<Kakeibo>('/kakeibo/UpdateKakeibo', { kakeiboId, ...data });
  }

  // 月間レポートを取得
  public getMonthlyResult(request: GetMonthlyResultRequest): Observable<ApiResponse<GetMonthlyResultResponse>> {
    return this.apiService.get<GetMonthlyResultResponse>(
      '/kakeibo/monthly-result',
      { userId: request.userId }
    );
  }
}
