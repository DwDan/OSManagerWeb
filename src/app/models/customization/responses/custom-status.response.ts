export interface CustomStatusResponse {
  id: string;
  entityName: string;
  customEntityId?: string | null;
  key: string;
  name: string;
  color?: string | null;
  displayOrder: number;
  isInitial: boolean;
  isFinal: boolean;
  isCanceled: boolean;
  isActive: boolean;
}
