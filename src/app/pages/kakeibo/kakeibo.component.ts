import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { KakeiboService } from '../../services/kakeibo.service';
import { CalendarComponent } from './components/calendar/calendar.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { DailySummary, Transaction, GetKakeiboItemListResponse } from '../../models/kakeibo.model';
import { ApiResponse } from '../../models/api-response.model';

@Component({
  selector: 'app-kakeibo',
  imports: [CommonModule, CalendarComponent, TransactionListComponent, HeaderComponent],
  templateUrl: './kakeibo.component.html',
  styleUrl: './kakeibo.component.scss'
})
export class KakeiboComponent implements OnInit {
  public currentYear: number;
  public currentMonth: number;
  public dailySummaries: DailySummary[] = [];
  public selectedDate: Date | null = null;
  public selectedTransactions: Transaction[] = [];
  public isLoading = true;

  constructor(
    private authService: AuthService,
    private kakeiboService: KakeiboService,
    private router: Router
  ) {
    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth() + 1;
  }

  public ngOnInit(): void {
    // 認証チェック
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // 月次データを読み込み
    this.loadMonthlyData();
  }

  // 月次データを読み込み
  private loadMonthlyData(): void {
    this.isLoading = true;
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // yyyy-MM形式に変換
    const range = `${this.currentYear}-${String(this.currentMonth).padStart(2, '0')}`;

    this.kakeiboService.getKakeiboItemList({
      userId: user.userId,
      range: range
    }).subscribe({
      next: (response: ApiResponse<GetKakeiboItemListResponse>) => {
        this.isLoading = false;
        if (response.status && response.result) {
          this.dailySummaries = response.result.kakeiboItemInfos;
        }
      },
      error: (error: unknown) => {
        this.isLoading = false;
        console.error('Failed to load monthly data:', error);
      }
    });
  }

  // 日付選択時
  public onDateSelected(date: Date): void {
    this.selectedDate = date;

    // 選択された日付の取引を取得（dayNoは日付の日部分）
    const summary = this.dailySummaries.find(s => s.dayNo === date.getDate());

    this.selectedTransactions = summary?.items || [];
  }

  // 月変更時
  public onMonthChanged(event: { year: number; month: number }): void {
    this.currentYear = event.year;
    this.currentMonth = event.month;
    this.selectedDate = null;
    this.selectedTransactions = [];
    this.loadMonthlyData();
  }
}
