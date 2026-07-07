import type { Sort } from "./sorting";

export interface PageRequest {
  page: number;
  limit: number;
  sort?: Sort[];
}

export interface PageResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
