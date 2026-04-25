export interface UpdatePlanRequest {
  name: string;
  price: number;
  maxAdminUsers: number;
  maxOrdersPerMonth?: number;
  isPublic: boolean;
  isRecommended: boolean;
  featureKeys: string[];
}
