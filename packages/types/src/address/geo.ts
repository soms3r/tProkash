import type { GeoAccuracy, GeocodingProvider } from "./types";

export interface AddressCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: GeoAccuracy;
  source?: GeocodingProvider;
  lastGeocoded?: string;
}
