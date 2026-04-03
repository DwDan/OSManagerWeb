import { AddressResponse } from './address.response';

export interface CustomerDetailsResponse {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: AddressResponse;
}
