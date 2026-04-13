import { DashboardChartSerieResponse } from './dashboard-chart-serie.response';

export interface DashboardChartResponse {
  key: string;
  categories: string[];
  series: DashboardChartSerieResponse[];
}
