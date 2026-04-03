export interface ApiErrorResponse {
  Title?: string;
  Status?: number;
  Detail?: string | null;
  Errors?: string[] | null;
}
