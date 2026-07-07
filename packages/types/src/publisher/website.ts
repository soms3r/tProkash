import type { Timestamp } from "..";
import type { VerificationMethodType } from "../verification";
import type { WebsiteStatus } from "./types";

export interface PublisherWebsite {
  url: string;
  primary: boolean;
  verified: boolean;
  verificationMethod?: VerificationMethodType;
  verificationDate?: Timestamp;
  verificationExpiresAt?: Timestamp;
  lastCheckedAt?: Timestamp;
  status: WebsiteStatus;
}

export interface PublisherWebsiteInput {
  url: string;
  primary?: boolean;
}
