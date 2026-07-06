export type FilterOperator =
  | "EQ"
  | "NEQ"
  | "GT"
  | "GTE"
  | "LT"
  | "LTE"
  | "IN"
  | "NOT_IN"
  | "LIKE"
  | "ILIKE"
  | "IS_NULL"
  | "IS_NOT_NULL"
  | "BETWEEN"
  | "CONTAINS";

export interface Filter {
  field: string;
  operator: FilterOperator;
  value: unknown;
}
