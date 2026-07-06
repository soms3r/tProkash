# @tprokash/types

Shared TypeScript type definitions for all tProkash entities and contracts.

**Stack:** TypeScript

**Depends on:** None (zero-dependency package)

**Used by:** Every package, app, and service

---

## Domain Layer

The domain module (`src/domain/`) provides generic, reusable contracts that every business entity inherits.

### Architecture

```
┌─────────────────────────────────────┐
│          AggregateRoot              │
│  (publishes DomainEvents)           │
├─────────────────────────────────────┤
│          BaseEntity                 │
│  - id: Identifier                   │
│  - audit: AuditMetadata             │
│  - domainEvents: DomainEvent[]      │
└────────────┬────────────────────────┘
             │ implements
             ▼
┌─────────────────────────────────────┐
│      Repository<T>                  │
│  - findById(id)                     │
│  - findAll(request)                 │
│  - save(entity)                     │
│  - update(entity)                   │
│  - delete(id)                       │
│  - search(request)                  │
└─────────────────────────────────────┘
```

### Core Contracts

#### BaseEntity

```ts
interface BaseEntity {
  id: Identifier;       // branded string ID
  audit: AuditMetadata; // creation, update, and deletion trail
}
```

Every business entity extends `BaseEntity`.

#### AggregateRoot

```ts
interface AggregateRoot<TEvent extends DomainEvent = DomainEvent> extends BaseEntity {
  domainEvents: TEvent[];
}
```

An `AggregateRoot` is an entity that publishes `DomainEvent`s. Changes to the aggregate produce events that other parts of the system consume.

#### Repository Pattern

```ts
interface Repository<T extends BaseEntity, TId extends Identifier = Identifier> {
  findById(id: TId): Promise<T | null>;
  findAll(request?: PageRequest): Promise<PageResult<T>>;
  save(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: TId): Promise<void>;
  exists(id: TId): Promise<boolean>;
  count(filter?: Filter[]): Promise<number>;
  search(request: SearchRequest): Promise<SearchResult<T>>;
}
```

The `Repository` interface is generic and framework-agnostic. Implementations can use any persistence strategy (PostgreSQL via Drizzle, in-memory, etc.).

---

## Pagination

#### PageRequest

```ts
interface PageRequest {
  page: number;       // 1-indexed
  limit: number;      // items per page
  sort?: Sort[];      // optional sorting
}
```

#### PageResult

```ts
interface PageResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
```

---

## Search

#### SearchRequest

```ts
interface SearchRequest {
  query?: string;     // free-text search
  filter?: Filter[];  // structured filters
  sort?: Sort[];
  page?: number;
  limit?: number;
}
```

#### SearchResult

```ts
interface SearchResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  query?: string;     // echoed back for context
}
```

---

## Sorting

```ts
type SortDirection = "ASC" | "DESC";

interface Sort {
  field: string;
  direction: SortDirection;
}
```

---

## Filter

```ts
type FilterOperator =
  | "EQ"         // equal
  | "NEQ"        // not equal
  | "GT"         // greater than
  | "GTE"        // greater than or equal
  | "LT"         // less than
  | "LTE"        // less than or equal
  | "IN"         // in array
  | "NOT_IN"     // not in array
  | "LIKE"       // SQL LIKE
  | "ILIKE"      // case-insensitive LIKE
  | "IS_NULL"    // is null
  | "IS_NOT_NULL"// is not null
  | "BETWEEN"    // between two values
  | "CONTAINS";  // array contains

interface Filter {
  field: string;
  operator: FilterOperator;
  value: unknown;
}
```

Multiple filters are typically combined with AND logic at the repository level.

---

## Domain Events

```ts
interface DomainEvent {
  eventName: string;
  eventId: string;
  aggregateId: Identifier;
  occurredOn: Timestamp;
  payload?: Record<string, unknown>;
}
```

Events are produced by `AggregateRoot`s and consumed by event handlers for side effects (notifications, analytics, integrations).

---

## Error Hierarchy

```
Error
 └── DomainError (abstract)
      ├── NotFoundError     (404)
      ├── ValidationError   (400)
      └── ConflictError     (409)
```

```ts
abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  readonly occurredOn: string;
}

class NotFoundError extends DomainError      // code: "NOT_FOUND"
class ValidationError extends DomainError     // code: "VALIDATION_ERROR"
class ConflictError extends DomainError       // code: "CONFLICT"
```

Each error has a machine-readable `code` and HTTP `statusCode` for API responses.

---

## Metadata

Arbitrary key-value metadata that can be attached to any entity.

```ts
interface Metadata {
  key: string;
  value: string;
  namespace?: string;
}

interface MetadataMap {
  [namespace: string]: Record<string, string>;
}
```

---

## Identity Architecture

The identity module (`src/identity/`) provides a generic, reusable identifier framework.

### GenericIdentifier

Every entity can have **many identifiers**, but exactly **one primary identifier**.

```ts
interface GenericIdentifier {
  id: string;
  entityId: string;
  type: IdentifierType;
  value: string;
  slug?: string;
  source: IdentifierSource;
  isPrimary: boolean;
  status: IdentifierStatus;
  visibility: Visibility;
  verification?: IdentifierVerification;
  ownership?: Ownership;
  audit: AuditMetadata;
  deletedAt?: Timestamp;
}
```

### Identifier Types

| Type | Description |
|------|-------------|
| `UUID` | System-generated unique identifier |
| `SLUG` | URL-friendly textual identifier |
| `REGISTRATION_NUMBER` | Government/business registration |
| `TRADE_LICENSE` | Trade license number |
| `BIN` | Business Identification Number |
| `TIN` | Tax Identification Number |
| `ISBN_PREFIX` | ISBN publisher prefix |
| `WEBSITE` | Website URL |
| `EMAIL` | Email address |
| `PHONE` | Phone number |
| `EXTERNAL_REGISTRY_ID` | ID from an external registry |
| `CUSTOM` | Custom identifier type |

### Identifier Sources

| Source | Description |
|--------|-------------|
| `SYSTEM` | Auto-generated by the system (e.g., UUID) |
| `USER` | Provided by the user during data entry |
| `EXTERNAL` | Imported from an external system |
| `MIGRATION` | Migrated from a legacy system |
| `API` | Created via API integration |

---

## Identifier Lifecycle

```
ACTIVE ──→ INACTIVE ──→ ACTIVE
ACTIVE ──→ SUSPENDED ──→ ACTIVE
ACTIVE ──→ RETIRED ──→ HISTORICAL
```

### Primary Identifier Rules

1. Each entity MUST have exactly **one** primary identifier at all times.
2. The primary identifier must have status `ACTIVE`.
3. When the primary identifier is retired, another identifier MUST be promoted to primary.
4. A retired identifier cannot be primary.

---

## Verification Lifecycle

```
PENDING ──→ VERIFIED ──→ EXPIRED ──→ VERIFIED
PENDING ──→ FAILED
VERIFIED ──→ REVOKED
```

---

## AuditMetadata

```ts
interface AuditMetadata {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: Identifier;
  updatedBy?: Identifier;
  deletedAt?: Timestamp;
  deletedBy?: Identifier;
  version: number;
}
```

All entities carry audit metadata for tracking creation, updates, soft deletion, and optimistic concurrency (`version`).

---

## Shared Foundation Types

```ts
type Timestamp = string;                             // ISO 8601 string
type Identifier = string & { __brand: "Identifier" }; // branded entity ID

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: PageResultMetadata;
}

interface PageResultMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```
