export interface UpdatePlanRequest {
  name: string;
  price: number;
  maxUsers: number;
  maxOrdersPerMonth?: number;
  isPublic: boolean;
}
