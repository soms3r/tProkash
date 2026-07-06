import type { AuditInfo, Timestamp } from "..";
import type { IdentifierStatus } from "./status";
import type { IdentifierVerification } from "./verification";
import type { Ownership } from "./ownership";
import type { Visibility } from "./visibility";

export type IdentifierType =
  | "UUID"
  | "SLUG"
  | "REGISTRATION_NUMBER"
  | "TRADE_LICENSE"
  | "BIN"
  | "TIN"
  | "ISBN_PREFIX"
  | "WEBSITE"
  | "EMAIL"
  | "PHONE"
  | "EXTERNAL_REGISTRY_ID"
  | "CUSTOM";

export type IdentifierSource =
  | "SYSTEM"
  | "USER"
  | "EXTERNAL"
  | "MIGRATION"
  | "API";

export interface GenericIdentifier {
  id: string;
  entityId: string;
  type: IdentifierType;
  value: string;
  slug?: string;
  source: IdentifierSource;
  isPrimary: boolean;
  status: IdentifierStatus;
  visibility: Visibility;
  verification?: IdentifierVerification;
  ownership?: Ownership;
  audit: AuditInfo;
  deletedAt?: Timestamp;
}
