import { HttpInterceptorFn } from '@angular/common/http';

// 認証トークンを追加するインターセプター
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // ローカルストレージからトークンを取得
  const token = localStorage.getItem('token');

  // トークンがある場合、リクエストヘッダーに追加
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
