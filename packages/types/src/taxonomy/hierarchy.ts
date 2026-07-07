import type { TaxonomyTerm } from "./term";
import type { Identifier } from "..";

export interface HierarchyNode {
  term: TaxonomyTerm;
  children: HierarchyNode[];
  depth: number;
}

export interface HierarchyPath {
  ids: Identifier[];
  codes: string[];
  labels: string[];
  pathString: string;
}

export interface TermRelation {
  sourceTermId: Identifier;
  targetTermId: Identifier;
  type: "BROADER" | "NARROWER" | "RELATED" | "EXACT" | "HISTORICAL";
  metadata?: Record<string, unknown>;
}
