import { OrderStatus } from '../types/order-status.enum';
import { AddressResponse } from './address.response';
import { TechnicianResponse } from './technician.response';

export interface OrderResponse {
  id: string;
  code: string;
  client: string;
  status: OrderStatus;
  executionResult?: string;
  address: AddressResponse;
  technician?: TechnicianResponse;
}
