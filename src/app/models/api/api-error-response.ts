export interface ApiErrorResponse {
  title?: string;
  status?: number;
  detail?: string | null;
  errors?: string[] | null;
}
