import type { Identifier } from "..";
import type { AuditMetadata } from "./audit";

export interface BaseEntity {
  id: Identifier;
  audit: AuditMetadata;
}
