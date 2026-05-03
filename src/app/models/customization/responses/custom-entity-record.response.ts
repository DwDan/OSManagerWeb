import { CustomFieldValueResponse } from './custom-field-value.response';

export interface CustomEntityRecordResponse {
  id: string;
  customEntityId: string;
  key: string;
  name: string;
  customStatusId?: string | null;
  customFields: CustomFieldValueResponse[];
}
