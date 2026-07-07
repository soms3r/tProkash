import type { Highlight } from "./highlight";
import type { SearchFacet } from "./facet";
import type { CursorPage, OffsetPage } from "./pagination";
import type { Suggestion } from "./suggestion";

export interface SearchHit<T = Record<string, unknown>> {
  score: number;
  rank: number;
  entityType: string;
  entityId: string;
  summary: T;
  highlights?: Highlight;
  attributes?: Record<string, unknown>;
  explanation?: Record<string, number>;
}

export interface SearchResult<T = Record<string, unknown>> {
  total: number;
  page: OffsetPage;
  cursor?: CursorPage;
  results: SearchHit<T>[];
  facets?: SearchFacet[];
  suggestions?: Suggestion[];
  queryTimeMs: number;
}

export interface SearchStats {
  totalDocuments: number;
  queryCount: number;
  averageQueryTime: number;
  zeroResultQueries: number;
  lastUpdated: string;
}

export interface SearchResponse<T = Record<string, unknown>> {
  success: boolean;
  data: SearchResult<T>;
  error?: string;
}
