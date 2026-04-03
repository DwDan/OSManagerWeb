import { CustomerResponse } from '@models/customers/responses/customer.response';
import { OrderStatus } from '../types/order-status.enum';
import { AddressResponse } from './address.response';
import { TechnicianResponse } from './technician.response';

export interface OrderResponse {
  id: string;
  code: string;
  customer: CustomerResponse;
  status: OrderStatus;
  executionResult?: string;
  address: AddressResponse;
  technician?: TechnicianResponse;
}
