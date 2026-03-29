import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { AddOrderEvidencesRequest } from '@models/orders/requests/add-order-evidences.request';
import { AssignOrderTechnicianRequest } from '@models/orders/requests/assign-order-technician.request';
import { CloseOrderRequest } from '@models/orders/requests/close-order.request';
import { CreateOrderRequest } from '@models/orders/requests/create-order.request';
import { UpdateOrderRequest } from '@models/orders/requests/update-order.request';
import { OrderDetailsResponse } from '@models/orders/responses/order-details.response';
import { OrderResponse } from '@models/orders/responses/order.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/orders`;

  create(request: CreateOrderRequest): Observable<string> {
    return this.http.post<string>(this.baseUrl, request);
  }

  getOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(this.baseUrl);
  }

  getById(id: string): Observable<OrderDetailsResponse> {
    return this.http.get<OrderDetailsResponse>(`${this.baseUrl}/${id}`);
  }

  update(id: string, request: UpdateOrderRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }

  assignTechnician(id: string, request: AssignOrderTechnicianRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/technician`, request);
  }

  open(id: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/open`, {});
  }

  startExecution(id: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/start-execution`, {});
  }

  cancel(id: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/cancel`, {});
  }

  close(id: string, request: CloseOrderRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/close`, request);
  }

  addEvidences(id: string, request: AddOrderEvidencesRequest): Observable<void> {
    const formData = new FormData();

    request.files.forEach((file) => {
      formData.append('files', file);
    });

    return this.http.post<void>(`${this.baseUrl}/${id}/evidences`, formData);
  }

  downloadEvidence(orderId: string, evidenceId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${orderId}/evidences/${evidenceId}/download`, {
      responseType: 'blob',
    });
  }
}
