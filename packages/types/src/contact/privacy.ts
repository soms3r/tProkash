import type { ContactPrivacyLevel } from "./types";
import type { ContactType } from "./types";

export type ContactPrivacyDefaultMap = Record<ContactType, ContactPrivacyLevel>;

export const DEFAULT_PRIVACY_BY_CONTACT_TYPE: ContactPrivacyDefaultMap = {
  PRIMARY: "PUBLIC",
  GENERAL: "PUBLIC",
  BILLING: "PRIVATE",
  EDITORIAL: "PUBLIC",
  RIGHTS: "PUBLIC",
  SALES: "PUBLIC",
  MEDIA: "PUBLIC",
  SUPPORT: "PUBLIC",
  LEGAL: "PRIVATE",
  EMERGENCY: "PRIVATE",
  TECHNICAL: "PRIVATE",
  ARCHIVE: "INTERNAL",
  MANAGEMENT: "PRIVATE",
  OPERATIONS: "PRIVATE",
  COMPLIANCE: "PRIVATE",
  OTHER: "PRIVATE",
};
