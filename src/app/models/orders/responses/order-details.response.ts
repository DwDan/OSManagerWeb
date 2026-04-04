import { CustomerResponse } from '@models/customers/responses/customer.response';
import { ServiceResponse } from '@models/services/responses/service.response';
import { OrderStatus } from '../types/order-status.enum';
import { AddressResponse } from './address.response';
import { OrderAuditResponse } from './order-audit.response';
import { OrderEvidenceResponse } from './order-evidence.response';
import { TechnicianResponse } from './technician.response';

export interface OrderDetailsResponse {
  id: string;
  code: string;
  customer: CustomerResponse;
  services: ServiceResponse[];
  status: OrderStatus;
  executionResult?: string;
  executionNotes?: string;
  address: AddressResponse;
  technician?: TechnicianResponse;
  audits: OrderAuditResponse[];
  evidences: OrderEvidenceResponse[];
}
