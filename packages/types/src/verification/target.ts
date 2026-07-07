import type { Identifier } from "..";
import type { VerificationLevel } from "./types";

export interface VerificationStream {
  targetType: string;
  targetId: Identifier;
  level: VerificationLevel;
  label?: string;
}

export interface VerificationTargetRef {
  targetType: string;
  targetId: Identifier;
  targetRef?: string;
}
