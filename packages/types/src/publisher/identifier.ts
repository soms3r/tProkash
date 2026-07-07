export interface PublisherIdentifierInput {
  type: "EMAIL" | "PHONE" | "WEBSITE" | "REGISTRATION" | "BIN" | "TIN" | "ISBN_PREFIX";
  value: string;
  primary?: boolean;
}
