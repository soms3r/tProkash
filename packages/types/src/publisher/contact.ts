import type { ContactType } from "../contact";
import type { Visibility } from "../identity";

export interface PublisherContact {
  name: string;
  role: ContactType;
  email?: string;
  phone?: string;
  visibility: Visibility;
  notes?: string;
}

export interface PublisherContactInput {
  name: string;
  role: ContactType;
  email?: string;
  phone?: string;
  notes?: string;
}
