export interface PlanListItemResponse {
  id: string;
  name: string;
  code: string;
  price: number;
  maxUsers: number;
  maxOrdersPerMonth?: number;
  isActive: boolean;
  isPublic: boolean;
}
