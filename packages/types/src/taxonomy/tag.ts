import type { Identifier, Timestamp } from "..";

export interface Tag {
  id: Identifier;
  label: string;
  locale?: string;
  entityType: string;
  entityId: Identifier;
  createdBy: Identifier;
  createdAt: Timestamp;
}

export interface TagCategory {
  id?: Identifier;
  name: string;
  description?: string;
  color?: string;
}
