import type { Identifier, Timestamp } from "..";
import type { AuditMetadata } from "../domain";

export interface AddressHistoryEntry {
  id: Identifier;
  addressId: Identifier;
  supersedes?: Identifier;
  supersededBy?: Identifier;
  snapshot: Record<string, unknown>;
  effectiveFrom: Timestamp;
  effectiveUntil?: Timestamp;
  audit: AuditMetadata;
}
