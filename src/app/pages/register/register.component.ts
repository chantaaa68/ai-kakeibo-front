import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;
  public isLoading = false;
  public errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    // フォームを初期化
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      kakeiboName: ['My家計簿', [Validators.required]], // 家計簿名（必須）
      kakeiboDescription: [''] // 家計簿説明（任意項目）
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // フォームコントロールへのアクセスを簡略化
  public get name() {
    return this.registerForm.get('name');
  }

  public get email() {
    return this.registerForm.get('email');
  }

  public get password() {
    return this.registerForm.get('password');
  }

  public get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  public get kakeiboName() {
    return this.registerForm.get('kakeiboName');
  }

  public get kakeiboDescription() {
    return this.registerForm.get('kakeiboDescription');
  }

  // パスワード一致バリデーター
  private passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  // 新規登録処理
  public onSubmit(): void {
    // バリデーションエラーがある場合は処理を中断
    if (this.registerForm.invalid) {
      // 全てのフィールドをタッチ状態にしてエラーを表示
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // パスワードをSHA-256でハッシュ化してからリクエスト
    this.hashPassword(this.registerForm.value.password).then(hashedPassword => {
      const request: RegisterRequest = {
        userName: this.registerForm.value.name,
        userHash: hashedPassword,
        email: this.registerForm.value.email,
        kakeiboName: this.registerForm.value.kakeiboName,
        kakeiboExplanation: this.registerForm.value.kakeiboDescription || ''
      };

      this.authService.register(request).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.status) {
            // 登録成功、家計簿画面に遷移
            this.router.navigate(['/kakeibo']);
          } else {
            // 登録失敗
            this.errorMessage = response.message || '登録に失敗しました';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = '登録に失敗しました。もう一度お試しください。';
          console.error('Register error:', error);
        }
      });
    });
  }

  // パスワードをSHA-256でハッシュ化
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ログイン画面に遷移
  public navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  // ホーム画面に戻る
  public navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
