import { CustomerResponse } from '@models/customers/responses/customer.response';
import { ExecutionResult } from '../types/execution-result.enum';
import { OrderStatus } from '../types/order-status.enum';
import { AddressResponse } from './address.response';
import { TechnicianResponse } from './technician.response';

export interface OrderResponse {
  id: string;
  code: string;
  customer: CustomerResponse;
  status: OrderStatus;
  executionResult?: ExecutionResult;
  address: AddressResponse;
  technician?: TechnicianResponse;
}
