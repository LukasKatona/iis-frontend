import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStoreService } from '../services/auth-store.service';
import { catchError, finalize, throwError } from 'rxjs';
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

  let numberOfRunningRequests = authStoreService.runningRequests() ?? 0;
  authStoreService.updateRunningRequests(numberOfRunningRequests+1);

  return next(modifiedRequest).pipe(
    catchError((error) => {

      if (error.status === 401 && error.error.detail === 'Could not validate credentials') {
        authStoreService.clearAuthData();
        router.navigate(['/']);
      }

      if (error.status !== 0) {
        authStoreService.updateAuthError({
          message: error.error.detail,
          status: error.status
        });
      }

      return throwError(error);
    }),
    finalize(() => {
      let numberOfRunningRequests = authStoreService.runningRequests() ?? 0;
      authStoreService.updateRunningRequests(numberOfRunningRequests-1);
    })
  );
};
