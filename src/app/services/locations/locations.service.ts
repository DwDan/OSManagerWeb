import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CityResponse } from '@models/locations/response/city.response';
import { StateResponse } from '@models/locations/response/state.response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/locations`;

  getStates() {
    return this.httpClient.get<StateResponse[]>(`${this.baseUrl}/states`);
  }

  getCitiesByState(stateAcronym: string) {
    return this.httpClient.get<CityResponse[]>(`${this.baseUrl}/states/${stateAcronym}/cities`);
  }
}
