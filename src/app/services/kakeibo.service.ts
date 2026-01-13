import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import {
  GetMonthlyResultRequest,
  GetMonthlyResultResponse,
  GetKakeiboItemListRequest,
  GetKakeiboItemListResponse,
  GetKakeiboItemDetailRequest,
  GetKakeiboItemDetailResponse,
  RegistKakeiboItemRequest,
  RegistKakeiboItemResponse,
  UpdateKakeiboItemRequest,
  UpdateKakeiboItemResponse,
  DeleteKakeiboItemRequest,
  DeleteKakeiboItemResponse,
  UpdateKakeiboRequest,
  UpdateKakeiboResponse,
  GetMonthlyReportRequest,
  GetMonthlyReportResponse
} from '../models/kakeibo.model';

@Injectable({
  providedIn: 'root'
})
export class KakeiboService {
  constructor(private apiService: ApiService) {}

  // 月間レポートを取得
  public getMonthlyResult(request: GetMonthlyResultRequest): Observable<ApiResponse<GetMonthlyResultResponse>> {
    return this.apiService.post<GetMonthlyResultResponse>('/kakeibo/GetMonthlyResult', request);
  }

  // 月間レポートを取得
  public getMonthlyReport(request: GetMonthlyReportRequest): Observable<ApiResponse<GetMonthlyReportResponse>> {
    return this.apiService.post<GetMonthlyReportResponse>('/kakeibo/GetMonthlyReport', request);
  }

  // 家計簿項目一覧を取得
  public getKakeiboItemList(request: GetKakeiboItemListRequest): Observable<ApiResponse<GetKakeiboItemListResponse>> {
    return this.apiService.post<GetKakeiboItemListResponse>('/kakeibo/GetKakeiboItemList', request);
  }

  // 家計簿項目詳細を取得
  public getKakeiboItemDetail(request: GetKakeiboItemDetailRequest): Observable<ApiResponse<GetKakeiboItemDetailResponse>> {
    return this.apiService.post<GetKakeiboItemDetailResponse>('/kakeibo/GetKakeiboItemDetail', request);
  }

  // 取引を作成
  public createTransaction(request: RegistKakeiboItemRequest): Observable<ApiResponse<RegistKakeiboItemResponse>> {
    return this.apiService.post<RegistKakeiboItemResponse>('/kakeibo/RegistKakeiboItem', request);
  }

  // 取引を更新
  public updateTransaction(request: UpdateKakeiboItemRequest): Observable<ApiResponse<UpdateKakeiboItemResponse>> {
    return this.apiService.post<UpdateKakeiboItemResponse>('/kakeibo/UpdateKakeiboItem', request);
  }

  // 取引を削除
  public deleteTransaction(request: DeleteKakeiboItemRequest): Observable<ApiResponse<DeleteKakeiboItemResponse>> {
    return this.apiService.post<DeleteKakeiboItemResponse>('/kakeibo/DeleteKakeiboItem', request);
  }

  // 家計簿を更新
  public updateKakeibo(request: UpdateKakeiboRequest): Observable<ApiResponse<UpdateKakeiboResponse>> {
    return this.apiService.post<UpdateKakeiboResponse>('/kakeibo/UpdateKakeibo', request);
  }
}
