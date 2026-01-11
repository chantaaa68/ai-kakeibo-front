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
  CategoryReportItem,
  TransactionType,
  Transaction
} from '../../models/kakeibo.model';

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
  // 表示タイプ（収入/支出）
  public displayType: 'expense' | 'income' = 'expense';
  public TransactionType = TransactionType;

  // データ
  public monthlyData: GetMonthlyResultResponse | null = null;
  public availableMonths: string[] = [];
  public selectedMonth: string = '';

  // 選択された月のデータ
  public currentMonthData: MonthlyReportItem | null = null;

  // 円グラフ用データ
  public chartData: Array<{ name: string; value: number }> = [];
  public colorScheme: string = 'vivid';

  // 選択されたカテゴリの詳細
  public selectedCategory: string | null = null;
  public selectedTransactions: Transaction[] = [];

  public isLoading = true;

  constructor(
    private authService: AuthService,
    private kakeiboService: KakeiboService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    // 認証チェック
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // 月間レポートデータを読み込み
    this.loadMonthlyReport();
  }

  // 月間レポートデータを読み込み
  private loadMonthlyReport(): void {
    this.isLoading = true;
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.kakeiboService.getMonthlyResult({
      userId: parseInt(user.id, 10)
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status && response.data) {
          this.monthlyData = response.data;
          this.initializeMonthSelection();
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Failed to load monthly report:', error);
      }
    });
  }

  // 月の選択肢を初期化
  private initializeMonthSelection(): void {
    if (!this.monthlyData) return;

    // 支出データから利用可能な月を取得
    this.availableMonths = this.displayType === 'expense'
      ? this.monthlyData.monthlyExpenses.map(item => item.usedMonth)
      : this.monthlyData.monthlyIncomes.map(item => item.usedMonth);

    // 最新の月を選択
    if (this.availableMonths.length > 0) {
      this.selectedMonth = this.availableMonths[0];
      this.updateChartData();
    }
  }

  // 表示タイプ切り替え（収入/支出）
  public toggleDisplayType(): void {
    this.displayType = this.displayType === 'expense' ? 'income' : 'expense';
    this.selectedCategory = null;
    this.selectedTransactions = [];
    this.initializeMonthSelection();
  }

  // 月変更時
  public onMonthChange(): void {
    this.selectedCategory = null;
    this.selectedTransactions = [];
    this.updateChartData();
  }

  // 円グラフデータを更新
  private updateChartData(): void {
    if (!this.monthlyData) return;

    const monthlyItems = this.displayType === 'expense'
      ? this.monthlyData.monthlyExpenses
      : this.monthlyData.monthlyIncomes;

    this.currentMonthData = monthlyItems.find(item => item.usedMonth === this.selectedMonth) || null;

    if (this.currentMonthData) {
      this.chartData = this.currentMonthData.categoryReportItems.map(item => ({
        name: item.categoryName,
        value: item.totalAmount
      }));
    } else {
      this.chartData = [];
    }
  }

  // カテゴリ選択時
  public onCategorySelect(categoryName: string): void {
    this.selectedCategory = categoryName;

    // モックの取引データを生成（本来はAPIから取得）
    this.selectedTransactions = this.generateMockTransactions(categoryName);
  }

  // カテゴリアイコンを取得
  public getCategoryIcon(categoryName: string): string {
    const iconMap: { [key: string]: string } = {
      '食費': 'restaurant',
      '交通費': 'train',
      '娯楽': 'sports_esports',
      '光熱費': 'lightbulb',
      '通信費': 'phone',
      '給料': 'payments',
      '副業': 'work',
      'その他': 'category'
    };
    return iconMap[categoryName] || 'category';
  }

  // 金額をフォーマット
  public formatAmount(amount: number): string {
    return amount.toLocaleString('ja-JP');
  }

  // 月をフォーマット（yyyy-mm → yyyy年m月）
  public formatMonth(month: string): string {
    const [year, monthNum] = month.split('-');
    return `${year}年${parseInt(monthNum, 10)}月`;
  }

  // 合計金額を計算
  public getTotalAmount(): number {
    if (!this.currentMonthData) return 0;
    return this.currentMonthData.categoryReportItems.reduce((sum, item) => sum + item.totalAmount, 0);
  }

  // モックの取引データを生成（開発用）
  private generateMockTransactions(categoryName: string): Transaction[] {
    const type = this.displayType === 'expense' ? TransactionType.EXPENSE : TransactionType.INCOME;
    const icon = this.getCategoryIcon(categoryName);

    const mockTransactions: Transaction[] = [];
    const numTransactions = Math.floor(Math.random() * 5) + 3;

    for (let i = 0; i < numTransactions; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      const [year, month] = this.selectedMonth.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, day);

      mockTransactions.push({
        id: `mock-${i}`,
        kakeiboId: '1',
        date: date,
        name: `${categoryName}の支払い ${i + 1}`,
        amount: Math.floor(Math.random() * 5000) + 500,
        type: type,
        category: {
          id: `cat-${i}`,
          name: categoryName,
          icon: icon,
          type: type
        }
      });
    }

    // 日付順にソート
    return mockTransactions.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}
