import { OrderStatus } from '@models/orders/types/order-status.enum';

export interface DashboardLatestOrderResponse {
  id: string;
  code: string;
  customer: string;
  status: OrderStatus;
}
