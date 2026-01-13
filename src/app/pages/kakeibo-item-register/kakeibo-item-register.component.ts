import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { KakeiboService } from '../../services/kakeibo.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { RegistKakeiboItemRequest, CategoryItem } from '../../models/kakeibo.model';

// 頻度の選択肢
interface FrequencyOption {
  value: number;
  label: string;
  days?: number;    // 日数で計算する場合
  months?: number;  // 月数で計算する場合
  years?: number;   // 年数で計算する場合
}

@Component({
  selector: 'app-kakeibo-item-register',
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, MatIconModule],
  templateUrl: './kakeibo-item-register.component.html',
  styleUrl: './kakeibo-item-register.component.scss'
})
export class KakeiboItemRegisterComponent implements OnInit {
  public itemForm!: FormGroup;
  public categories: CategoryItem[] = [];
  public filteredCategories: CategoryItem[] = [];
  public isLoading = false;
  public isLoadingCategories = true;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;
  public showFixedEndDate = false;

  // 頻度の選択肢
  public readonly frequencyOptions: FrequencyOption[] = [
    { value: 0, label: '1回限り' },
    { value: 1, label: '毎日', days: 1 },
    { value: 2, label: '1週間', days: 7 },
    { value: 3, label: '2週間', days: 14 },
    { value: 4, label: '3週間', days: 21 },
    { value: 5, label: '1か月', months: 1 },
    { value: 6, label: '2か月', months: 2 },
    { value: 7, label: '3か月', months: 3 },
    { value: 8, label: '4か月', months: 4 },
    { value: 9, label: '5か月', months: 5 },
    { value: 10, label: '6か月', months: 6 },
    { value: 11, label: '1年', years: 1 }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private categoryService: CategoryService,
    private kakeiboService: KakeiboService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    // 認証チェック
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // フォームを初期化
    const today = new Date();
    const todayStr = this.formatDateForInput(today);

    this.itemForm = this.formBuilder.group({
      itemName: ['', [Validators.required, Validators.minLength(1)]],
      itemAmount: [0, [Validators.required, Validators.min(1)]],
      inoutFlg: [false, [Validators.required]], // false=支出、true=収入
      usedDate: [todayStr, [Validators.required]],
      categoryId: ['', [Validators.required]],
      frequency: [0, [Validators.required]],
      fixedEndDate: ['']
    });

    // 頻度の変更を監視してfixedEndDateの表示を切り替え
    this.itemForm.get('frequency')?.valueChanges.subscribe(frequency => {
      this.onFrequencyChange(frequency);
    });

    // 収支フラグの変更を監視してカテゴリをフィルタリング
    this.itemForm.get('inoutFlg')?.valueChanges.subscribe(() => {
      this.filterCategories();
    });

    // カテゴリ一覧を読み込み
    this.loadCategories();
  }

  // フォームコントロールへのアクセスを簡略化
  public get itemName() {
    return this.itemForm.get('itemName');
  }

  public get itemAmount() {
    return this.itemForm.get('itemAmount');
  }

  public get inoutFlg() {
    return this.itemForm.get('inoutFlg');
  }

  public get usedDate() {
    return this.itemForm.get('usedDate');
  }

  public get categoryId() {
    return this.itemForm.get('categoryId');
  }

  public get frequency() {
    return this.itemForm.get('frequency');
  }

  public get fixedEndDate() {
    return this.itemForm.get('fixedEndDate');
  }

  // カテゴリ一覧を読み込み
  private loadCategories(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.isLoadingCategories = true;
    this.categoryService.getCategories(user.userId, false).subscribe({
      next: (response) => {
        this.isLoadingCategories = false;
        if (response.status && response.result?.categories) {
          this.categories = response.result.categories;
          this.filterCategories();
        }
      },
      error: (error) => {
        this.isLoadingCategories = false;
        console.error('Failed to load categories:', error);
        this.errorMessage = 'カテゴリの取得に失敗しました';
      }
    });
  }

  // カテゴリをフィルタリング（収支フラグに基づく）
  private filterCategories(): void {
    const inoutFlg = this.itemForm.get('inoutFlg')?.value;
    this.filteredCategories = this.categories.filter(c => c.inoutFlg === inoutFlg);

    // フィルタリング後にカテゴリIDが無効になった場合はクリア
    const currentCategoryId = this.itemForm.get('categoryId')?.value;
    if (currentCategoryId && !this.filteredCategories.find(c => c.id === parseInt(currentCategoryId))) {
      this.itemForm.patchValue({ categoryId: '' });
    }
  }

  // 頻度の変更時の処理
  private onFrequencyChange(frequency: number): void {
    this.showFixedEndDate = frequency !== 0;

    if (this.showFixedEndDate) {
      // fixedEndDateを必須に設定
      this.itemForm.get('fixedEndDate')?.setValidators([Validators.required]);

      // 初期値を計算
      const initialDate = this.calculateFixedEndDate(frequency);
      this.itemForm.patchValue({ fixedEndDate: initialDate });
    } else {
      // fixedEndDateの必須を解除
      this.itemForm.get('fixedEndDate')?.clearValidators();
      this.itemForm.patchValue({ fixedEndDate: '' });
    }

    this.itemForm.get('fixedEndDate')?.updateValueAndValidity();
  }

  // fixedEndDateの初期値を計算
  private calculateFixedEndDate(frequency: number): string {
    const option = this.frequencyOptions.find(o => o.value === frequency);
    if (!option) return '';

    const today = new Date();
    let endDate = new Date(today);

    if (option.days) {
      endDate.setDate(endDate.getDate() + option.days);
    } else if (option.months) {
      endDate.setMonth(endDate.getMonth() + option.months);
    } else if (option.years) {
      endDate.setFullYear(endDate.getFullYear() + option.years);
    }

    return this.formatDateForInput(endDate);
  }

  // 日付をinput[type="date"]の形式に変換
  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 日付をISO文字列に変換（バックエンド用）
  private formatDateForApi(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toISOString();
  }

  // アイテムを登録
  public onSubmit(): void {
    // バリデーションエラーがある場合は処理を中断
    if (this.itemForm.invalid) {
      Object.keys(this.itemForm.controls).forEach(key => {
        this.itemForm.get(key)?.markAsTouched();
      });
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formValue = this.itemForm.value;
    const request: RegistKakeiboItemRequest = {
      kakeiboId: user.kakeiboId,
      itemName: formValue.itemName,
      itemAmount: parseInt(formValue.itemAmount, 10),
      inoutFlg: formValue.inoutFlg,
      usedDate: this.formatDateForApi(formValue.usedDate),
      categoryId: parseInt(formValue.categoryId, 10),
      frequency: formValue.frequency,
      fixedEndDate: formValue.fixedEndDate ? this.formatDateForApi(formValue.fixedEndDate) : null
    };

    this.kakeiboService.createTransaction(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status) {
          this.successMessage = '家計簿アイテムを登録しました';
          // 2秒後に家計簿画面に遷移
          setTimeout(() => {
            this.router.navigate(['/kakeibo']);
          }, 2000);
        } else {
          this.errorMessage = response.message || '家計簿アイテムの登録に失敗しました';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = '家計簿アイテムの登録に失敗しました。もう一度お試しください。';
        console.error('Create kakeibo item error:', error);
      }
    });
  }

  // 家計簿画面に戻る
  public navigateToKakeibo(): void {
    this.router.navigate(['/kakeibo']);
  }
}
