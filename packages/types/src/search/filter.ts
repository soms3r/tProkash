export type SearchFilterOperator =
  | "EQ"
  | "NEQ"
  | "IN"
  | "NIN"
  | "GT"
  | "GTE"
  | "LT"
  | "LTE"
  | "EXISTS"
  | "NOT_EXISTS"
  | "PREFIX"
  | "WITHIN_RADIUS"
  | "WITHIN_BOUNDING_BOX"
  | "WITHIN_POLYGON";

export interface SearchFilter {
  field: string;
  operator: SearchFilterOperator;
  value?: unknown;
  values?: unknown[];
  latitude?: number;
  longitude?: number;
  radius?: string;
  topLeft?: { latitude: number; longitude: number };
  bottomRight?: { latitude: number; longitude: number };
  polygon?: { latitude: number; longitude: number }[];
}

export interface GeoFilter {
  field: string;
  latitude: number;
  longitude: number;
  radius?: string;
  topLeft?: { latitude: number; longitude: number };
  bottomRight?: { latitude: number; longitude: number };
  polygon?: { latitude: number; longitude: number }[];
}

export interface DateRange {
  field: string;
  gte?: string;
  lte?: string;
  gt?: string;
  lt?: string;
}

export interface NumericRange {
  field: string;
  gte?: number;
  lte?: number;
  gt?: number;
  lt?: number;
}

export interface RangeFilter {
  field: string;
  gte?: number | string;
  lte?: number | string;
  gt?: number | string;
  lt?: number | string;
}
