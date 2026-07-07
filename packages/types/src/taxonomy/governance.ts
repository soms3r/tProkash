import type { GovernanceStatus, GovernanceRole } from "./types";
import type { Identifier, Timestamp } from "..";

export interface GovernanceAction {
  id: Identifier;
  termId: Identifier;
  action: GovernanceStatus;
  previousStatus: GovernanceStatus;
  actorId: Identifier;
  actorRole: GovernanceRole;
  reason?: string;
  timestamp: Timestamp;
}

export interface TaxonomyReviewAssignment {
  id: Identifier;
  termId: Identifier;
  reviewerId: Identifier;
  reviewerRole: GovernanceRole;
  assignedAt: Timestamp;
  completedAt?: Timestamp;
  decision?: GovernanceStatus;
  notes?: string;
}
