export interface CreateCustomStatusRequest {
  entityName: string;
  customEntityId?: string | null;
  key: string;
  name: string;
  color?: string | null;
  displayOrder: number;
  isInitial: boolean;
  isFinal: boolean;
  isCanceled: boolean;
}

export interface UpdateCustomStatusRequest extends Omit<CreateCustomStatusRequest, 'entityName' | 'customEntityId'> {
  isActive: boolean;
}
