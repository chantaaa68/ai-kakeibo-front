import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import {
  Transaction,
  MonthlyDataRequest,
  MonthlyDataResponse,
  DailySummary,
  TransactionType,
  Category,
  GetMonthlyResultRequest,
  GetMonthlyResultResponse
} from '../models/kakeibo.model';

@Injectable({
  providedIn: 'root'
})
export class KakeiboService {
  constructor(private apiService: ApiService) {}

  public getMonthlyData(request: MonthlyDataRequest): Observable<ApiResponse<MonthlyDataResponse>> {
    return this.apiService.get<MonthlyDataResponse>(
      `/kakeibo/${request.kakeiboId}/monthly`,
      { year: request.year, month: request.month }
    ).pipe(
      map(response => {
        // TODO: API実装後は削除
        response.data = this.generateMockMonthlyData(request.year, request.month);
        return response;
      })
    );
  }

  public createTransaction(transaction: Partial<Transaction>): Observable<ApiResponse<Transaction>> {
    return this.apiService.post<Transaction>('/transactions', transaction);
  }

  public updateTransaction(id: string, transaction: Partial<Transaction>): Observable<ApiResponse<Transaction>> {
    return this.apiService.put<Transaction>(`/transactions/${id}`, transaction);
  }

  public deleteTransaction(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`/transactions/${id}`);
  }

  public getMonthlyResult(request: GetMonthlyResultRequest): Observable<ApiResponse<GetMonthlyResultResponse>> {
    return this.apiService.get<GetMonthlyResultResponse>(
      '/kakeibo/monthly-result',
      { userId: request.userId }
    ).pipe(
      map(response => {
        // TODO: API実装後は削除
        response.data = this.generateMockMonthlyResult();
        return response;
      })
    );
  }

  // TODO: API実装後は削除
  private generateMockMonthlyData(year: number, month: number): MonthlyDataResponse {
    const dailySummaries: DailySummary[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    const mockCategories: Category[] = [
      { id: '1', name: '給料', icon: 'payments', type: TransactionType.INCOME },
      { id: '2', name: '副業', icon: 'work', type: TransactionType.INCOME },
      { id: '3', name: '食費', icon: 'restaurant', type: TransactionType.EXPENSE },
      { id: '4', name: '交通費', icon: 'train', type: TransactionType.EXPENSE },
      { id: '5', name: '娯楽', icon: 'sports_esports', type: TransactionType.EXPENSE },
      { id: '6', name: '光熱費', icon: 'lightbulb', type: TransactionType.EXPENSE },
    ];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const transactions: Transaction[] = [];

      if (Math.random() > 0.5) {
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

        if (Math.random() > 0.3) {
          const expenseCategories = mockCategories.filter(c => c.type === TransactionType.EXPENSE);
          const expenseCategory = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
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

    return { year, month, dailySummaries };
  }

  // TODO: API実装後は削除
  private generateMockMonthlyResult(): GetMonthlyResultResponse {
    const formatMonth = (date: Date): string => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    };

    const now = new Date();
    const currentMonth = formatMonth(now);
    const lastMonth = formatMonth(new Date(now.getFullYear(), now.getMonth() - 1));
    const twoMonthsAgo = formatMonth(new Date(now.getFullYear(), now.getMonth() - 2));

    return {
      monthlyExpenses: [
        {
          usedMonth: currentMonth,
          categoryReportItems: [
            { categoryName: '食費', totalAmount: 45000 },
            { categoryName: '交通費', totalAmount: 15000 },
            { categoryName: '娯楽', totalAmount: 20000 },
            { categoryName: '光熱費', totalAmount: 12000 },
            { categoryName: '通信費', totalAmount: 8000 },
          ]
        },
        {
          usedMonth: lastMonth,
          categoryReportItems: [
            { categoryName: '食費', totalAmount: 42000 },
            { categoryName: '交通費', totalAmount: 18000 },
            { categoryName: '娯楽', totalAmount: 15000 },
            { categoryName: '光熱費', totalAmount: 11000 },
            { categoryName: '通信費', totalAmount: 8000 },
          ]
        },
        {
          usedMonth: twoMonthsAgo,
          categoryReportItems: [
            { categoryName: '食費', totalAmount: 48000 },
            { categoryName: '交通費', totalAmount: 16000 },
            { categoryName: '娯楽', totalAmount: 25000 },
            { categoryName: '光熱費', totalAmount: 13000 },
            { categoryName: '通信費', totalAmount: 8000 },
          ]
        }
      ],
      monthlyIncomes: [
        {
          usedMonth: currentMonth,
          categoryReportItems: [
            { categoryName: '給料', totalAmount: 250000 },
            { categoryName: '副業', totalAmount: 30000 },
          ]
        },
        {
          usedMonth: lastMonth,
          categoryReportItems: [
            { categoryName: '給料', totalAmount: 250000 },
            { categoryName: '副業', totalAmount: 25000 },
          ]
        },
        {
          usedMonth: twoMonthsAgo,
          categoryReportItems: [
            { categoryName: '給料', totalAmount: 250000 },
            { categoryName: '副業', totalAmount: 20000 },
          ]
        }
      ]
    };
  }
}
