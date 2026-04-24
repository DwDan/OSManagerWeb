export interface PlanListItemResponse {
  id: string;
  name: string;
  code: string;
  price: number;
  maxAdminUsers: number;
  maxOrdersPerMonth?: number;
  isActive: boolean;
  isPublic: boolean;
}
