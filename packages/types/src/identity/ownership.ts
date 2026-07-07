import type { Timestamp } from "..";

export type OwnerType =
  | "USER"
  | "ORGANIZATION"
  | "SYSTEM"
  | "ENTITY";

export interface Ownership {
  ownerType: OwnerType;
  ownerId: string;
  role?: string;
  assignedAt: Timestamp;
  assignedBy?: string;
}
