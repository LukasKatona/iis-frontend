import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStoreService } from '../services/auth-store.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

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
      if (error.status === 401 && error.error.detail === 'Could not validate credentials') {
        authStoreService.clearAuthData();
        router.navigate(['/']);
      }
      return throwError(error);
    })
  );
};
