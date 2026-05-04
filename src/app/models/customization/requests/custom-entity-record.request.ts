export interface CustomFieldValueRequest {
  fieldKey: string;
  value?: string | null;
}

export interface CustomEntityRecordRequest {
  key?: string | null;
  name: string;
  customFields: CustomFieldValueRequest[];
}
