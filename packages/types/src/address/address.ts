import type { Identifier } from "..";
import type { AuditMetadata } from "../domain";
import type { AddressType, AddressStatus, PrivacyLevel } from "./types";
import type { AddressCoordinates } from "./geo";
import type { AddressValidation } from "./verification";
import type { LocalizedAddressMap } from "./localization";

export interface Address {
  id: Identifier;
  type: AddressType;
  label?: string;
  primary: boolean;
  country: string;
  state?: string;
  district?: string;
  city?: string;
  postalCode?: string;
  locality?: string;
  street?: string;
  street2?: string;
  building?: string;
  unit?: string;
  postOfficeBox?: string;
  raw?: string;
  timezone?: string;
  language?: string;
  coordinates?: AddressCoordinates;
  localized?: LocalizedAddressMap;
  privacy: PrivacyLevel;
  status: AddressStatus;
  validation?: AddressValidation;
  lifecycle?: Record<string, unknown>;
  audit: AuditMetadata;
}

export interface AddressSummary {
  id: Identifier;
  type: AddressType;
  label?: string;
  primary: boolean;
  country: string;
  state?: string;
  city?: string;
  privacy: PrivacyLevel;
  status: AddressStatus;
}

export interface AddressInput {
  type: AddressType;
  label?: string;
  primary?: boolean;
  country: string;
  state?: string;
  district?: string;
  city?: string;
  postalCode?: string;
  locality?: string;
  street?: string;
  street2?: string;
  building?: string;
  unit?: string;
  postOfficeBox?: string;
  raw?: string;
  timezone?: string;
  coordinates?: AddressCoordinates;
  localized?: LocalizedAddressMap;
  privacy?: PrivacyLevel;
}
