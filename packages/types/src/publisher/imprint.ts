import type { Identifier, Timestamp } from "..";
import type { ImprintType } from "./types";

export interface PublisherImprint {
  id: Identifier;
  name: string;
  slug: string;
  type: ImprintType;
  parentPublisherId?: Identifier;
  childImprints?: PublisherImprint[];
  description?: string;
  foundedYear?: number;
  active: boolean;
}

export interface HistoricalPublisherName {
  name: string;
  type: "FORMER_NAME" | "FORMER_LEGAL_NAME" | "ALIAS" | "TRADE_NAME" | "NATIVE_NAME" | "ROMANIZED_NAME" | "ENGLISH_NAME";
  effectiveFrom: Timestamp;
  effectiveUntil?: Timestamp;
  audit: {
    changedBy?: string;
    changedAt: Timestamp;
  };
}
