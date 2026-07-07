import type { Timestamp } from "..";
import type { ComplianceStatus, LegalForm } from "./types";

export interface TaxRegistration {
  jurisdiction: string;
  taxId: string;
  taxType: string;
  active: boolean;
}

export interface LegalInfo {
  registrationNumber?: string;
  jurisdiction: string;
  registrationDate?: Timestamp;
  dissolutionDate?: Timestamp;
  legalForm: LegalForm;
  taxRegistrations: TaxRegistration[];
  complianceStatus: ComplianceStatus;
  licences?: string[];
  certifications?: string[];
}
