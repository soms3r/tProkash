import type { BaseEntity } from "./entity";
import type { DomainEvent } from "./events";

export interface AggregateRoot<TEvent extends DomainEvent = DomainEvent> extends BaseEntity {
  domainEvents: TEvent[];
}
