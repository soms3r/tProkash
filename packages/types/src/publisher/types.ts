import type { LifecycleState } from "../lifecycle";

export type PublisherType =
  | "COMMERCIAL"
  | "UNIVERSITY"
  | "GOVERNMENT"
  | "NGO"
  | "SELF_PUBLISHING"
  | "DIGITAL_FIRST"
  | "INDEPENDENT"
  | "MAGAZINE"
  | "JOURNAL"
  | "NEWSPAPER"
  | "PRINTING_PRESS"
  | "CHILDREN"
  | "EDUCATIONAL"
  | "ACADEMIC"
  | "RELIGIOUS"
  | "INTERNATIONAL"
  | "OTHER";

export type PublisherSize =
  | "SMALL"
  | "MEDIUM"
  | "LARGE"
  | "ENTERPRISE";

export type PublishingFormat =
  | "PRINT"
  | "EBOOK"
  | "AUDIOBOOK"
  | "BRAILLE"
  | "LARGE_PRINT"
  | "INTERACTIVE"
  | "OPEN_ACCESS"
  | "DIGITAL_FIRST";

export type PublisherTrustLevel =
  | "VERIFIED"
  | "ACCREDITED"
  | "TRUSTED";

export type PublisherState = LifecycleState | PublisherTrustLevel;

export type ImprintType =
  | "PARENT_PUBLISHER"
  | "CHILD_PUBLISHER"
  | "IMPRINT"
  | "PUBLISHING_LABEL"
  | "SERIES_IMPRINT";

export type SocialPlatform =
  | "TWITTER"
  | "FACEBOOK"
  | "INSTAGRAM"
  | "LINKEDIN"
  | "YOUTUBE"
  | "TIKTOK"
  | "BLUESKY"
  | "MASTODON"
  | "THREADS"
  | "OTHER";

export type WebsiteStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING_VERIFICATION"
  | "FAILED_VERIFICATION";

export type SocialAccountStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "NOT_FOUND";

export type OperationalStatus =
  | "ACTIVE"
  | "INACTIVE";
