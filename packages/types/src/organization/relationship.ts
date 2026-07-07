import type { Identifier, Timestamp } from "..";
import type { AuditMetadata } from "../domain";
import type { OrgRelationshipType } from "./types";

export interface OrganizationRelationship {
  id: Identifier;
  organizationId: Identifier;
  relatedOrganizationId: Identifier;
  type: OrgRelationshipType;
  direction: "FROM" | "TO";
  effectiveFrom?: Timestamp;
  effectiveUntil?: Timestamp;
  active: boolean;
  metadata?: Record<string, unknown>;
  audit: AuditMetadata;
}

export interface OrganizationRelationshipInput {
  relatedOrganizationId: Identifier;
  type: OrgRelationshipType;
  effectiveFrom?: Timestamp;
  effectiveUntil?: Timestamp;
  metadata?: Record<string, unknown>;
}
