import { TenantStatus } from '../types/tenant-status.enum';

export interface TenantPagedItemResponse {
  id: string;
  name: string;
  slug: string;
  document?: string;
  email?: string;
  phoneNumber?: string;
  status: TenantStatus;
  currentPlanId?: string;
  currentPlanName?: string;
  createdAtUtc: Date;
  trialEndsAtUtc?: Date;
  subscriptionEndsAtUtc?: Date;
}
