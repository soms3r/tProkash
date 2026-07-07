import type { AddressVerificationStatus, AddressVerificationMethod } from "./types";

export interface AddressVerification {
  status: AddressVerificationStatus;
  method?: AddressVerificationMethod;
  verifiedAt?: string;
  expiresAt?: string;
  verifiedBy?: string;
}

export interface AddressValidation {
  formatValidated: boolean;
  formatValidatedAt?: string;
  existenceValidated: boolean;
  existenceValidationMethod?: string;
  existenceValidatedAt?: string;
  verification: AddressVerification;
}
