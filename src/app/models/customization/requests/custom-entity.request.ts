export interface CustomEntityRequest {
  key: string;
  name: string;
  allowedCustomRoleNames: string[];
}

export interface CreateCustomEntityRequest {
  name: string;
  allowedCustomRoleNames: string[];
}
