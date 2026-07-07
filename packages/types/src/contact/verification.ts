export type ContactVerificationStatus =
  | "UNVERIFIED"
  | "PENDING"
  | "VERIFIED"
  | "EXPIRED"
  | "FAILED"
  | "REVOKED";

export type ContactVerificationMethodType =
  | "EMAIL_CONFIRMATION"
  | "SMS_CODE"
  | "WHATSAPP_CODE"
  | "SIGNAL_CODE"
  | "TELEGRAM_CODE"
  | "CALL_BACK"
  | "POSTCARD"
  | "DOMAIN_OWNERSHIP"
  | "TOKEN_EXCHANGE"
  | "PLATFORM_VERIFICATION"
  | "MANUAL_REVIEW";

export interface ContactVerification {
  method: string;
  order: number;
  label?: string;
}
