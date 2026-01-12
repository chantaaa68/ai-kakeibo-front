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
import { TransactionListComponent } from '../kakeibo/components/transaction-list/transaction-list.component';
import {
  GetMonthlyResultResponse,
  MonthlyReportItem,
  KakeiboItem
} from '../../models/kakeibo.model';

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
    HeaderComponent,
    TransactionListComponent
  ],
  templateUrl: './monthly-report.component.html',
  styleUrl: './monthly-report.component.scss'
})
export class MonthlyReportComponent implements OnInit {
  public displayType: 'expense' | 'income' = 'expense';
  public monthlyData: GetMonthlyResultResponse | null = null;
  public availableMonths: string[] = [];
  public selectedMonth = '';
  public currentMonthData: MonthlyReportItem | null = null;
  public chartData: Array<{ name: string; value: number }> = [];
  public colorScheme = 'vivid';
  public selectedCategory: string | null = null;
  public selectedTransactions: KakeiboItem[] = [];
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
    this.clearCategorySelection();
    this.initializeMonthSelection();
  }

  public onMonthChange(): void {
    this.clearCategorySelection();
    this.updateChartData();
  }

  public onCategorySelect(categoryName: string): void {
    this.selectedCategory = categoryName;
    // TODO: API実装後は実際のカテゴリ詳細データを取得する
    this.selectedTransactions = this.generateMockTransactions(categoryName);
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

    this.kakeiboService.getMonthlyResult({
      userId: user.userId
    }).subscribe({
      next: (response) => {
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

    this.availableMonths = monthlyItems.map(item => item.usedMonth);

    if (this.availableMonths.length > 0) {
      this.selectedMonth = this.availableMonths[0];
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

  private clearCategorySelection(): void {
    this.selectedCategory = null;
    this.selectedTransactions = [];
  }

  // TODO: API実装後は削除
  private generateMockTransactions(categoryName: string): KakeiboItem[] {
    const inoutFlg = this.displayType === 'income'; // true=収入、false=支出
    const iconName = this.getCategoryIcon(categoryName);
    const numTransactions = Math.floor(Math.random() * 5) + 3;
    const mockTransactions: KakeiboItem[] = [];

    for (let i = 0; i < numTransactions; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      const [year, month] = this.selectedMonth.split('-');
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, day);

      mockTransactions.push({
        itemId: i,
        itemName: `${categoryName}の支払い ${i + 1}`,
        itemAmount: Math.floor(Math.random() * 5000) + 500,
        inoutFlg: inoutFlg,
        usedDate: date.toISOString(),
        iconName: iconName
      });
    }

    return mockTransactions.sort((a, b) =>
      new Date(a.usedDate).getTime() - new Date(b.usedDate).getTime()
    );
  }
}
