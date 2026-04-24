import { SubscriptionStatus } from '../types/subscription-status.enum';

export interface TenantSubscriptionResponse {
  id: string;
  tenantId: string;
  planId: string;
  planName: string;
  status: SubscriptionStatus;
  startedAtUtc: Date;
  endsAtUtc?: Date;
  externalSubscriptionId?: string;
}
