import type { Timestamp } from "..";

export type TransitionReasonType =
  | "MANUAL"
  | "IMPORT"
  | "SYSTEM"
  | "API"
  | "VERIFICATION"
  | "MIGRATION"
  | "AUTOMATION"
  | "UNKNOWN";

export type TransitionSource =
  | "USER_INTERFACE"
  | "API"
  | "IMPORT"
  | "MIGRATION"
  | "SYSTEM"
  | "EXTERNAL"
  | "SCHEDULED_TASK";

export interface TransitionReason {
  type: TransitionReasonType;
  detail?: string;
  source?: TransitionSource;
  timestamp?: Timestamp;
}
