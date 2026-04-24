export interface CreateTenantRequest {
  name: string;
  slug: string;
  planId: string;
  document?: string;
  email?: string;
  phoneNumber?: string;
}
