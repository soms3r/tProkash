export interface SystemMetadata {
  width?: number;
  height?: number;
  duration?: number;
  colorSpace?: string;
  dpi?: number;
  pages?: number;
  bitrate?: number;
}

export interface DescriptiveMetadata {
  title?: string;
  altText?: string;
  caption?: string;
  credit?: string;
  copyright?: string;
}

export interface ModerationResult {
  safe: boolean;
  categories?: Record<string, unknown>;
  scores?: Record<string, number>;
}

export interface AIMetadata {
  tags?: string[];
  objects?: string[];
  textDetected?: string;
  moderation?: ModerationResult;
  embedding?: string;
}

export interface CustomMetadata {
  [key: string]: unknown;
}

export interface AssetMetadata {
  system?: SystemMetadata;
  descriptive?: DescriptiveMetadata;
  ai?: AIMetadata;
  custom?: CustomMetadata;
}

export interface LocalizedMetadataFields {
  label?: string;
  description?: string;
  altText?: string;
  caption?: string;
}

export interface LocalizedMetadataMap {
  [locale: string]: LocalizedMetadataFields;
}
