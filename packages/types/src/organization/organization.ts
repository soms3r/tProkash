import type { BaseEntity } from "../domain";
import type { WorkflowStatus } from "../lifecycle";
import type { GenericIdentifier } from "../identity";
import type { Address, AddressInput } from "../address";
import type { Contact, ContactInput } from "../contact";
import type { OrgType, OrgState, OrgVerificationLevel } from "./types";
import type { OrganizationRelationship } from "./relationship";
import type { LegalInfo } from "./legal";

export interface Organization extends BaseEntity {
  slug: string;
  name: string;
  nativeName?: string;
  romanizedName?: string;
  englishName?: string;
  aliases?: string[];
  type: OrgType[];
  tagline?: string;
  mission?: string;
  vision?: string;
  description?: string;
  foundedYear?: number;
  active: boolean;
  verificationLevel: OrgVerificationLevel;
  identifiers: GenericIdentifier[];
  relationships: OrganizationRelationship[];
  parentOrganizations: OrganizationSummary[];
  subsidiaries: OrganizationSummary[];
  legal?: LegalInfo;
  addresses: Address[];
  contacts: Contact[];
  branding?: OrganizationBranding;
  lifecycle: WorkflowStatus<OrgState>;
}

export interface OrganizationSummary {
  id: string;
  slug: string;
  name: string;
  type: OrgType[];
  verificationLevel: OrgVerificationLevel;
  active: boolean;
  jurisdiction?: string;
}

export interface OrganizationBranding {
  logo?: string;
  historicalLogos?: string[];
  brandColors?: string[];
  brandAssets?: string[];
}

export interface OrganizationCreate {
  name: string;
  nativeName?: string;
  romanizedName?: string;
  englishName?: string;
  aliases?: string[];
  type: OrgType[];
  tagline?: string;
  mission?: string;
  vision?: string;
  description?: string;
  foundedYear?: number;
  legal?: LegalInfo;
  addresses?: AddressInput[];
  contacts?: ContactInput[];
  branding?: OrganizationBranding;
  parentOrganizationId?: string;
}
