import type { Identifier, Timestamp } from "..";

export interface DomainEvent {
  eventName: string;
  eventId: string;
  aggregateId: Identifier;
  occurredOn: Timestamp;
  payload?: Record<string, unknown>;
}
