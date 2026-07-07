import type { Identifier } from "..";
import type { AuditMetadata } from "../domain";
import type { ContactType, ContactStatus } from "./types";
import type { Availability } from "./availability";
import type { ContactMethod } from "./method";
import type { ContactVerification } from "./verification";

export interface ContactName {
  givenName?: string;
  familyName?: string;
  middleName?: string;
  prefix?: string;
  suffix?: string;
  fullName: string;
  nativeScript?: string;
  romanized?: string;
}

export interface Contact {
  id: Identifier;
  type: ContactType;
  label?: string;
  primary: boolean;
  name: ContactName;
  organization?: string;
  department?: string;
  title?: string;
  responsibilities?: string;
  region?: string;
  language?: string;
  timezone?: string;
  availability?: Availability;
  preferredChannels?: ContactVerification[];
  methods: ContactMethod[];
  notes?: string;
  status: ContactStatus;
  audit: AuditMetadata;
}

export interface ContactSummary {
  id: Identifier;
  type: ContactType;
  label?: string;
  primary: boolean;
  name: Pick<ContactName, "fullName">;
  title?: string;
  language?: string;
  status: Exclude<ContactStatus, "DELETED">;
}

export interface ContactInput {
  type: ContactType;
  label?: string;
  primary?: boolean;
  name: ContactName;
  organization?: string;
  department?: string;
  title?: string;
  responsibilities?: string;
  region?: string;
  language?: string;
  timezone?: string;
  availability?: Availability;
  preferredChannels?: ContactVerification[];
  methods?: ContactMethod[];
  notes?: string;
}
