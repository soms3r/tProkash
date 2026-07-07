export type VerificationState =
  | "UNVERIFIED"
  | "PENDING"
  | "VERIFIED"
  | "REJECTED"
  | "EXPIRED"
  | "REVOKED";

export type VerificationLevel =
  | "BASIC"
  | "STANDARD"
  | "ENHANCED"
  | "ACCREDITED"
  | "TRUSTED";

export type VerificationMethodType =
  | "EMAIL"
  | "SMS"
  | "PHONE_CALL"
  | "WEBSITE_OWNERSHIP"
  | "DNS_RECORD"
  | "GOVERNMENT_REGISTRY"
  | "BUSINESS_REGISTRY"
  | "ISBN_AGENCY"
  | "MANUAL_REVIEW"
  | "COMMUNITY_VALIDATION"
  | "DIGITAL_SIGNATURE"
  | "API_VERIFICATION"
  | "DOCUMENT_REVIEW"
  | "CUSTOM";

export type EvidenceType =
  | "EMAIL_CONFIRMATION"
  | "SMS_LOG"
  | "CALL_LOG"
  | "SCREENSHOT"
  | "DOCUMENT_UPLOAD"
  | "REGISTRY_RESPONSE"
  | "DNS_RECORD"
  | "META_TAG"
  | "FILE_UPLOAD"
  | "DIGITAL_SIGNATURE"
  | "API_RESPONSE"
  | "MANUAL_NOTE"
  | "PHOTOGRAPH"
  | "OTHER";

export type EvidenceRetentionPolicy =
  | "STANDARD"
  | "EXTENDED"
  | "INDEFINITE";

export type EvidenceStatus =
  | "CURRENT"
  | "PURGED";

export type WorkflowType =
  | "AUTOMATED"
  | "HUMAN_REVIEW"
  | "HYBRID";

export type VerifierActorType =
  | "SYSTEM"
  | "HUMAN";

export type EventLifecycleStage =
  | "RECORDED"
  | "ACTIVE"
  | "SUPERSEDED"
  | "EXPIRED";

export type CompositionType =
  | "AND"
  | "OR"
  | "WEIGHTED";

export type AutomatedStage =
  | "TRIGGERED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ESCALATED";

export type HumanReviewStage =
  | "SUBMITTED"
  | "ASSIGNED"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "REQUEST_CHANGES";
