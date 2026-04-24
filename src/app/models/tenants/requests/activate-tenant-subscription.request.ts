export interface ActivateTenantSubscriptionRequest {
  planId: string;
  subscriptionEndsAtUtc: Date;
  externalCustomerId?: string;
  externalSubscriptionId?: string;
}
