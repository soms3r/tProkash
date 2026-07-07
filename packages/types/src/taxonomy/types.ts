export type TaxonomyType =
  | "subject"
  | "genre"
  | "audience"
  | "education_level"
  | "language"
  | "format"
  | "publisher_specialization"
  | "award_category"
  | "event_type"
  | "binding"
  | "reading_level"
  | "age_range"
  | "content_warning"
  | "custom"
  | (string & {});

export type TaxonomyStructure =
  | "HIERARCHICAL"
  | "FLAT";

export type TaxonomyStatus =
  | "ACTIVE"
  | "DEPRECATED"
  | "RETIRED";

export type TermStatus =
  | "ACTIVE"
  | "DEPRECATED"
  | "RETIRED";

export type GovernanceStatus =
  | "SUGGESTED"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE";

export type GovernanceRole =
  | "CONTRIBUTOR"
  | "TAXONOMY_MANAGER"
  | "STANDARDS_OWNER"
  | "ADMINISTRATOR";

export type StandardType =
  | "BISAC"
  | "BIC"
  | "THEMA"
  | "CUSTOM"
  | (string & {});

export type RelationType =
  | "BROADER"
  | "NARROWER"
  | "RELATED"
  | "EXACT"
  | "HISTORICAL";

export type KeywordSource =
  | "PUBLISHER"
  | "SYSTEM"
  | "AI_EXTRACTED";

export type AssignedBy =
  | "PUBLISHER"
  | "SYSTEM"
  | "AI";

export type SynonymType =
  | "EXACT"
  | "RELATED";

export type AliasScope =
  | "INTERNAL"
  | "EXTERNAL";

export type TermChangeReason =
  | "BISAC_UPDATE"
  | "BIC_UPDATE"
  | "THEMA_UPDATE"
  | "CUSTOM_UPDATE"
  | "MERGE"
  | "SPLIT"
  | "RENAME"
  | "REPARENT"
  | "DEPRECATION"
  | "RETIREMENT"
  | "IMPORT"
  | "OTHER";
