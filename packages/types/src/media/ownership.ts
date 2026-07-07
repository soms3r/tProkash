import type { Identifier, Timestamp } from "..";
import type { RelationshipEntityType, AssetType } from "./types";
import type { AuditMetadata } from "../domain/audit";

export interface AssetRelationship {
  id: Identifier;
  assetId: Identifier;
  entityType: RelationshipEntityType;
  entityId: Identifier;
  assetType: AssetType;
  primary: boolean;
  order?: number;
  label?: string;
  effectiveFrom?: Timestamp;
  effectiveUntil?: Timestamp;
  audit: AuditMetadata;
}
