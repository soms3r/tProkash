import type { Identifier } from "..";
import type { AuditMetadata } from "../domain";
import type { VerificationState } from "./types";
import type { VerificationEvent } from "./verification";

export interface VerificationHistoryEntry {
  id: Identifier;
  targetType: string;
  targetId: Identifier;
  event: VerificationEvent;
  previousState?: VerificationState;
  newState: VerificationState;
  transitionedAt: string;
  audit: AuditMetadata;
}

export interface VerificationChain {
  entries: VerificationHistoryEntry[];
  currentState: VerificationState;
}
