import type { Visibility } from "../identity";
import type { SocialPlatform, SocialAccountStatus } from "./types";

export interface PublisherSocialAccount {
  platform: SocialPlatform;
  url: string;
  username?: string;
  verified: boolean;
  primary: boolean;
  visibility: Visibility;
  lastCheckedAt?: string;
  status: SocialAccountStatus;
}

export interface PublisherSocialAccountInput {
  platform: SocialPlatform;
  url: string;
  username?: string;
  primary?: boolean;
}
