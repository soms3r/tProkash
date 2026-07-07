import type { StandardType } from "./types";

export interface StandardMapping {
  standard: StandardType;
  code: string;
  label?: string;
}

export interface StandardCodeMap {
  [standard: string]: string;
}
