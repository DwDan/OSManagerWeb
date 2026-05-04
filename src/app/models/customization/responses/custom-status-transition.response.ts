export interface CustomStatusTransitionResponse {
  id: string;
  entityName: string;
  customEntityId?: string | null;
  fromStatusId: string;
  toStatusId: string;
  isActive: boolean;
}
