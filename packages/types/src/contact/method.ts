import type { Identifier } from "..";
import type { AuditMetadata } from "../domain";
import type { ContactMethodType, ContactMethodStatus, ContactPrivacyLevel } from "./types";
import type { Availability } from "./availability";

export interface ContactMethod {
  id: Identifier;
  type: ContactMethodType;
  value: string;
  label?: string;
  primary: boolean;
  verified: boolean;
  verifiedAt?: string;
  verificationMethod?: string;
  privacy: ContactPrivacyLevel;
  preferred: boolean;
  preferredOrder?: number;
  availability?: Availability;
  notes?: string;
  status: ContactMethodStatus;
  audit: AuditMetadata;
}

export interface ContactMethodInput {
  type: ContactMethodType;
  value: string;
  label?: string;
  primary?: boolean;
  privacy?: ContactPrivacyLevel;
  preferred?: boolean;
  preferredOrder?: number;
  availability?: Availability;
  notes?: string;
}
