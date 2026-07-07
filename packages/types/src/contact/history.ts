import type { Identifier } from "..";
import type { AuditMetadata } from "../domain";

export interface ContactHistoryEntry {
  id: Identifier;
  contactId: Identifier;
  supersedes?: Identifier;
  supersededBy?: Identifier;
  snapshot: Record<string, unknown>;
  effectiveFrom: string;
  effectiveUntil?: string;
  audit: AuditMetadata;
}
