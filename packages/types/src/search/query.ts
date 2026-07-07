import type { SearchFilter } from "./filter";
import type { SearchSort } from "./sort";
import type { SearchPagination } from "./pagination";
import type { SearchMode, TaxonomyExpansion } from "./types";

export interface SearchQuery {
  q?: string;
  language?: string;
  entityTypes?: string[];
  filters?: SearchFilter[];
  facets?: string[];
  sort?: SearchSort | SearchSort[];
  pagination: SearchPagination;
  searchAfter?: string;
  minScore?: number;
  explain?: boolean;
  mode?: SearchMode;
  taxonomyExpansion?: TaxonomyExpansion;
  synonyms?: boolean;
  fields?: string[];
  searchableFields?: { field: string; boost: number }[];
}

export interface SearchRequest {
  index: string;
  query: SearchQuery;
}
