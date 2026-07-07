export type ContactType =
  | "PRIMARY"
  | "GENERAL"
  | "BILLING"
  | "EDITORIAL"
  | "RIGHTS"
  | "SALES"
  | "MEDIA"
  | "SUPPORT"
  | "LEGAL"
  | "EMERGENCY"
  | "TECHNICAL"
  | "ARCHIVE"
  | "MANAGEMENT"
  | "OPERATIONS"
  | "COMPLIANCE"
  | "OTHER";

export type ContactMethodType =
  | "EMAIL"
  | "PHONE"
  | "MOBILE"
  | "WHATSAPP"
  | "SIGNAL"
  | "TELEGRAM"
  | "FAX"
  | "WEBSITE"
  | "POSTAL_ADDRESS"
  | "SOCIAL_MEDIA"
  | "API_ENDPOINT"
  | "OTHER";

export type ContactStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "ARCHIVED"
  | "DELETED";

export type ContactMethodStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "EXPIRED";

export type ContactPrivacyLevel =
  | "PUBLIC"
  | "PRIVATE"
  | "INTERNAL";
