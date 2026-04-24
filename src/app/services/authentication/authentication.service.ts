import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ChangePasswordRequest } from '@models/auth/requests/change-password.request';
import { ConfirmEmailAndSetPasswordRequest } from '@models/auth/requests/confirm-email-and-set-password.request';
import { ForgotPasswordRequest } from '@models/auth/requests/forgot-password.request';
import { LogoutRequest } from '@models/auth/requests/logout.request';
import { RefreshTokenRequest } from '@models/auth/requests/refresh-token.request';
import { ResetPasswordRequest } from '@models/auth/requests/reset-password.request';
import { LoginRequest } from '@models/login/requests/login.request';
import { LoginResponse } from '@models/login/responses/login.response';
import { MenuService } from '@services/menu/menu.service';
import { SessionService } from '@services/session/session.service';
import { map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly httpService = inject(HttpClient);
  private readonly menuService = inject(MenuService);
  private readonly sessionService = inject(SessionService);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.httpService.post<LoginResponse>(`${this.baseUrl}/login`, request).pipe(
      tap((response) => {
        this.sessionService.setSession(response);
      }),
      switchMap((response) => this.menuService.loadMenus().pipe(map(() => response))),
    );
  }

  refreshToken(refreshToken: string): Observable<LoginResponse> {
    const payload: RefreshTokenRequest = {
      refreshToken,
    };

    return this.httpService.post<LoginResponse>(`${this.baseUrl}/refresh`, payload).pipe(
      tap((response) => {
        this.sessionService.setSession(response);
      }),
    );
  }

  resetPassword(request: ResetPasswordRequest): Observable<void> {
    return this.httpService.post<void>(`${this.baseUrl}/reset-password`, request);
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.httpService.post<void>(`${this.baseUrl}/change-password`, request);
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<{ message: string }> {
    return this.httpService.post<{ message: string }>(`${this.baseUrl}/forgot-password`, request);
  }

  confirmEmailAndSetPassword(request: ConfirmEmailAndSetPasswordRequest): Observable<void> {
    return this.httpService.post<void>(`${this.baseUrl}/confirm-email-and-set-password`, request);
  }

  logoutRequest(): Observable<void> {
    const refreshToken = this.sessionService.getRefreshToken();

    if (!refreshToken) {
      return of(void 0);
    }

    const payload: LogoutRequest = {
      refreshToken,
    };

    return this.httpService.post<void>(`${this.baseUrl}/logout`, payload);
  }

  logout(): void {
    this.sessionService.clearSession();
  }

  isLoggedIn(): boolean {
    return this.sessionService.isLoggedIn();
  }

  userId(): string {
    return this.sessionService.getUserId() ?? '';
  }
}
