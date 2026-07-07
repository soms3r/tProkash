export interface Metadata {
  key: string;
  value: string;
  namespace?: string;
}

export interface MetadataMap {
  [namespace: string]: Record<string, string>;
}
