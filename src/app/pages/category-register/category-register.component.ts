import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { RegistCategoryRequest, IconData } from '../../models/kakeibo.model';
import { TransactionType } from '../../models/enums';

@Component({
  selector: 'app-category-register',
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, MatIconModule],
  templateUrl: './category-register.component.html',
  styleUrl: './category-register.component.scss'
})
export class CategoryRegisterComponent implements OnInit {
  public categoryForm!: FormGroup;
  public availableIcons: IconData[] = [];
  public filteredIcons: IconData[] = [];
  public isLoading = false;
  public isLoadingIcons = true;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;
  public selectedIcon: string | null = null;
  public readonly TransactionType = TransactionType; // テンプレートから参照するため

  constructor(
    private formBuilder: FormBuilder,
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

  // カテゴリを作成
  public onSubmit(): void {
    // バリデーションエラーがある場合は処理を中断
    if (this.categoryForm.invalid) {
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    const request: RegistCategoryRequest = {
      userId: user.userId,
      categoryName: this.categoryForm.value.name,
      inoutFlg: this.categoryForm.value.inoutFlg,
      iconName: this.categoryForm.value.icon
    };

    this.categoryService.createCategory(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status) {
          this.successMessage = 'カテゴリを作成しました';
          // 2秒後にカテゴリ一覧画面に遷移
          setTimeout(() => {
            this.router.navigate(['/categories']);
          }, 2000);
        } else {
          this.errorMessage = response.message || 'カテゴリの作成に失敗しました';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'カテゴリの作成に失敗しました。もう一度お試しください。';
        console.error('Create category error:', error);
      }
    });
  }

  // カテゴリ一覧画面に戻る
  public navigateToCategories(): void {
    this.router.navigate(['/categories']);
  }
}
