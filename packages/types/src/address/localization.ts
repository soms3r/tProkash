export interface LocalizedAddressFields {
  country?: string;
  state?: string;
  district?: string;
  city?: string;
  postalCode?: string;
  locality?: string;
  street?: string;
  street2?: string;
  building?: string;
  unit?: string;
}

export type LocalizedAddressMap = Record<string, LocalizedAddressFields>;
