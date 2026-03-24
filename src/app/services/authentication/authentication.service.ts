import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChangePasswordRequest } from '../../models/auth/requests/change-password.request';
import { LoginRequest } from '../../models/login/requests/login.request';
import { LoginResponse } from '../../models/login/responses/login.response';

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

  changePassword(request: ChangePasswordRequest) {
    return this.httpService.post<void>(`${this.baseUrl}/change-password`, request);
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
  }

  isLoggedIn() {
    return sessionStorage.getItem('token') !== null;
  }
}
