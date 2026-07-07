export interface SlugOptions {
  maxLength: number;
  allowUnicode: boolean;
  separator: string;
  lowercase: boolean;
}

export interface SlugValidation {
  isValid: boolean;
  slug: string;
  errors?: string[];
}

export const DEFAULT_SLUG_OPTIONS: SlugOptions = {
  maxLength: 200,
  allowUnicode: false,
  separator: "-",
  lowercase: true,
};
