export interface CreateTenantRequest {
  name: string;
  slug: string;
  document?: string;
  email?: string;
  phoneNumber?: string;
}
