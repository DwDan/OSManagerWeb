import { CustomerResponse } from '@models/customers/responses/customer.response';
import { ServiceResponse } from '@models/services/responses/service.response';
import { ExecutionResult } from '../types/execution-result.enum';
import { OrderStatus } from '../types/order-status.enum';
import { AddressResponse } from './address.response';
import { OrderAuditResponse } from './order-audit.response';
import { OrderEvidenceResponse } from './order-evidence.response';
import { TechnicianResponse } from './technician.response';

export interface OrderDetailsResponse {
  id: string;
  code: string;
  customer: CustomerResponse;
  scheduledAt: Date;
  services: ServiceResponse[];
  status: OrderStatus;
  executionResult?: ExecutionResult;
  executionNotes?: string;
  address: AddressResponse;
  technician?: TechnicianResponse;
  audits: OrderAuditResponse[];
  evidences: OrderEvidenceResponse[];
}
