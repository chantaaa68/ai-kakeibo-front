import { Component, OnInit, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ReportService } from '../../../services/report.service';
import {
  CategoryTrendResponse,
  TrendItem,
  TransactionItem,
  ChartData
} from '../../../models/report.model';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {
  private reportService = inject(ReportService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  // State管理 (Signals)
  allData = signal<CategoryTrendResponse | null>(null);
  selectedYearMonth = signal<string>('');
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  // グラフ設定
  colorScheme: string[] = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#5856D6'];

  view: [number, number] = [0, 300]; // 幅は動的に設定

  // Computed Signals

  // 表示するグラフデータ（レスポンシブ対応）
  displayedChartData = computed(() => {
    const data = this.allData();
    if (!data) return [];

    // ngx-charts用のデータ形式に変換
    const chartData: ChartData[] = data.trends.map(trend => ({
      name: trend.label,
      value: trend.amount,
      extra: { yearMonth: trend.yearMonth }
    }));

    // レスポンシブ対応: 画面幅に応じて表示する棒の数を調整
    if (isPlatformBrowser(this.platformId)) {
      const width = window.innerWidth;
      if (width < 768) {
        // スマホ: 最新6本
        return chartData.slice(-6);
      } else if (width < 1024) {
        // タブレット: 最新12本
        return chartData.slice(-12);
      }
    }

    // PC: 全件表示
    return chartData;
  });

  // 選択された月の明細をフィルタリング
  filteredTransactions = computed(() => {
    const data = this.allData();
    const selectedMonth = this.selectedYearMonth();

    if (!data || !selectedMonth) return [];

    // selectedYearMonthに一致する取引のみを抽出
    return data.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.usedDate);
      const transactionYearMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}-01`;
      return transactionYearMonth === selectedMonth;
    });
  });

  // 選択された月の合計金額
  selectedMonthTotal = computed(() => {
    const transactions = this.filteredTransactions();
    return transactions.reduce((sum, t) => sum + t.itemAmount, 0);
  });

  // 選択された月のラベル
  selectedMonthLabel = computed(() => {
    const data = this.allData();
    const selectedMonth = this.selectedYearMonth();

    if (!data || !selectedMonth) return '';

    const trend = data.trends.find(t => t.yearMonth === selectedMonth);
    return trend ? trend.label : '';
  });

  ngOnInit(): void {
    // URLパラメータからカテゴリIDを取得
    const categoryId = this.route.snapshot.paramMap.get('id');

    if (!categoryId) {
      this.errorMessage.set('カテゴリIDが指定されていません');
      this.isLoading.set(false);
      return;
    }

    // データ取得
    this.loadCategoryTrend(categoryId);

    // ウィンドウリサイズ時の対応
    if (isPlatformBrowser(this.platformId)) {
      this.updateChartSize();
      window.addEventListener('resize', () => this.updateChartSize());
    }
  }

  /**
   * カテゴリ別トレンドデータを取得
   */
  private loadCategoryTrend(categoryId: string): void {
    this.isLoading.set(true);

    const categoryIdNum = parseInt(categoryId, 10);
    if (isNaN(categoryIdNum)) {
      this.errorMessage.set('無効なカテゴリIDです');
      this.isLoading.set(false);
      return;
    }

    this.reportService.getCategoryTrend(categoryIdNum).subscribe({
      next: (data) => {
        this.allData.set(data);

        // 初期表示: 最新の月を選択
        if (data.trends.length > 0) {
          const latestTrend = data.trends[data.trends.length - 1];
          this.selectedYearMonth.set(latestTrend.yearMonth);
        }

        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('レポートデータの取得に失敗しました:', error);
        this.errorMessage.set(error.message || 'データの取得に失敗しました');
        this.isLoading.set(false);

        // エラーをポップアップ表示
        alert(this.errorMessage());
      }
    });
  }

  /**
   * グラフをタップしたときの処理
   */
  onSelect(event: ChartData): void {
    if (event.extra?.yearMonth) {
      this.selectedYearMonth.set(event.extra.yearMonth);
    }
  }

  /**
   * グラフサイズを更新
   */
  private updateChartSize(): void {
    if (isPlatformBrowser(this.platformId)) {
      const width = window.innerWidth;
      this.view = [width * 0.9, 300];
    }
  }

  /**
   * 戻るボタン
   */
  goBack(): void {
    this.router.navigate(['/categories']);
  }

  /**
   * 日付をフォーマット
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  /**
   * 金額をフォーマット
   */
  formatAmount(amount: number): string {
    return amount.toLocaleString('ja-JP');
  }
}
