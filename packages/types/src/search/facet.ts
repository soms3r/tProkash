export interface FacetBucket {
  value: string;
  label?: string;
  count: number;
}

export interface SearchFacet {
  field: string;
  buckets: FacetBucket[];
}

export interface Aggregation {
  field: string;
  type: "TERMS" | "RANGE" | "DATE_RANGE" | "HISTOGRAM" | "GEOHASH_GRID";
  buckets: FacetBucket[];
}
