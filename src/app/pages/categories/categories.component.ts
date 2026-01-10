import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { CategoryItemComponent } from '../../shared/components/category-item/category-item.component';
import { Category, TransactionType } from '../../models/kakeibo.model';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, CategoryItemComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  public categories: Category[] = [];
  public displayedCategories: Category[] = [];
  public selectedType: TransactionType = TransactionType.EXPENSE;
  public isLoading = true;
  public TransactionType = TransactionType;

  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    // 認証チェック
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadCategories();
  }

  // カテゴリ一覧を読み込み
  private loadCategories(): void {
    this.isLoading = true;
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.categoryService.getCategories(user.id).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status && response.data) {
          this.categories = response.data;
          this.filterCategories();
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Failed to load categories:', error);
      }
    });
  }

  // 表示するカテゴリをフィルタリング
  private filterCategories(): void {
    this.displayedCategories = this.categories.filter(
      category => category.type === this.selectedType
    );
  }

  // タイプを変更
  public changeType(type: TransactionType): void {
    this.selectedType = type;
    this.filterCategories();
  }

  // 新規カテゴリ登録画面に遷移
  public navigateToRegister(): void {
    this.router.navigate(['/category-register']);
  }

  // 家計簿画面に戻る
  public navigateToKakeibo(): void {
    this.router.navigate(['/kakeibo']);
  }
}
