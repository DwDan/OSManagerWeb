import { AddressResponse } from './address.response';

export interface CustomerResponse {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: AddressResponse;
}
