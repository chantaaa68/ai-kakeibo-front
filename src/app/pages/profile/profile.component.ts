import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UpdateUserRequest } from '../../models/user.model';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  public profileForm!: FormGroup;
  public isLoading = false;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    // 認証チェック
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const currentUser = this.authService.getCurrentUser();

    // フォームを初期化
    this.profileForm = this.formBuilder.group({
      name: [currentUser?.userName || '', [Validators.required, Validators.minLength(2)]],
      email: [currentUser?.email || '', [Validators.required, Validators.email]],
      kakeiboName: [currentUser?.kakeiboName || ''],
      kakeiboExplanation: [currentUser?.kakeiboExplanation || ''],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // フォームコントロールへのアクセスを簡略化
  public get name() {
    return this.profileForm.get('name');
  }

  public get email() {
    return this.profileForm.get('email');
  }

  public get currentPassword() {
    return this.profileForm.get('currentPassword');
  }

  public get newPassword() {
    return this.profileForm.get('newPassword');
  }

  public get confirmPassword() {
    return this.profileForm.get('confirmPassword');
  }

  public get kakeiboName() {
    return this.profileForm.get('kakeiboName');
  }

  public get kakeiboExplanation() {
    return this.profileForm.get('kakeiboExplanation');
  }

  // パスワード一致バリデーター
  private passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (!newPassword || !confirmPassword) {
      return null;
    }

    // 新しいパスワードが入力されている場合のみチェック
    if (newPassword.value && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  // ユーザー情報を更新
  public onSubmit(): void {
    // バリデーションエラーがある場合は処理を中断
    if (this.profileForm.invalid) {
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
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

    const request: UpdateUserRequest = {
      userId: user.userId,
      userName: this.profileForm.value.name || null,
      email: this.profileForm.value.email || null,
      kakeiboName: this.profileForm.value.kakeiboName || null,
      kakeiboExplanation: this.profileForm.value.kakeiboExplanation || null
    };

    // TODO: パスワード変更機能は別途実装が必要
    // パスワード変更が入力されている場合はuserHashをハッシュ化して送信する必要がある

    this.userService.updateUser(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status) {
          this.successMessage = 'ユーザー情報を更新しました';
          // パスワードフィールドをクリア
          this.profileForm.patchValue({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        } else {
          this.errorMessage = response.message || 'ユーザー情報の更新に失敗しました';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'ユーザー情報の更新に失敗しました。もう一度お試しください。';
        console.error('Update user error:', error);
      }
    });
  }

  // 家計簿画面に戻る
  public navigateToKakeibo(): void {
    this.router.navigate(['/kakeibo']);
  }
}
