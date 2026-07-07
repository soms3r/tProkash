export const BASE_STATES = [
  "DRAFT",
  "IMPORTED",
  "PENDING_REVIEW",
  "PENDING_VERIFICATION",
  "VERIFIED",
  "PUBLISHED",
  "SUSPENDED",
  "ARCHIVED",
  "DELETED",
] as const;

export type BaseState = (typeof BASE_STATES)[number];

export type LifecycleState = BaseState | (string & {});
