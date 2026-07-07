import type { OperationalStatus } from "./types";

export interface PublisherCountryRecord {
  country: string;
  region?: string;
  languages?: string[];
  primary: boolean;
  operationalStatus: OperationalStatus;
  localWebsite?: string;
  localCurrency?: string;
  taxJurisdiction?: string;
  timezone?: string;
}

export interface PublisherGeographicMetadata {
  countriesServed: string[];
  regionsServed?: string[];
  primaryCountry?: string;
  primaryTimezone?: string;
  operatingRegions?: string[];
}
