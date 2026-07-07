export interface LocalizedLabel {
  default: string;
  [locale: string]: string;
}

export interface LocalizedDescription {
  [locale: string]: string;
}
