import type { Timestamp } from "..";

export type VerificationStatus =
  | "PENDING"
  | "VERIFIED"
  | "FAILED"
  | "EXPIRED"
  | "REVOKED";

export type VerificationMethod =
  | "MANUAL"
  | "EMAIL"
  | "PHONE"
  | "DOCUMENT"
  | "API_LOOKUP"
  | "BANK_VERIFICATION"
  | "GOVERNMENT_DATABASE"
  | "THIRD_PARTY"
  | "AUTOMATED"
  | "CUSTOM";

export interface IdentifierVerification {
  status: VerificationStatus;
  method: VerificationMethod;
  verifiedAt?: Timestamp;
  expiresAt?: Timestamp;
  verifiedBy?: string;
  evidence?: string;
  notes?: string;
}
