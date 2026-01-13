import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { UpdateCategoryRequest, IconData, CategoryItem } from '../../models/kakeibo.model';
import { TransactionType } from '../../models/enums';

@Component({
  selector: 'app-category-edit',
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, MatIconModule],
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.scss'
})
export class CategoryEditComponent implements OnInit {
  public categoryForm!: FormGroup;
  public availableIcons: IconData[] = [];
  public filteredIcons: IconData[] = [];
  public isLoading = false;
  public isLoadingIcons = true;
  public isLoadingCategory = true;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;
  public selectedIcon: string | null = null;
  public categoryId: number | null = null;
  public currentCategory: CategoryItem | null = null;
  public readonly TransactionType = TransactionType; // テンプレートから参照するため

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    // 認証チェック
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // ルートパラメータからカテゴリIDを取得
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.categoryId = parseInt(id, 10);
        this.loadCategoryData();
      } else {
        this.errorMessage = 'カテゴリIDが指定されていません';
        this.isLoadingCategory = false;
      }
    });

    // フォームを初期化
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      inoutFlg: [false, [Validators.required]], // false=支出、true=収入
      icon: ['', [Validators.required]]
    });

    // アイコン一覧を読み込み
    this.loadAvailableIcons();
  }

  // フォームコントロールへのアクセスを簡略化
  public get name() {
    return this.categoryForm.get('name');
  }

  public get inoutFlg() {
    return this.categoryForm.get('inoutFlg');
  }

  public get icon() {
    return this.categoryForm.get('icon');
  }

  // カテゴリデータを読み込み
  private loadCategoryData(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.isLoadingCategory = true;
    this.categoryService.getCategories(user.userId, false).subscribe({
      next: (response) => {
        this.isLoadingCategory = false;
        if (response.status && response.result?.categories) {
          // カテゴリIDで該当カテゴリを検索
          const category = response.result.categories.find(c => c.id === this.categoryId);
          if (category) {
            this.currentCategory = category;
            this.selectedIcon = category.iconName;
            // フォームに既存のデータを設定
            this.categoryForm.patchValue({
              name: category.categoryName,
              inoutFlg: category.inoutFlg,
              icon: category.iconName
            });
          } else {
            this.errorMessage = '指定されたカテゴリが見つかりませんでした';
          }
        } else {
          this.errorMessage = 'カテゴリの取得に失敗しました';
        }
      },
      error: (error) => {
        this.isLoadingCategory = false;
        this.errorMessage = 'カテゴリの取得に失敗しました';
        console.error('Failed to load category:', error);
      }
    });
  }

  // 利用可能なアイコン一覧を読み込み
  private loadAvailableIcons(): void {
    this.isLoadingIcons = true;

    this.categoryService.getAvailableIcons().subscribe({
      next: (response) => {
        this.isLoadingIcons = false;
        if (response.status && response.result) {
          this.availableIcons = response.result.iconDatas;
          this.filteredIcons = this.availableIcons;
        }
      },
      error: (error) => {
        this.isLoadingIcons = false;
        console.error('Failed to load icons:', error);
      }
    });
  }

  // アイコンを選択
  public selectIcon(iconName: string): void {
    this.selectedIcon = iconName;
    this.categoryForm.patchValue({ icon: iconName });
  }

  // カテゴリを更新
  public onSubmit(): void {
    // バリデーションエラーがある場合は処理を中断
    if (this.categoryForm.invalid) {
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (!this.categoryId) {
      this.errorMessage = 'カテゴリIDが指定されていません';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const request: UpdateCategoryRequest = {
      id: this.categoryId,
      categoryName: this.categoryForm.value.name,
      inoutFlg: this.categoryForm.value.inoutFlg,
      iconName: this.categoryForm.value.icon
    };

    this.categoryService.updateCategory(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status) {
          this.successMessage = 'カテゴリを更新しました';
          // 2秒後にカテゴリ一覧画面に遷移
          setTimeout(() => {
            this.router.navigate(['/categories']);
          }, 2000);
        } else {
          this.errorMessage = response.message || 'カテゴリの更新に失敗しました';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'カテゴリの更新に失敗しました。もう一度お試しください。';
        console.error('Update category error:', error);
      }
    });
  }

  // カテゴリ一覧画面に戻る
  public navigateToCategories(): void {
    this.router.navigate(['/categories']);
  }
}
