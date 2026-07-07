export type PaginationType =
  | "OFFSET"
  | "CURSOR";

export interface SearchPagination {
  type: PaginationType;
  cursor?: string;
  offset?: number;
  limit: number;
}

export interface CursorPage {
  next?: string;
  previous?: string;
}

export interface OffsetPage {
  offset: number;
  limit: number;
  totalPages: number;
}
