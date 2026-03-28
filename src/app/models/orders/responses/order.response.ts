import { AddressResponse } from './address.response';
import { TechnicianResponse } from './technician.response';

export interface OrderResponse {
  id: string;
  code: string;
  client: string;
  status: string;
  executionResult?: string;
  address: AddressResponse;
  technician?: TechnicianResponse;
}
