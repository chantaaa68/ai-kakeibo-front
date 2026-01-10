import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CreateCategoryRequest, AvailableIcon, TransactionType } from '../../models/kakeibo.model';

@Component({
  selector: 'app-category-register',
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './category-register.component.html',
  styleUrl: './category-register.component.scss'
})
export class CategoryRegisterComponent implements OnInit {
  public categoryForm!: FormGroup;
  public availableIcons: AvailableIcon[] = [];
  public filteredIcons: AvailableIcon[] = [];
  public isLoading = false;
  public isLoadingIcons = true;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;
  public TransactionType = TransactionType;
  public selectedIcon: string | null = null;

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
      type: [TransactionType.EXPENSE, [Validators.required]],
      icon: ['', [Validators.required]]
    });

    // アイコン一覧を読み込み
    this.loadAvailableIcons();
  }

  // フォームコントロールへのアクセスを簡略化
  public get name() {
    return this.categoryForm.get('name');
  }

  public get type() {
    return this.categoryForm.get('type');
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
        if (response.status && response.data) {
          this.availableIcons = response.data;
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

    const request: CreateCategoryRequest = {
      name: this.categoryForm.value.name,
      icon: this.categoryForm.value.icon,
      type: this.categoryForm.value.type,
      userId: user.id
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
