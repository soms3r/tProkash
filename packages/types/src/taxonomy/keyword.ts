import type { Identifier, Timestamp } from "..";
import type { KeywordSource } from "./types";

export interface Keyword {
  id: Identifier;
  value: string;
  locale?: string;
  entityType: string;
  entityId: Identifier;
  source: KeywordSource;
  weight: number;
  createdAt: Timestamp;
}

export interface KeywordWeight {
  value: string;
  weight: number;
}

export interface SearchKeyword {
  keyword: string;
  entityType: string;
  entityId: Identifier;
  weight: number;
  locale?: string;
}
