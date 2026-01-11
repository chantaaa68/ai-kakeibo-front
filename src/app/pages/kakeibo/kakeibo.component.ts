import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { KakeiboService } from '../../services/kakeibo.service';
import { CalendarComponent } from './components/calendar/calendar.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { DailySummary, Transaction } from '../../models/kakeibo.model';

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

    this.kakeiboService.getMonthlyData({
      kakeiboId: '1', // モックデータ用
      year: this.currentYear,
      month: this.currentMonth
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status && response.data) {
          this.dailySummaries = response.data.dailySummaries;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Failed to load monthly data:', error);
      }
    });
  }

  // 日付選択時
  public onDateSelected(date: Date): void {
    this.selectedDate = date;

    // 選択された日付の取引を取得
    const summary = this.dailySummaries.find(s => {
      const summaryDate = new Date(s.date);
      return summaryDate.getFullYear() === date.getFullYear() &&
             summaryDate.getMonth() === date.getMonth() &&
             summaryDate.getDate() === date.getDate();
    });

    this.selectedTransactions = summary?.transactions || [];
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
