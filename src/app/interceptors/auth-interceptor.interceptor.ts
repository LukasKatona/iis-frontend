import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStoreService } from '../services/auth-store.service';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authStoreService = inject(AuthStoreService);
  const token = authStoreService.token();

  const modifiedRequest = req.clone({
    setHeaders: {
      'Authorization': `Bearer ${token}`
    }
  });

  return next(modifiedRequest);
};
