import type { Identifier } from "..";
import type { AuditMetadata } from "../domain";
import type { EvidenceType, EvidenceRetentionPolicy, EvidenceStatus } from "./types";

export interface EvidenceHash {
  algorithm: "SHA-256" | "SHA-384" | "SHA-512";
  value: string;
}

export interface EvidenceRetention {
  policy: EvidenceRetentionPolicy;
  expiresAt?: string;
}

export interface EvidenceMetadata {
  source?: string;
  uploadedBy?: Identifier;
  uploadedAt?: string;
  originalFilename?: string;
}

export interface Evidence {
  id: Identifier;
  type: EvidenceType;
  label?: string;
  description?: string;
  hash: EvidenceHash;
  location?: string;
  mimeType?: string;
  size?: number;
  metadata?: EvidenceMetadata;
  retention: EvidenceRetention;
  status: EvidenceStatus;
  audit: AuditMetadata;
}
