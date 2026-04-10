import { ExecutionResult } from '../types/execution-result.enum';
import { OrderStatus } from '../types/order-status.enum';

export interface ExportOrdersToExcelRequest {
  customerId?: string;
  technicianId?: string;
  serviceId?: string;
  status?: OrderStatus;
  executionResult?: ExecutionResult;
  code?: string;
}
