import { DashboardLatestOrderResponse } from './dashboard-latest-order.response';

export interface DashboardLatestOrdersResponse {
  key: string;
  items: DashboardLatestOrderResponse[];
}
