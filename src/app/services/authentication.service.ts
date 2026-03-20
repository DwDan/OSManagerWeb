import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginModel } from '../login/model/login.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private httpService = inject(HttpClient);

  login(request: LoginModel) {
    const url = 'https://localhost:44378/api/auth/login';

    return this.httpService.post<{ token: string }>(url, request).pipe(
      tap((response) => {
        sessionStorage.setItem('token', response?.token);
      }),
    );
  }

  isLoggedIn() {
    return sessionStorage.getItem('token') !== null;
  }
}
