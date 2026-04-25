export interface CreatePlanRequest {
  name: string;
  code: string;
  price: number;
  maxAdminUsers: number;
  maxOrdersPerMonth?: number;
  isPublic: boolean;
  isRecommended: boolean;
  featureKeys: string[];
}
