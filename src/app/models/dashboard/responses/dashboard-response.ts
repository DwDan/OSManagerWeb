import { DashboardCardResponse } from './dashboard-card.response';
import { DashboardChartResponse } from './dashboard-chart.response';
import { DashboardLatestOrdersResponse } from './dashboard-latest-orders.response';

export interface DashboardResponse {
  cards: DashboardCardResponse[];
  chart?: DashboardChartResponse | null;
  latestOrders?: DashboardLatestOrdersResponse | null;
}
