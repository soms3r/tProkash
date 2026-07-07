export interface HighlightFragment {
  field: string;
  fragments: string[];
}

export interface Highlight {
  [field: string]: string[];
}
