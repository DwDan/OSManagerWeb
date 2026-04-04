import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CreateServiceRequest } from '@models/services/requests/create-service.request';
import { UpdateServiceRequest } from '@models/services/requests/update-service.request';
import { ServiceDetailsResponse } from '@models/services/responses/service-details.response';
import { ServiceResponse } from '@models/services/responses/service.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/services`;

  create(request: CreateServiceRequest): Observable<string> {
    return this.http.post<string>(this.baseUrl, request);
  }

  getServices(): Observable<ServiceResponse[]> {
    return this.http.get<ServiceResponse[]>(this.baseUrl);
  }

  getById(id: string): Observable<ServiceDetailsResponse> {
    return this.http.get<ServiceDetailsResponse>(`${this.baseUrl}/${id}`);
  }

  update(id: string, request: UpdateServiceRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }
}
