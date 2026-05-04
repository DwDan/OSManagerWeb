import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { PagedResponse } from '@models/pagination/response/paged.response';
import { ChangeUserRoleRequest } from '@models/users/requests/change-user-role.request';
import { CreateUserRequest } from '@models/users/requests/create-user.request';
import { GerUsersRequest } from '@models/users/requests/get-users.request';
import { UpdateUserRequest } from '@models/users/requests/update-user.request';
import { UserResponse } from '@models/users/responses/user.response';
import { Observable } from 'rxjs';
import { buildHttpParams } from 'src/app/shared/extensions/http-params.extensions';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users`;

  create(request: CreateUserRequest): Observable<string> {
    return this.http.post<string>(this.baseUrl, request);
  }

  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.baseUrl}/all`);
  }

  getUsers(request: GerUsersRequest): Observable<PagedResponse<UserResponse>> {
    const params = buildHttpParams(request);

    return this.http.get<PagedResponse<UserResponse>>(this.baseUrl, { params });
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

  assignCustomRole(userId: string, customRoleId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${userId}/custom-roles/${customRoleId}`, {});
  }

  removeCustomRole(userId: string, customRoleId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}/custom-roles/${customRoleId}`);
  }
}
