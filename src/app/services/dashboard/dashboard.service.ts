import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { DashboardResponse } from '@models/dashboard/responses/dashboard-response';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/dashboard`;

  get() {
    return this.http.get<DashboardResponse>(this.baseUrl);
  }
}
