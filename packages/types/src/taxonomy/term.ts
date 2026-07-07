import type { Identifier, Timestamp } from "..";
import type { AuditMetadata } from "../domain/audit";
import type {
  TaxonomyType,
  TaxonomyStructure,
  TaxonomyStatus,
  TermStatus,
  AssignedBy,
} from "./types";
import type { LocalizedLabel, LocalizedDescription } from "./localization";
import type { StandardCodeMap } from "./mapping";
import type { GovernanceStatus } from "./types";

export interface Taxonomy {
  id: Identifier;
  code: string;
  name: string;
  description?: string;
  type: TaxonomyStructure;
  taxonomyType: TaxonomyType;
  standards?: string[];
  version: number;
  status: TaxonomyStatus;
  termCount: number;
  audit: AuditMetadata;
}

export interface TaxonomyTerm {
  id: Identifier;
  taxonomyId: Identifier;
  code: string;
  parentId?: Identifier;
  level: number;
  path: string;
  sortOrder: number;
  labels: LocalizedLabel;
  descriptions?: LocalizedDescription;
  synonyms?: string[];
  aliases?: string[];
  standardCodes?: StandardCodeMap;
  status: TermStatus;
  deprecatedAt?: Timestamp;
  deprecationReason?: string;
  supersededBy?: Identifier;
  mergedInto?: Identifier;
  splitInto?: Identifier[];
  version: number;
  effectiveFrom: Timestamp;
  effectiveUntil?: Timestamp;
  governanceStatus?: GovernanceStatus;
  childCount?: number;
  audit: AuditMetadata;
}

export interface TermSummary {
  id: Identifier;
  code: string;
  labels: { default: string; [locale: string]: string };
  level: number;
  path: string;
  status: TermStatus;
}

export interface TermInput {
  code: string;
  parentCode?: string;
  sortOrder?: number;
  labels: { default: string; [locale: string]: string };
  descriptions?: { [locale: string]: string };
  synonyms?: string[];
  aliases?: string[];
  standardCodes?: StandardCodeMap;
}

export interface EntityTermReference {
  id: Identifier;
  entityType: string;
  entityId: Identifier;
  taxonomyCode: string;
  termId: Identifier;
  termCode: string;
  primary: boolean;
  weight: number;
  assignedBy: AssignedBy;
  assignedAt: Timestamp;
}

export interface TaxonomySearchResult {
  termId: Identifier;
  taxonomyId: Identifier;
  taxonomyCode: string;
  code: string;
  label: string;
  path: string;
  level: number;
  status: TermStatus;
  score: number;
}
