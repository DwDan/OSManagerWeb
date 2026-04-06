import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CreateCustomerRequest } from '@models/customers/requests/create-customer.request';
import { GerCustomersRequest } from '@models/customers/requests/get-customers.request';
import { UpdateCustomerRequest } from '@models/customers/requests/update-customer.request';
import { CustomerDetailsResponse } from '@models/customers/responses/customer-details.response';
import { CustomerListItemResponse } from '@models/customers/responses/customer-list-item.response';
import { CustomerResponse } from '@models/customers/responses/customer.response';
import { PagedResponse } from '@models/pagination/response/paged.response';
import { Observable } from 'rxjs';
import { buildHttpParams } from 'src/app/shared/extensions/http-params.extensions';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/customers`;

  create(request: CreateCustomerRequest): Observable<string> {
    return this.http.post<string>(this.baseUrl, request);
  }

  getAllCustomers(): Observable<CustomerResponse[]> {
    return this.http.get<CustomerResponse[]>(`${this.baseUrl}/all`);
  }

  getCustomers(request: GerCustomersRequest): Observable<PagedResponse<CustomerListItemResponse>> {
    const params = buildHttpParams(request);

    return this.http.get<PagedResponse<CustomerListItemResponse>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<CustomerDetailsResponse> {
    return this.http.get<CustomerDetailsResponse>(`${this.baseUrl}/${id}`);
  }

  update(id: string, request: UpdateCustomerRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }
}
