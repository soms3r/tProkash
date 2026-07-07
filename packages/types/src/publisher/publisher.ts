import type { BaseEntity } from "../domain";
import type { WorkflowStatus } from "../lifecycle";
import type { GenericIdentifier } from "../identity";
import type {
  PublisherType,
  PublisherSize,
  PublisherTrustLevel,
  PublishingFormat,
  PublisherState,
} from "./types";
import type { PublisherWebsite, PublisherWebsiteInput } from "./website";
import type { PublisherSocialAccount, PublisherSocialAccountInput } from "./social";
import type { PublisherContact, PublisherContactInput } from "./contact";
import type { PublisherIdentifierInput } from "./identifier";
import type { PublisherImprint, HistoricalPublisherName } from "./imprint";
import type { PublisherCountryRecord, PublisherGeographicMetadata } from "./country";

export interface Publisher extends BaseEntity {
  slug: string;
  type: PublisherType[];
  name: string;
  nativeName?: string;
  romanizedName?: string;
  englishName?: string;
  aliases?: string[];
  tagline?: string;
  description?: string;
  mission?: string;
  foundedYear?: number;
  publisherSize?: PublisherSize;
  logo?: string;
  coverImage?: string;
  languages: string[];
  subjects?: string[];
  formats: PublishingFormat[];
  geographic: PublisherGeographicMetadata;
  countryRecords?: PublisherCountryRecord[];
  parentPublisher?: PublisherSummary;
  imprints?: PublisherImprint[];
  websites?: PublisherWebsite[];
  socialAccounts?: PublisherSocialAccount[];
  contacts?: PublisherContact[];
  publicContact?: string;
  trustLevel: PublisherTrustLevel;
  active: boolean;
  identifiers: GenericIdentifier[];
  historicalNames?: HistoricalPublisherName[];
  lifecycle: WorkflowStatus<PublisherState>;
  accessibilityStatement?: string;
  certifications?: string[];
}

export interface PublisherSummary {
  id: string;
  slug: string;
  name: string;
  type: PublisherType[];
  trustLevel: PublisherTrustLevel;
  active: boolean;
  logo?: string;
  languages?: string[];
  primaryCountry?: string;
}

export interface PublisherCreate {
  type: PublisherType[];
  name: string;
  nativeName?: string;
  romanizedName?: string;
  englishName?: string;
  aliases?: string[];
  tagline?: string;
  description?: string;
  mission?: string;
  foundedYear?: number;
  publisherSize?: PublisherSize;
  languages: string[];
  subjects?: string[];
  formats?: PublishingFormat[];
  primaryCountry?: string;
  parentPublisherId?: string;
  websites?: PublisherWebsiteInput[];
  identifiers?: PublisherIdentifierInput[];
  contacts?: PublisherContactInput[];
  socialAccounts?: PublisherSocialAccountInput[];
}
