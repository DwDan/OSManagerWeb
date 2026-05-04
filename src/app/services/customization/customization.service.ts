import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CustomEntityRecordRequest } from '@models/customization/requests/custom-entity-record.request';
import {
  CreateCustomEntityRequest,
  CustomEntityRequest,
} from '@models/customization/requests/custom-entity.request';
import {
  CreateCustomFieldRequest,
  UpdateCustomFieldRequest,
} from '@models/customization/requests/custom-field.request';
import { CreateCustomFunctionRequest } from '@models/customization/requests/custom-function.request';
import {
  CreateCustomStatusRequest,
  UpdateCustomStatusRequest,
} from '@models/customization/requests/custom-status.request';
import { CreateCustomStatusTransitionRequest } from '@models/customization/requests/custom-status-transition.request';
import { CustomEntityRecordResponse } from '@models/customization/responses/custom-entity-record.response';
import { CustomEntityResponse } from '@models/customization/responses/custom-entity.response';
import { CustomFieldResponse } from '@models/customization/responses/custom-field.response';
import { CustomFunctionResponse } from '@models/customization/responses/custom-function.response';
import { CustomStatusResponse } from '@models/customization/responses/custom-status.response';
import { CustomStatusTransitionResponse } from '@models/customization/responses/custom-status-transition.response';
import { CustomizableEntityResponse } from '@models/customization/responses/customizable-entity.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomizationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getCustomizableEntities(): Observable<CustomizableEntityResponse[]> {
    return this.http.get<CustomizableEntityResponse[]>(`${this.apiUrl}/customizable-entities`);
  }

  getCustomEntities(): Observable<CustomEntityResponse[]> {
    return this.http.get<CustomEntityResponse[]>(`${this.apiUrl}/custom-entities`);
  }

  createCustomEntity(request: CreateCustomEntityRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/custom-entities`, request);
  }

  updateCustomEntity(id: string, request: CustomEntityRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/custom-entities/${id}`, request);
  }

  deleteCustomEntity(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/custom-entities/${id}`);
  }

  getCustomEntityRecords(customEntityId: string): Observable<CustomEntityRecordResponse[]> {
    return this.http.get<CustomEntityRecordResponse[]>(
      `${this.apiUrl}/custom-entities/${customEntityId}/records`,
    );
  }

  createCustomEntityRecord(
    customEntityId: string,
    request: CustomEntityRecordRequest,
  ): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}/custom-entities/${customEntityId}/records`,
      request,
    );
  }

  updateCustomEntityRecord(id: string, request: CustomEntityRecordRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/custom-entities/records/${id}`, request);
  }

  deleteCustomEntityRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/custom-entities/records/${id}`);
  }

  getFields(entityName: string, customEntityId?: string | null): Observable<CustomFieldResponse[]> {
    const params: Record<string, string> = { entityName };

    if (customEntityId) {
      params['customEntityId'] = customEntityId;
    }

    return this.http.get<CustomFieldResponse[]>(`${this.apiUrl}/custom-fields`, {
      params,
    });
  }

  createField(request: CreateCustomFieldRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/custom-fields`, request);
  }

  updateField(id: string, request: UpdateCustomFieldRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/custom-fields/${id}`, request);
  }

  activateField(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/custom-fields/${id}/activate`, {});
  }

  deactivateField(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/custom-fields/${id}/deactivate`, {});
  }

  getStatuses(entityName: string, customEntityId?: string | null): Observable<CustomStatusResponse[]> {
    const params: Record<string, string> = { entityName };

    if (customEntityId) {
      params['customEntityId'] = customEntityId;
    }

    return this.http.get<CustomStatusResponse[]>(`${this.apiUrl}/custom-statuses`, {
      params,
    });
  }

  createStatus(request: CreateCustomStatusRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/custom-statuses`, request);
  }

  updateStatus(id: string, request: UpdateCustomStatusRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/custom-statuses/${id}`, request);
  }

  activateStatus(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/custom-statuses/${id}/activate`, {});
  }

  deactivateStatus(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/custom-statuses/${id}/deactivate`, {});
  }

  getStatusTransitions(
    entityName: string,
    customEntityId?: string | null,
  ): Observable<CustomStatusTransitionResponse[]> {
    const params: Record<string, string> = { entityName };

    if (customEntityId) {
      params['customEntityId'] = customEntityId;
    }

    return this.http.get<CustomStatusTransitionResponse[]>(
      `${this.apiUrl}/custom-status-transitions`,
      { params },
    );
  }

  createStatusTransition(request: CreateCustomStatusTransitionRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/custom-status-transitions`, request);
  }

  activateStatusTransition(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/custom-status-transitions/${id}/activate`, {});
  }

  deactivateStatusTransition(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/custom-status-transitions/${id}/deactivate`, {});
  }

  getFunctions(entityName: string, customEntityId?: string | null): Observable<CustomFunctionResponse[]> {
    const params: Record<string, string> = { entityName };

    if (customEntityId) {
      params['customEntityId'] = customEntityId;
    }

    return this.http.get<CustomFunctionResponse[]>(`${this.apiUrl}/custom-functions`, {
      params,
    });
  }

  createFunction(request: CreateCustomFunctionRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/custom-functions`, request);
  }

  updateFunction(id: string, request: CreateCustomFunctionRequest & { isActive: boolean }): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/custom-functions/${id}`, request);
  }

  activateFunction(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/custom-functions/${id}/activate`, {});
  }

  deactivateFunction(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/custom-functions/${id}/deactivate`, {});
  }
}
