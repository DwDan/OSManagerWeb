import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ChangeUserRoleRequest } from '@models/users/requests/change-user-role.request';
import { CreateUserRequest } from '@models/users/requests/create-user.request';
import { UpdateUserRequest } from '@models/users/requests/update-user.request';
import { UserResponse } from '@models/users/responses/user.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users`;

  create(request: CreateUserRequest): Observable<string> {
    return this.http.post<string>(this.baseUrl, request);
  }

  getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.baseUrl);
  }

  getById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/${id}`);
  }

  update(id: string, request: UpdateUserRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }

  activate(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/activate`, {});
  }

  deactivate(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/deactivate`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  confirmEmailByLink(id: string, token: string): Observable<{ message: string }> {
    const params = new HttpParams().set('token', token);

    return this.http.get<{ message: string }>(`${this.baseUrl}/${id}/confirm-email`, {
      params,
    });
  }

  resendEmailConfirmation(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/resend-email-confirmation`, {});
  }

  changeRole(id: string, request: ChangeUserRoleRequest): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/role`, request);
  }
}
