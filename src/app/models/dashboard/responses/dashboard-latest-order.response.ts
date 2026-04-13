import { OrderStatus } from '@models/orders/types/order-status.enum';

export interface DashboardLatestOrder {
  id: string;
  code: string;
  customer: string;
  status: OrderStatus;
}
