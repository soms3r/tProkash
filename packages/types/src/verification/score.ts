export interface ConfidenceScore {
  value: number;
  method: string;
  details?: Record<string, unknown>;
}

export interface TrustScoreComponents {
  verificationLevel: number;
  verificationAge: number;
  verificationHistory: number;
  incidentCount: number;
  communityEndorsements: number;
}

export interface TrustScore {
  overall: number;
  components: TrustScoreComponents;
  calculatedAt: string;
}

export interface ConfidenceByMethod {
  method: string;
  confidence: number;
}
