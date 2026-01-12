import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { CategoryItemComponent } from '../../shared/components/category-item/category-item.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CategoryItem } from '../../models/kakeibo.model';
import { TransactionType } from '../../models/enums';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, CategoryItemComponent, HeaderComponent, MatIconModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  public categories: CategoryItem[] = [];
  public displayedCategories: CategoryItem[] = [];
  public selectedType: TransactionType = TransactionType.EXPENSE; // デフォルトは支出
  public readonly TransactionType = TransactionType; // テンプレートから参照するため
  public isLoading = true;

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

    this.categoryService.getCategories(user.userId, false).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status && response.result && response.result.categories) {
          this.categories = response.result.categories;
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
    const inoutFlg = this.selectedType === TransactionType.INCOME;
    this.displayedCategories = this.categories.filter(
      category => category.inoutFlg === inoutFlg
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
}
