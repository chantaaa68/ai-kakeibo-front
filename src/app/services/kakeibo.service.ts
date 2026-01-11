import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import {
  Kakeibo,
  Transaction,
  MonthlyDataRequest,
  MonthlyDataResponse,
  DailySummary,
  TransactionType,
  Category
} from '../models/kakeibo.model';

@Injectable({
  providedIn: 'root'
})
export class KakeiboService {
  constructor(private apiService: ApiService) {}

  // 月別データを取得
  public getMonthlyData(request: MonthlyDataRequest): Observable<ApiResponse<MonthlyDataResponse>> {
    // モックデータを生成
    const mockData = this.generateMockMonthlyData(request.year, request.month);

    return this.apiService.get<MonthlyDataResponse>(
      `/kakeibo/${request.kakeiboId}/monthly`,
      { year: request.year, month: request.month }
    ).pipe(
      map(response => {
        // 開発中はモックデータを使用
        response.data = mockData;
        return response;
      })
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

  // モックの月別データを生成（開発用）
  private generateMockMonthlyData(year: number, month: number): MonthlyDataResponse {
    const dailySummaries: DailySummary[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    // カテゴリのモックデータ
    const mockCategories: Category[] = [
      { id: '1', name: '給料', icon: 'payments', type: TransactionType.INCOME },
      { id: '2', name: '副業', icon: 'work', type: TransactionType.INCOME },
      { id: '3', name: '食費', icon: 'restaurant', type: TransactionType.EXPENSE },
      { id: '4', name: '交通費', icon: 'train', type: TransactionType.EXPENSE },
      { id: '5', name: '娯楽', icon: 'sports_esports', type: TransactionType.EXPENSE },
      { id: '6', name: '光熱費', icon: 'lightbulb', type: TransactionType.EXPENSE },
    ];

    // 各日のデータを生成
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const transactions: Transaction[] = [];

      // ランダムに取引を生成（一部の日のみ）
      if (Math.random() > 0.5) {
        // 収入（給料は月初のみ）
        if (day === 25) {
          transactions.push({
            id: `t-${year}-${month}-${day}-1`,
            kakeiboId: '1',
            date: date,
            name: '給料',
            amount: 250000,
            type: TransactionType.INCOME,
            category: mockCategories[0]
          });
        }

        // 支出
        if (Math.random() > 0.3) {
          const expenseCategory = mockCategories.filter(c => c.type === TransactionType.EXPENSE)[
            Math.floor(Math.random() * 4)
          ];
          transactions.push({
            id: `t-${year}-${month}-${day}-2`,
            kakeiboId: '1',
            date: date,
            name: `${expenseCategory.name}の支払い`,
            amount: Math.floor(Math.random() * 5000) + 500,
            type: TransactionType.EXPENSE,
            category: expenseCategory
          });
        }
      }

      // 収入と支出の合計を計算
      const income = transactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = transactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);

      dailySummaries.push({
        date: date,
        income: income,
        expense: expense,
        transactions: transactions
      });
    }

    return {
      year: year,
      month: month,
      dailySummaries: dailySummaries
    };
  }
}
