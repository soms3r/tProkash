import type { StorageBackendType, StorageClass } from "./types";

export interface StorageRecord {
  backend: StorageBackendType;
  bucket: string;
  key: string;
  region?: string;
  endpoint?: string;
  storageClass?: StorageClass;
}

export interface CDNRecord {
  url: string;
  enabled: boolean;
  distributionId?: string;
  purgedAt?: string;
}
