import type { Identifier } from "..";
import type { AuditMetadata } from "../domain";
import type { VerificationLevel, VerificationState, VerificationMethodType } from "./types";
import type { Evidence } from "./evidence";

export interface VerificationTarget {
  targetType: string;
  targetId: Identifier;
  targetRef?: string;
}

export interface Verifier {
  actorType: "SYSTEM" | "HUMAN";
  actorId: Identifier;
  actorLabel?: string;
}

export interface VerificationEvent {
  id: Identifier;
  targetType: string;
  targetId: Identifier;
  targetRef?: string;
  level: VerificationLevel;
  state: Exclude<VerificationState, "UNVERIFIED">;
  methods: VerificationMethodType[];
  evidence: Evidence[];
  verifier: Verifier;
  workflow: "AUTOMATED" | "HUMAN_REVIEW" | "HYBRID";
  confidence: number;
  notes?: string;
  occurredAt: string;
  recordedAt: string;
  expiresAt?: string;
  supersedes?: Identifier;
  supersededBy?: Identifier;
  audit: AuditMetadata;
}

export interface VerificationRecord {
  targetType: string;
  targetId: Identifier;
  currentState: VerificationState;
  currentLevel: VerificationLevel;
  currentConfidence: number;
  verifiedAt?: string;
  expiresAt?: string;
  lastCheckedAt?: string;
  eventCount: number;
  latestEvent: Identifier;
}

export interface VerificationSummary {
  target: VerificationTarget;
  state: VerificationState;
  level: VerificationLevel;
  confidence: number;
  verifiedAt?: string;
  expiresAt?: string;
}
