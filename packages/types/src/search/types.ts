export type EngineType =
  | "postgresql"
  | "opensearch"
  | "elasticsearch"
  | "meilisearch"
  | "typesense"
  | "algolia"
  | (string & {});

export type SearchMode =
  | "AND"
  | "OR";

export type SearchFieldType =
  | "TEXT"
  | "KEYWORD"
  | "INTEGER"
  | "FLOAT"
  | "DATE"
  | "BOOLEAN"
  | "GEO";

export type TaxonomyExpansion =
  | "EXACT"
  | "IMMEDIATE_CHILDREN"
  | "SUBTREE";

export interface SearchEngineCapabilities {
  fullText: boolean;
  exact: boolean;
  prefix: boolean;
  fuzzy: boolean;
  phonetic: boolean;
  autocomplete: boolean;
  faceted: boolean;
  geo: boolean;
  cursorPagination: boolean;
  fieldBoosting: boolean;
  highlight: boolean;
  suggestions: boolean;
  synonymExpansion: boolean;
  taxonomyExpansion: boolean;
}

export class SearchError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly occurredOn: string;

  constructor(code: string, message: string, statusCode: number = 500) {
    super(message);
    this.name = "SearchError";
    this.code = code;
    this.statusCode = statusCode;
    this.occurredOn = new Date().toISOString();
  }
}
