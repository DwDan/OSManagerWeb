import { TenantStatus } from '../types/tenant-status.enum';

export interface GetPagedTenantsRequest {
  name?: string;
  slug?: string;
  status?: TenantStatus;
  currentPlanId?: string;
  page: number;
  pageSize: number;
}
