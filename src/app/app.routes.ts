import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { KakeiboComponent } from './pages/kakeibo/kakeibo.component';

export const routes: Routes = [
  // ホーム画面（トップページ）
  {
    path: '',
    component: HomeComponent
  },
  // ログイン画面
  {
    path: 'login',
    component: LoginComponent
  },
  // 新規登録画面
  {
    path: 'register',
    component: RegisterComponent
  },
  // 家計簿画面（認証が必要）
  {
    path: 'kakeibo',
    component: KakeiboComponent
    // TODO: 認証ガードを追加
    // canActivate: [AuthGuard]
  },
  // 404ページ（該当するルートが無い場合はホームにリダイレクト）
  {
    path: '**',
    redirectTo: ''
  }
];
