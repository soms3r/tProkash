import type { Identifier, Timestamp } from "..";
import type { ContentHash } from "./checksum";
import type { VersionReason } from "./types";

export interface AssetVersion {
  version: number;
  assetId: Identifier;
  previousVersion?: Identifier;
  nextVersion?: Identifier;
  hash: ContentHash;
  size: number;
  filename: string;
  createdAt: Timestamp;
  createdBy: Identifier;
  reason: VersionReason;
}
