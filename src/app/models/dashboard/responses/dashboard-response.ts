import { DashboardChartSerie } from './dashboard-chart-serie.response';
import { DashboardLatestOrder } from './dashboard-latest-order.response';

export interface DashboardResponse {
  totalCustomers: number;
  totalServices: number;
  activeOrders: number;
  closedOrders: number;
  chartCategories: string[];
  chartSeries: DashboardChartSerie[];
  latestOrders: DashboardLatestOrder[];
}
