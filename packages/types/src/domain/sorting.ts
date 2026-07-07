export type SortDirection = "ASC" | "DESC";

export interface Sort {
  field: string;
  direction: SortDirection;
}
