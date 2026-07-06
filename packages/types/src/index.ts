export type Timestamp = string;

export type Identifier = string & { __brand: "Identifier" };

export interface AuditInfo {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: Identifier;
  updatedBy?: Identifier;
}

export interface BaseEntity {
  id: Identifier;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: Pagination;
}

export * from "./identity";
