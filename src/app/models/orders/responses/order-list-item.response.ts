import { OrderStatus } from '../types/order-status.enum';

export interface OrderListItemResponse {
  id: string;
  code: string;
  client: string;
  technicianName: string;
  status: OrderStatus;
  executionResult: string;
  city: string;
  state: string;
}
