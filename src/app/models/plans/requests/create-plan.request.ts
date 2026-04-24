export interface CreatePlanRequest {
  name: string;
  code: string;
  price: number;
  maxUsers: number;
  maxOrdersPerMonth?: number;
  isPublic: boolean;
}
