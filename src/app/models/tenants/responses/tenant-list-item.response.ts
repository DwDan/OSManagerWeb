import { TenantStatus } from '../types/tenant-status.enum';

export interface TenantListItemResponse {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phoneNumber?: string;
  status: TenantStatus;
  planName?: string;
  createdAtUtc: Date;
}
