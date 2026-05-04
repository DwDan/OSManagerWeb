import { CustomRoleResponse } from '@models/customization/responses/custom-role.response';

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  emailConfirmed: boolean;
  customRoles: CustomRoleResponse[];
}
