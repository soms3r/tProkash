import type { VerificationLevel, VerificationMethodType, CompositionType } from "./types";

export interface MethodComposition {
  type: CompositionType;
  methods: VerificationMethodType[];
  weights?: Record<string, number>;
}

export interface LevelRequirements {
  level: VerificationLevel;
  minimumMethods: number;
  requiredMethods?: VerificationMethodType[];
  optionalMethods?: VerificationMethodType[];
  composition: MethodComposition;
  minimumConfidence: number;
  expirationMonths: number;
  requiresHumanReview: boolean;
}

export interface VerificationPolicy {
  id: string;
  name: string;
  targetTypes: string[];
  levels: LevelRequirements[];
  maxAttempts?: number;
  gracePeriodDays?: number;
  allowScheduledReVerification: boolean;
  autoEscalateThreshold?: number;
}
