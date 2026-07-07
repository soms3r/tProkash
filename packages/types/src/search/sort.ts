export type SortOrder =
  | "ASC"
  | "DESC";

export interface SearchSort {
  field: string;
  order: SortOrder;
  mode?: "MIN" | "MAX" | "AVG" | "SUM";
}

export interface BoostRule {
  field: string;
  boost: number;
}

export interface SearchWeight {
  textRelevance: number;
  verificationLevel: number;
  recency: number;
  popularity: number;
  proximity: number;
}
