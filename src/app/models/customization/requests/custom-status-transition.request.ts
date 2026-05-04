export interface CreateCustomStatusTransitionRequest {
  entityName: string;
  customEntityId?: string | null;
  fromStatusId: string;
  toStatusId: string;
}
