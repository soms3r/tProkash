export type AddressType =
  | "HEAD_OFFICE"
  | "REGISTERED_OFFICE"
  | "BILLING"
  | "SHIPPING"
  | "WAREHOUSE"
  | "BRANCH"
  | "HOME"
  | "EVENT"
  | "TEMPORARY"
  | "MAILING"
  | "WORK"
  | "VIRTUAL"
  | "LEGAL"
  | "VENUE"
  | "STUDIO"
  | "OTHER";

export type AddressStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "ARCHIVED"
  | "DELETED";

export type PrivacyLevel =
  | "PUBLIC"
  | "PRIVATE"
  | "INTERNAL";

export type GeoAccuracy =
  | "ROOFTOP"
  | "RANGE"
  | "APPROXIMATE"
  | "CENTROID";

export type GeocodingProvider =
  | "GOOGLE"
  | "NOMINATIM"
  | "ARCGIS"
  | "MAPBOX"
  | "HERE"
  | "CUSTOM";

export type AddressVerificationStatus =
  | "UNVERIFIED"
  | "PENDING"
  | "VERIFIED"
  | "EXPIRED"
  | "FAILED"
  | "REVOKED";

export type AddressVerificationMethod =
  | "POSTCARD"
  | "LETTER"
  | "DOCUMENT"
  | "GEOLOCATION"
  | "VISIT"
  | "EXTERNAL_API"
  | "EXISTING_RELATIONSHIP";
