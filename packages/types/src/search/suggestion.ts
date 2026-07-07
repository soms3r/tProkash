export type SuggestionType =
  | "CORRECTION"
  | "RELATED"
  | "COMPLETION"
  | "PROMOTED";

export interface Suggestion {
  text: string;
  type: SuggestionType;
  score: number;
  entityType?: string;
  entityId?: string;
}

export interface SuggestionGroup {
  originalQuery: string;
  suggestions: Suggestion[];
}
