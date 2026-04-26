import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginPayload } from './auth.types';
import { TokenStorageService } from './token-storage.service';
import { GoogleCredentialResponse, WindowWithGoogle } from './google.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private googleScriptLoaded = false;

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/login`, payload).pipe(
      tap((response) => this.persistSession(response))
    );
  }

  refreshToken(refreshToken: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiBaseUrl}/auth/refresh`, { refreshToken })
      .pipe(tap((response) => this.persistSession(response)));
  }

  logout(): Observable<void> {
    const refreshToken = this.tokenStorage.refreshToken;
    if (!refreshToken) {
      this.tokenStorage.clearSession();
      return of(void 0);
    }

    return this.http.post<void>(`${this.apiBaseUrl}/auth/logout`, { refreshToken }).pipe(
      tap(() => this.tokenStorage.clearSession()),
      catchError(() => {
        this.tokenStorage.clearSession();
        return throwError(() => new Error('Falha ao finalizar sessao.'));
      })
    );
  }

  loginWithGoogle(): Observable<AuthResponse> {
    if (!environment.googleClientId) {
      return throwError(
        () =>
          new Error(
            'Defina googleClientId em src/environments/environment*.ts para habilitar login Google.'
          )
      );
    }

    return this.loadGoogleScript().pipe(
      switchMap(() => this.requestGoogleCredential()),
      switchMap((googleToken) =>
        this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/google`, { credential: googleToken })
      ),
      tap((response) => this.persistSession(response))
    );
  }

  isAuthenticated(): boolean {
    return !!this.tokenStorage.accessToken && !!this.tokenStorage.refreshToken;
  }

  getAccessToken(): string | null {
    return this.tokenStorage.accessToken;
  }

  getRefreshToken(): string | null {
    return this.tokenStorage.refreshToken;
  }

  clearSession(): void {
    this.tokenStorage.clearSession();
  }

  private persistSession(response: AuthResponse): void {
    this.tokenStorage.saveSession(response.accessToken, response.refreshToken, response.usuario);
  }

  private loadGoogleScript(): Observable<void> {
    if (this.googleScriptLoaded) {
      return new Observable<void>((observer) => {
        observer.next();
        observer.complete();
      });
    }

    return new Observable<void>((observer) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.googleScriptLoaded = true;
        observer.next();
        observer.complete();
      };
      script.onerror = () => observer.error(new Error('Falha ao carregar SDK do Google.'));
      document.head.appendChild(script);
    });
  }

  private requestGoogleCredential(): Observable<string> {
    return new Observable<string>((observer) => {
      const typedWindow = window as WindowWithGoogle;
      if (!typedWindow.google?.accounts?.id) {
        observer.error(new Error('Google Identity Services indisponivel.'));
        return;
      }

      typedWindow.google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: GoogleCredentialResponse) => {
          if (!response.credential) {
            observer.error(new Error('Token do Google nao retornado.'));
            return;
          }

          observer.next(response.credential);
          observer.complete();
        }
      });

      typedWindow.google.accounts.id.prompt();
    });
  }
}
