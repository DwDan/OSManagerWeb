import { OrderStatus } from '../types/order-status.enum';

export interface OrderAuditResponse {
  id: string;
  status: OrderStatus;
  userId: string;
  userName?: string;
  createdAt: string;
}
