import type { Identifier, Timestamp } from "..";

export interface AuditMetadata {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: Identifier;
  updatedBy?: Identifier;
  deletedAt?: Timestamp;
  deletedBy?: Identifier;
  version: number;
}
