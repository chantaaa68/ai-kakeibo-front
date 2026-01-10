import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private router: Router) {}

  // ログイン画面に遷移
  public navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  // 新規登録画面に遷移
  public navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
