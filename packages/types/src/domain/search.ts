import type { Filter } from "./filter";
import type { Sort } from "./sorting";

export interface SearchRequest {
  query?: string;
  filter?: Filter[];
  sort?: Sort[];
  page?: number;
  limit?: number;
}

export interface SearchResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  query?: string;
}
