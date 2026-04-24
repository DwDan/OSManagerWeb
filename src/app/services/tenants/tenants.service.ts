import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { PagedResponse } from '@models/pagination/response/paged.response';
import { ActivateTenantSubscriptionRequest } from '@models/tenants/requests/activate-tenant-subscription.request';
import { CreateTenantRequest } from '@models/tenants/requests/create-tenant.request';
import { GetPagedTenantsRequest } from '@models/tenants/requests/get-paged-tenants.request';
import { StartTenantTrialRequest } from '@models/tenants/requests/start-tenant-trial.request';
import { UpdateTenantRequest } from '@models/tenants/requests/update-tenant.request';
import { TenantDetailsResponse } from '@models/tenants/responses/tenant-details.response';
import { TenantListItemResponse } from '@models/tenants/responses/tenant-list-item.response';
import { TenantPagedItemResponse } from '@models/tenants/responses/tenant-paged-item.response';
import { TenantSubscriptionResponse } from '@models/tenants/responses/tenant-subscription.response';
import { Observable } from 'rxjs';
import { buildHttpParams } from 'src/app/shared/extensions/http-params.extensions';

@Injectable({
  providedIn: 'root',
})
export class TenantsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tenants`;

  create(request: CreateTenantRequest): Observable<string> {
    return this.http.post<string>(this.baseUrl, request);
  }

  getAllTenants(): Observable<TenantListItemResponse[]> {
    return this.http.get<TenantListItemResponse[]>(this.baseUrl);
  }

  getTenants(request: GetPagedTenantsRequest): Observable<PagedResponse<TenantPagedItemResponse>> {
    const params = buildHttpParams(request);

    return this.http.get<PagedResponse<TenantPagedItemResponse>>(`${this.baseUrl}/paged`, {
      params,
    });
  }

  getById(id: string): Observable<TenantDetailsResponse> {
    return this.http.get<TenantDetailsResponse>(`${this.baseUrl}/${id}`);
  }

  update(id: string, request: UpdateTenantRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }

  startTrial(id: string, request: StartTenantTrialRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/trial`, request);
  }

  activateSubscription(id: string, request: ActivateTenantSubscriptionRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/subscription`, request);
  }

  suspend(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/suspend`, {});
  }

  cancel(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/cancel`, {});
  }

  expire(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/expire`, {});
  }

  markSubscriptionAsPastDue(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/subscription/past-due`, {});
  }

  getSubscriptions(id: string): Observable<TenantSubscriptionResponse[]> {
    return this.http.get<TenantSubscriptionResponse[]>(`${this.baseUrl}/${id}/subscriptions`);
  }
}
