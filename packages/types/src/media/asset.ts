import type { Identifier, Timestamp } from "..";
import type { AuditMetadata } from "../domain/audit";
import type { BaseEntity } from "../domain/entity";
import type { ContentHash } from "./checksum";
import type { AssetMetadata, LocalizedMetadataMap } from "./metadata";
import type { StorageRecord, CDNRecord } from "./storage";
import type { AssetVersion } from "./version";
import type { AssetDerivative } from "./derivative";
import type {
  AssetCategory,
  AssetType,
  AssetStatus,
  AssetVisibility,
  RetentionPolicy,
} from "./types";

export interface Asset extends BaseEntity {
  category: AssetCategory;
  type: AssetType;
  label?: string;
  description?: string;
  filename: string;
  extension: string;
  mimeType: string;
  size: number;
  hash: ContentHash;
  width?: number;
  height?: number;
  duration?: number;
  language?: string;
  metadata: AssetMetadata;
  derivatives: AssetDerivative[];
  currentVersion: number;
  versionCount: number;
  versions: AssetVersion[];
  storage: StorageRecord;
  cdn?: CDNRecord;
  checksum: ContentHash;
  visibility: AssetVisibility;
  status: AssetStatus;
  retention?: RetentionPolicy;
  localized?: LocalizedMetadataMap;
  holdUntil?: Timestamp;
  audit: AuditMetadata;
}

export interface AssetSummary {
  id: Identifier;
  category: AssetCategory;
  type: AssetType;
  label?: string;
  filename: string;
  mimeType: string;
  size: number;
  hash: ContentHash;
  width?: number;
  height?: number;
  url?: string;
  thumbnailUrl?: string;
  visibility: AssetVisibility;
  status: AssetStatus;
}

export interface AssetUpload {
  type: AssetType;
  label?: string;
  description?: string;
  language?: string;
  visibility?: AssetVisibility;
  metadata?: AssetMetadata;
  localized?: LocalizedMetadataMap;
  entityType: string;
  entityId: Identifier;
  relationshipType: AssetType;
}

export interface AssetUpdate {
  label?: string;
  description?: string;
  language?: string;
  visibility?: AssetVisibility;
  metadata?: AssetMetadata;
  localized?: LocalizedMetadataMap;
  versionReason?: string;
}
