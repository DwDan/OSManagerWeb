export interface CustomRoleResponse {
  id: string;
  name: string;
  description?: string | null;
  tenantId: string;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
}
