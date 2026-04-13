import { ExecutionResult } from '../types/execution-result.enum';
import { OrderStatus } from '../types/order-status.enum';

export interface OrderListItemResponse {
  id: string;
  code: string;
  customerName: string;
  technicianName: string;
  status: OrderStatus;
  scheduledDate: Date;
  executionResult?: ExecutionResult;
  city: string;
  state: string;
  totalToReceive: number;
  totalToPay: number;
}
