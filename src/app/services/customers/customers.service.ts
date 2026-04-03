import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CreateCustomerRequest } from '@models/customers/requests/create-customer.request';
import { UpdateCustomerRequest } from '@models/customers/requests/update-customer.request';
import { CustomerDetailsResponse } from '@models/customers/responses/customer-details.response';
import { CustomerResponse } from '@models/customers/responses/customer.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/customers`;

  create(request: CreateCustomerRequest): Observable<string> {
    return this.http.post<string>(this.baseUrl, request);
  }

  getCustomers(): Observable<CustomerResponse[]> {
    return this.http.get<CustomerResponse[]>(this.baseUrl);
  }

  getById(id: string): Observable<CustomerDetailsResponse> {
    return this.http.get<CustomerDetailsResponse>(`${this.baseUrl}/${id}`);
  }

  update(id: string, request: UpdateCustomerRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }
}
