import { CustomFieldType } from '../types/custom-field-type.enum';

export interface CustomFieldResponse {
  id: string;
  entityName: string;
  customEntityId?: string | null;
  name: string;
  key: string;
  type: CustomFieldType;
  isRequired: boolean;
  mask?: string | null;
  isActive: boolean;
  isVisibleInList: boolean;
  isFilterable: boolean;
  displayOrder: number;
  referenceEntityName?: string | null;
  referenceCustomEntityId?: string | null;
  options: string[];
}
