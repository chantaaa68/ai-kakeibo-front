import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

// エラーハンドリング用インターセプター
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'エラーが発生しました';

      if (error.error instanceof ErrorEvent) {
        // クライアントサイドエラー
        errorMessage = `エラー: ${error.error.message}`;
      } else {
        // サーバーサイドエラー
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'リクエストが不正です';
            break;
          case 401:
            errorMessage = '認証が必要です。再度ログインしてください';
            // トークンをクリアしてログイン画面へリダイレクト
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            router.navigate(['/login']);
            break;
          case 403:
            errorMessage = 'アクセス権限がありません';
            break;
          case 404:
            errorMessage = 'リソースが見つかりませんでした';
            break;
          case 500:
            errorMessage = 'サーバーエラーが発生しました';
            break;
          default:
            errorMessage = error.error?.message || `エラーが発生しました (${error.status})`;
        }
      }

      // スナックバーでエラーメッセージを表示
      snackBar.open(errorMessage, '閉じる', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });

      return throwError(() => error);
    })
  );
};
