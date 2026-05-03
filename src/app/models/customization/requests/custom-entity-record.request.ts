export interface CustomFieldValueRequest {
  fieldKey: string;
  value?: string | null;
}

export interface CustomEntityRecordRequest {
  key: string;
  name: string;
  customFields: CustomFieldValueRequest[];
}
