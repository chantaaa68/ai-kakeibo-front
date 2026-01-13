import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { KakeiboComponent } from './pages/kakeibo/kakeibo.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CategoryRegisterComponent } from './pages/category-register/category-register.component';
import { CategoryEditComponent } from './pages/category-edit/category-edit.component';
import { KakeiboItemRegisterComponent } from './pages/kakeibo-item-register/kakeibo-item-register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MonthlyReportComponent } from './pages/monthly-report/monthly-report.component';
import { CategoryDetailComponent } from './pages/reports/category-detail/category-detail.component';

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
  // カテゴリ一覧画面（認証が必要）
  {
    path: 'categories',
    component: CategoriesComponent
    // TODO: 認証ガードを追加
    // canActivate: [AuthGuard]
  },
  // カテゴリ登録画面（認証が必要）
  {
    path: 'category-register',
    component: CategoryRegisterComponent
    // TODO: 認証ガードを追加
    // canActivate: [AuthGuard]
  },
  // カテゴリ編集画面（認証が必要）
  {
    path: 'category-edit/:id',
    component: CategoryEditComponent
    // TODO: 認証ガードを追加
    // canActivate: [AuthGuard]
  },
  // 家計簿アイテム登録画面（認証が必要）
  {
    path: 'kakeibo-item-register',
    component: KakeiboItemRegisterComponent
    // TODO: 認証ガードを追加
    // canActivate: [AuthGuard]
  },
  // 月間レポート画面（認証が必要）
  {
    path: 'monthly-report',
    component: MonthlyReportComponent
    // TODO: 認証ガードを追加
    // canActivate: [AuthGuard]
  },
  // ユーザー情報画面（認証が必要）
  {
    path: 'profile',
    component: ProfileComponent
    // TODO: 認証ガードを追加
    // canActivate: [AuthGuard]
  },
  // カテゴリ別レポート詳細画面（認証が必要）
  {
    path: 'reports/category/:id',
    component: CategoryDetailComponent
    // TODO: 認証ガードを追加
    // canActivate: [AuthGuard]
  },
  // 404ページ（該当するルートが無い場合はホームにリダイレクト）
  {
    path: '**',
    redirectTo: ''
  }
];
