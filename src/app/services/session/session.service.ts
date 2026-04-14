import { Injectable } from '@angular/core';
import { LoginResponse } from '@models/login/responses/login.response';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly accessTokenKey = 'accessToken';
  private readonly refreshTokenKey = 'refreshToken';
  private readonly userIdKey = 'userId';

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.refreshTokenKey);
  }

  getUserId(): string | null {
    return sessionStorage.getItem(this.userIdKey);
  }

  setSession(response: LoginResponse): void {
    sessionStorage.setItem(this.accessTokenKey, response.accessToken);
    sessionStorage.setItem(this.refreshTokenKey, response.refreshToken);
    sessionStorage.setItem(this.userIdKey, response.userId);
  }

  clearSession(): void {
    sessionStorage.removeItem(this.accessTokenKey);
    sessionStorage.removeItem(this.refreshTokenKey);
    sessionStorage.removeItem(this.userIdKey);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
}
