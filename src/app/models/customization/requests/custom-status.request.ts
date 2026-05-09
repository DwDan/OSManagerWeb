export interface CreateCustomStatusRequest {
  entityName: string;
  customEntityId?: string | null;
  name: string;
  color?: string | null;
  displayOrder: number;
  isInitial: boolean;
  isFinal: boolean;
  isCanceled: boolean;
}

export interface UpdateCustomStatusRequest extends Omit<CreateCustomStatusRequest, 'entityName' | 'customEntityId'> {
  key: string;
  isActive: boolean;
}
