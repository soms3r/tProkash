export type AssetCategory =
  | "IMAGE"
  | "DOCUMENT"
  | "AUDIO"
  | "VIDEO"
  | "ARCHIVE"
  | "DATASET"
  | "OTHER";

export type ImageAssetType =
  | "LOGO"
  | "COVER"
  | "PROFILE_PHOTO"
  | "BANNER"
  | "THUMBNAIL"
  | "PREVIEW"
  | "SCREENSHOT"
  | "PHOTOGRAPH"
  | "ILLUSTRATION"
  | "ICON"
  | "QR_CODE"
  | "OTHER_IMAGE";

export type DocumentAssetType =
  | "CERTIFICATE"
  | "CONTRACT"
  | "ISBN_DOCUMENT"
  | "MANUSCRIPT"
  | "MARKETING_MATERIAL"
  | "LICENCE"
  | "REGISTRATION_DOC"
  | "TAX_DOCUMENT"
  | "LEGAL_DOCUMENT"
  | "REPORT"
  | "POLICY"
  | "BRAND_GUIDELINE"
  | "OTHER_DOCUMENT";

export type AudioAssetType =
  | "AUDIOBOOK"
  | "SAMPLE"
  | "INTERVIEW"
  | "PODCAST"
  | "OTHER_AUDIO";

export type VideoAssetType =
  | "TRAILER"
  | "INTERVIEW_VIDEO"
  | "EVENT_RECORDING"
  | "TUTORIAL"
  | "OTHER_VIDEO";

export type ArchiveAssetType =
  | "SOURCE_FILES"
  | "RAW_IMAGES"
  | "BACKUP"
  | "OTHER_ARCHIVE";

export type DatasetAssetType =
  | "METADATA_EXPORT"
  | "ANALYTICS_DATA"
  | "REFERENCE_DATA"
  | "OTHER_DATASET";

export type AssetType =
  | ImageAssetType
  | DocumentAssetType
  | AudioAssetType
  | VideoAssetType
  | ArchiveAssetType
  | DatasetAssetType
  | (string & {});

export type AssetStatus =
  | "UPLOADED"
  | "ACTIVE"
  | "ARCHIVED"
  | "DELETED";

export type AssetVisibility =
  | "PUBLIC"
  | "PRIVATE"
  | "INTERNAL";

export type DerivativeType =
  | "THUMBNAIL_SMALL"
  | "THUMBNAIL_MEDIUM"
  | "THUMBNAIL_LARGE"
  | "PREVIEW"
  | "OPTIMIZED"
  | "PDF_PREVIEW"
  | "AUDIO_SAMPLE"
  | "VIDEO_THUMBNAIL"
  | "VIDEO_PREVIEW"
  | "TRANSCODED"
  | "OCR_TEXT"
  | "CUSTOM";

export type DerivativeStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED";

export type StorageBackendType =
  | "local"
  | "s3"
  | "gcs"
  | "azure"
  | "cdn";

export type StorageClass =
  | "STANDARD"
  | "INTELLIGENT_TIERING"
  | "GLACIER"
  | "DEEP_ARCHIVE";

export type RetentionPolicy =
  | "STANDARD"
  | "EXTENDED"
  | "INDEFINITE";

export type VersionReason =
  | "INITIAL"
  | "UPDATE"
  | "REBRAND"
  | "CORRECTION"
  | "FORMAT_CHANGE"
  | "OTHER";

export type RelationshipEntityType =
  | "ORGANIZATION"
  | "PUBLISHER"
  | "AUTHOR"
  | "BOOK"
  | "EDITION"
  | "PRINTER"
  | "DISTRIBUTOR"
  | "BOOKSTORE"
  | "LIBRARY"
  | "USER"
  | "VERIFICATION"
  | "DOCUMENTATION"
  | (string & {});
