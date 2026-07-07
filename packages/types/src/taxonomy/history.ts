import type { Identifier, Timestamp } from "..";
import type { TermChangeReason } from "./types";

export interface TermHistory {
  id: Identifier;
  termId: Identifier;
  version: number;
  reason: TermChangeReason;
  changeLog?: string;
  snapshot?: Record<string, unknown>;
  createdAt: Timestamp;
  createdBy: Identifier;
}

export interface MergeRecord {
  id: Identifier;
  sourceTermId: Identifier;
  targetTermId: Identifier;
  reason: string;
  referenceCount: number;
  mergedAt: Timestamp;
  mergedBy: Identifier;
}

export interface SplitRecord {
  id: Identifier;
  sourceTermId: Identifier;
  targetTermIds: Identifier[];
  reason: string;
  splitAt: Timestamp;
  splitBy: Identifier;
}
