import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public isUserMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // ユーザー名を取得
  public getUserName(): string {
    return this.authService.getCurrentUser()?.userName || 'ゲスト';
  }

  // ユーザーメニューの開閉
  public toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  // ユーザーメニューを閉じる
  public closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  // 家計簿画面に遷移
  public navigateToKakeibo(): void {
    this.closeUserMenu();
    this.router.navigate(['/kakeibo']);
  }

  // アイテム新規登録画面に遷移
  public navigateToKakeiboItem(): void {
    this.closeUserMenu();
    this.router.navigate(['/kakeibo-item-register']);
  }

  // カテゴリ一覧画面に遷移
  public navigateToCategories(): void {
    this.closeUserMenu();
    this.router.navigate(['/categories']);
  }

  // 月間レポート画面に遷移
  public navigateToMonthlyReport(): void {
    this.closeUserMenu();
    this.router.navigate(['/monthly-report']);
  }

  // ユーザー更新画面に遷移
  public navigateToProfile(): void {
    this.closeUserMenu();
    this.router.navigate(['/profile']);
  }

  // ログアウト
  public logout(): void {
    this.closeUserMenu();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
