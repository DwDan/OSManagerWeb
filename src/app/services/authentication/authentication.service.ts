import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ChangePasswordRequest } from '@models/auth/requests/change-password.request';
import { ForgotPasswordRequest } from '@models/auth/requests/forgot-password.request';
import { ResetPasswordRequest } from '@models/auth/requests/reset-password.request';
import { LoginRequest } from '@models/login/requests/login.request';
import { LoginResponse } from '@models/login/responses/login.response';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private httpService = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  login(request: LoginRequest) {
    return this.httpService.post<LoginResponse>(`${this.baseUrl}/login`, request).pipe(
      tap((response) => {
        sessionStorage.setItem('token', response?.token);
        sessionStorage.setItem('userId', response?.userId);
      }),
    );
  }

  resetPassword(request: ResetPasswordRequest) {
    return this.httpService.post<void>(`${this.baseUrl}/reset-password`, request);
  }

  changePassword(request: ChangePasswordRequest) {
    return this.httpService.post<void>(`${this.baseUrl}/change-password`, request);
  }

  forgotPassword(request: ForgotPasswordRequest) {
    return this.httpService.post<{ message: string }>(`${this.baseUrl}/forgot-password`, request);
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
  }

  isLoggedIn() {
    return sessionStorage.getItem('token') !== null;
  }
}
