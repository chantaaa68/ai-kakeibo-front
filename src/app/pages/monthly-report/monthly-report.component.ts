import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AuthService } from '../../services/auth.service';
import { KakeiboService } from '../../services/kakeibo.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import {
  MonthlyReportItem,
  GetMonthlyReportResponse
} from '../../models/kakeibo.model';
import { ApiResponse } from '../../models/api-response.model';

// カテゴリアイコンマッピング定数
const CATEGORY_ICON_MAP: Record<string, string> = {
  '食費': 'restaurant',
  '交通費': 'train',
  '娯楽': 'sports_esports',
  '光熱費': 'lightbulb',
  '通信費': 'phone',
  '給料': 'payments',
  '副業': 'work',
  'その他': 'category'
};

@Component({
  selector: 'app-monthly-report',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxChartsModule,
    HeaderComponent
  ],
  templateUrl: './monthly-report.component.html',
  styleUrl: './monthly-report.component.scss'
})
export class MonthlyReportComponent implements OnInit {
  public displayType: 'expense' | 'income' = 'expense';
  public monthlyData: GetMonthlyReportResponse | null = null;
  public availableMonths: string[] = [];
  public selectedMonth = '';
  public currentMonthData: MonthlyReportItem | null = null;
  public chartData: Array<{ name: string; value: number }> = [];
  public colorScheme = 'vivid';
  public isLoading = true;

  constructor(
    private authService: AuthService,
    private kakeiboService: KakeiboService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadMonthlyReport();
  }

  public toggleDisplayType(): void {
    this.displayType = this.displayType === 'expense' ? 'income' : 'expense';
    this.initializeMonthSelection();
  }

  public onMonthChange(): void {
    this.updateChartData();
  }

  public navigateToCategoryDetail(categoryId: number): void {
    this.router.navigate(['/reports/category', categoryId]);
  }

  public getCategoryIcon(categoryName: string): string {
    return CATEGORY_ICON_MAP[categoryName] || 'category';
  }

  public formatAmount(amount: number): string {
    return amount.toLocaleString('ja-JP');
  }

  public formatMonth(month: string): string {
    const [year, monthNum] = month.split('-');
    return `${year}年${parseInt(monthNum, 10)}月`;
  }

  public getTotalAmount(): number {
    if (!this.currentMonthData) return 0;
    return this.currentMonthData.categoryReportItems.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );
  }

  private loadMonthlyReport(): void {
    this.isLoading = true;
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.kakeiboService.getMonthlyReport({
      userId: user.userId
    }).subscribe({
      next: (response: ApiResponse<GetMonthlyReportResponse>) => {
        this.isLoading = false;
        if (response.status && response.result) {
          this.monthlyData = response.result;
          this.initializeMonthSelection();
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Failed to load monthly report:', error);
      }
    });
  }

  private initializeMonthSelection(): void {
    if (!this.monthlyData) return;

    const monthlyItems = this.displayType === 'expense'
      ? this.monthlyData.monthlyExpenses
      : this.monthlyData.monthlyIncomes;

    // 月を新しい順（降順）にソート
    this.availableMonths = monthlyItems
      .map(item => item.usedMonth)
      .sort((a, b) => b.localeCompare(a));

    if (this.availableMonths.length > 0) {
      // 現在の年月を取得（yyyy-MM形式）
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      // 現在の月がavailableMonthsに含まれている場合はそれを選択、なければ最新の月を選択
      this.selectedMonth = this.availableMonths.includes(currentMonth)
        ? currentMonth
        : this.availableMonths[0];

      this.updateChartData();
    }
  }

  private updateChartData(): void {
    if (!this.monthlyData) return;

    const monthlyItems = this.displayType === 'expense'
      ? this.monthlyData.monthlyExpenses
      : this.monthlyData.monthlyIncomes;

    this.currentMonthData = monthlyItems.find(
      item => item.usedMonth === this.selectedMonth
    ) || null;

    this.chartData = this.currentMonthData
      ? this.currentMonthData.categoryReportItems.map(item => ({
          name: item.categoryName,
          value: item.totalAmount
        }))
      : [];
  }
}
