import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CreatePlanRequest } from '@models/plans/requests/create-plan.request';
import { UpdatePlanRequest } from '@models/plans/requests/update-plan.request';
import { PlanListItemResponse } from '@models/plans/responses/plan-list-item.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlansService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/plans`;

  getAllPlans(): Observable<PlanListItemResponse[]> {
    return this.http.get<PlanListItemResponse[]>(this.baseUrl);
  }

  create(request: CreatePlanRequest): Observable<string> {
    return this.http.post<string>(this.baseUrl, request);
  }

  update(id: string, request: UpdatePlanRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }

  activate(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/activate`, {});
  }

  deactivate(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/deactivate`, {});
  }
}
