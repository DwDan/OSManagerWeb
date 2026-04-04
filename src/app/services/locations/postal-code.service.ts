import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PostalCodeAddress } from '@models/locations/response/postal-code-address.response';
import { map, Observable } from 'rxjs';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PostalCodeService {
  private readonly httpClient = inject(HttpClient);

  getAddressByPostalCode(postalCode: string): Observable<PostalCodeAddress | null> {
    const normalizedPostalCode = this.normalize(postalCode);

    return this.httpClient
      .get<ViaCepResponse>(`https://viacep.com.br/ws/${normalizedPostalCode}/json/`)
      .pipe(
        map((response) => {
          if (response.erro) {
            return null;
          }

          return {
            postalCode: response.cep ?? '',
            street: response.logradouro ?? '',
            neighborhood: response.bairro ?? '',
            city: response.localidade ?? '',
            state: response.uf ?? '',
            complement: response.complemento ?? '',
            country: 'Brasil',
          };
        }),
      );
  }

  normalize(value: string): string {
    return (value ?? '').replace(/\D/g, '');
  }
}
