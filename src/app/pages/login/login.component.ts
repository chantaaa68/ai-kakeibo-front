import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public isLoading = false;
  public errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    // フォームを初期化
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  // フォームコントロールへのアクセスを簡略化
  public get email() {
    return this.loginForm.get('email');
  }

  public get password() {
    return this.loginForm.get('password');
  }

  // ログイン処理
  public onSubmit(): void {
    // バリデーションエラーがある場合は処理を中断
    if (this.loginForm.invalid) {
      // 全てのフィールドをタッチ状態にしてエラーを表示
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // パスワードをSHA-256でハッシュ化してからリクエスト
    this.hashPassword(this.loginForm.value.password).then(hashedPassword => {
      const request: LoginRequest = {
        email: this.loginForm.value.email,
        userHash: hashedPassword
      };

      this.authService.login(request).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.status) {
            // ログイン成功、家計簿画面に遷移
            this.router.navigate(['/kakeibo']);
          } else {
            // ログイン失敗
            this.errorMessage = response.message || 'ログインに失敗しました';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'ログインに失敗しました。もう一度お試しください。';
          console.error('Login error:', error);
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

  // 新規登録画面に遷移
  public navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  // ホーム画面に戻る
  public navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
