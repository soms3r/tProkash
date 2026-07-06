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
