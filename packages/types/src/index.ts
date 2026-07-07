export type Timestamp = string;

export type Identifier = string & { __brand: "Identifier" };

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: PageResultMetadata;
}

export interface PageResultMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export * from "./identity";
export * from "./domain";
export * from "./lifecycle";
export * from "./address";
export * from "./contact";
export * from "./verification";
export * from "./media";
export type {
  SearchQuery,
  SearchHit,
  SearchFacet,
  FacetBucket,
  SearchFilter,
  SearchFilterOperator,
  SearchSort,
  SortOrder,
  SearchPagination,
  PaginationType,
  CursorPage,
  OffsetPage,
  Highlight,
  HighlightFragment,
  Suggestion,
  SuggestionType,
  SuggestionGroup,
  SearchResponse,
  SearchStats,
  SearchEngineCapabilities,
  EngineType,
  SearchMode,
  SearchFieldType,
  TaxonomyExpansion,
  GeoFilter,
  RangeFilter,
  DateRange,
  NumericRange,
  BoostRule,
  SearchWeight,
  Aggregation,
  SearchResult,
} from "./search";
export { SearchError } from "./search";
export * from "./taxonomy";
export * from "./publisher";
export * from "./organization";
