export interface UpdateTenantRequest {
  name: string;
  slug: string;
  document?: string;
  email?: string;
  phoneNumber?: string;
}
