import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStoreService } from '../services/auth-store.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authStoreService = inject(AuthStoreService);
  const token = authStoreService.token();

  const modifiedRequest = req.clone({
    setHeaders: {
      'Authorization': `Bearer ${token}`
    }
  });

  return next(modifiedRequest).pipe(
    catchError((error) => {
      authStoreService.updateAuthError({
        message: error.error.detail,
        status: error.status
      });
      return throwError(error);
    })
  );
};
