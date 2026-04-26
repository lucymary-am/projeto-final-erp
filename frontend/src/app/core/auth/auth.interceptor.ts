import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';

let isRefreshing = false;
const refreshAccessToken$ = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = authService.getAccessToken();
  const isAuthCall = req.url.includes('/auth/login') || req.url.includes('/auth/refresh');

  const authReq =
    accessToken && !isAuthCall
      ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
      : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || isAuthCall) {
        return throwError(() => error);
      }

      const refreshToken = authService.getRefreshToken();
      if (!refreshToken) {
        authService.clearSession();
        void router.navigate(['/login']);
        return throwError(() => error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        refreshAccessToken$.next(null);

        return authService.refreshToken(refreshToken).pipe(
          switchMap((response) => {
            isRefreshing = false;
            refreshAccessToken$.next(response.accessToken);

            const retriedRequest = req.clone({
              setHeaders: { Authorization: `Bearer ${response.accessToken}` }
            });
            return next(retriedRequest);
          }),
          catchError((refreshError) => {
            isRefreshing = false;
            authService.clearSession();
            void router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }

      return refreshAccessToken$.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => {
          const retriedRequest = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
          return next(retriedRequest);
        })
      );
    })
  );
};
