import { AddressResponse } from './address.response';
import { OrderAuditResponse } from './order-audit.response';
import { OrderEvidenceResponse } from './order-evidence.response';
import { TechnicianResponse } from './technician.response';

export interface OrderDetailsResponse {
  id: string;
  code: string;
  client: string;
  status: string;
  executionResult?: string;
  executionNotes?: string;
  address: AddressResponse;
  technician?: TechnicianResponse;
  audits: OrderAuditResponse[];
  evidences: OrderEvidenceResponse[];
}
