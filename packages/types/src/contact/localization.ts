import type { ContactName } from "./contact";

export interface LocalizedContactName extends ContactName {
  locale: string;
}

export type LocalizedContactNameMap = Record<string, LocalizedContactName>;
