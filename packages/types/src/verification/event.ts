import type { Identifier } from "..";
import type { AuditMetadata } from "../domain";
import type { EventLifecycleStage } from "./types";

export interface VerificationEventEntry {
  id: Identifier;
  targetType: string;
  targetId: Identifier;
  eventId: Identifier;
  stage: EventLifecycleStage;
  previousState?: string;
  newState: string;
  occurredAt: string;
  expiresAt?: string;
  supersedes?: Identifier;
  supersededBy?: Identifier;
  audit: AuditMetadata;
}
