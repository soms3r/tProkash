import type { LifecycleState } from "../lifecycle";

export type OrgType =
  | "COMMERCIAL_COMPANY"
  | "NON_PROFIT"
  | "GOVERNMENT"
  | "UNIVERSITY"
  | "SCHOOL"
  | "LIBRARY"
  | "FOUNDATION"
  | "ASSOCIATION"
  | "PUBLISHER_GROUP"
  | "PRINTING_COMPANY"
  | "DISTRIBUTOR"
  | "BOOKSTORE_CHAIN"
  | "RESEARCH_INSTITUTE"
  | "MEDIA_COMPANY"
  | "INTERNATIONAL_ORGANIZATION"
  | "COMMUNITY_ORGANIZATION"
  | "RELIGIOUS_ORGANIZATION"
  | "OTHER";

export type OrgState = LifecycleState | "ACTIVE" | "DISSOLVED" | "RESTORED" | "MERGED";

export type OrgVerificationLevel =
  | "BASIC"
  | "REGISTERED"
  | "VETTED";

export type LegalForm =
  | "LLC"
  | "CORPORATION"
  | "PARTNERSHIP"
  | "SOLE_PROPRIETORSHIP"
  | "CHARITABLE_TRUST"
  | "NONPROFIT_CORPORATION"
  | "GOVERNMENT_AGENCY"
  | "INTERGOVERNMENTAL_ORGANIZATION"
  | "COOPERATIVE"
  | "UNINCORPORATED_ASSOCIATION"
  | "RELIGIOUS_ENTITY"
  | "OTHER";

export type ComplianceStatus =
  | "COMPLIANT"
  | "UNDER_REVIEW"
  | "NON_COMPLIANT";

export type OrgRelationshipType =
  | "PARENT"
  | "SUBSIDIARY"
  | "DIVISION"
  | "DEPARTMENT"
  | "BRANCH"
  | "OFFICE"
  | "AFFILIATE"
  | "PARTNER"
  | "MEMBER"
  | "OWNER"
  | "OPERATOR"
  | "SPONSOR"
  | "FUNDER";


