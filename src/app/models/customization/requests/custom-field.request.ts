import { CustomFieldType } from '../types/custom-field-type.enum';

export interface CreateCustomFieldRequest {
  entityName: string;
  customEntityId?: string | null;
  name: string;
  type: CustomFieldType;
  isRequired: boolean;
  mask?: string | null;
  options: string[];
  displayOrder: number;
  isFilterable: boolean;
  isVisibleInList: boolean;
  referenceEntityName?: string | null;
  referenceCustomEntityId?: string | null;
}

export type UpdateCustomFieldRequest = Omit<CreateCustomFieldRequest, 'entityName' | 'customEntityId'>;
