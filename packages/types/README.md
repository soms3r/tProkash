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

## Sorting

```ts
type SortDirection = "ASC" | "DESC";

interface Sort {
  field: string;
  direction: SortDirection;
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

## Lifecycle Framework

The lifecycle module (`src/lifecycle/`) provides a generic state machine framework that every business entity uses to manage its state transitions.

### Architecture

```
            WorkflowDefinition
  ┌─────────────────────────────────────┐
  │  initialState: Draft                │
  │  allowedTransitions: [{from, to}]   │
  │  terminalStates: [Archived,Deleted] │
  └──────────┬──────────────────────────┘
             │ validates
             ▼
         Entity State
  ┌─────────────────────────────────────┐
  │  currentState: Published            │
  │  enteredAt: "2026-07-06T..."        │
  │  history: LifecycleHistory[]        │
  └─────────────────────────────────────┘
```

### Base States

Every entity starts with these base states. Custom states can be added per entity.

| State | Description |
|-------|-------------|
| `DRAFT` | Initial creation, not yet ready for review |
| `IMPORTED` | Imported from an external source |
| `PENDING_REVIEW` | Awaiting human review |
| `PENDING_VERIFICATION` | Awaiting verification (email, document, etc.) |
| `VERIFIED` | Successfully verified |
| `PUBLISHED` | Live and visible |
| `SUSPENDED` | Temporarily disabled |
| `ARCHIVED` | No longer active, preserved for audit |
| `DELETED` | Soft-deleted |

### LifecycleState

```ts
type LifecycleState = BaseState | (string & {});

// Use BASE_STATES constant for iteration:
import { BASE_STATES } from "@tprokash/types";
// ["DRAFT", "IMPORTED", "PENDING_REVIEW", ...]
```

---

## Workflow Definition

A `WorkflowDefinition` defines the legal state machine for an entity.

```ts
interface WorkflowDefinition<TState = LifecycleState> {
  initialState: TState;
  allowedTransitions: AllowedTransition<TState>[];
  terminalStates: TState[];
  customStates?: TState[];
  config?: WorkflowConfig;
}
```

### allowedTransitions

```ts
interface AllowedTransition<TState = string> {
  from: TState;
  to: TState;
  label?: string;
  requireReason?: boolean;
  requireVerification?: boolean;
  allowedActorTypes?: string[];
}
```

Defines every legal from→to pair. If a transition is not listed, it is forbidden.

### Example: Publishing Workflow

```ts
const publisherWorkflow: WorkflowDefinition = {
  initialState: "DRAFT",
  allowedTransitions: [
    { from: "DRAFT", to: "PENDING_REVIEW", label: "Submit for Review" },
    { from: "PENDING_REVIEW", to: "DRAFT", label: "Send Back to Draft", requireReason: true },
    { from: "PENDING_REVIEW", to: "VERIFIED", label: "Verify" },
    { from: "VERIFIED", to: "PUBLISHED", label: "Publish" },
    { from: "PUBLISHED", to: "SUSPENDED", label: "Suspend", requireReason: true },
    { from: "SUSPENDED", to: "PUBLISHED", label: "Reinstate" },
    { from: "PUBLISHED", to: "ARCHIVED", label: "Archive" },
    { from: "*", to: "DELETED", label: "Soft Delete", requireReason: true },
  ],
  terminalStates: ["ARCHIVED", "DELETED"],
};
```

---

## Transition History

Every state change is recorded as a `LifecycleHistory` entry.

```ts
interface LifecycleHistory<TState = string> extends LifecycleTransition<TState> {
  id: string;                  // unique history entry ID
  sequenceNumber: number;      // monotonically increasing
  rollbackOf?: string;         // ID of the transition being rolled back
  rollbackTarget?: TState;     // state to restore on rollback
}
```

### LifecycleTransition

```ts
interface LifecycleTransition<TState = LifecycleState> {
  from: TState;
  to: TState;
  actor: LifecycleActor;
  reason: TransitionReason;
  timestamp: Timestamp;
  source?: string;
  metadata?: Record<string, unknown>;
}
```

### Rollback Support

Each history entry can reference a `rollbackOf` ID. To rollback a transition:

1. Create a new transition from the current state back to the original state.
2. Set `rollbackOf` to the ID of the transition being undone.
3. Set `rollbackTarget` to the original state.

The history forms an append-only log. Rolls back are **new entries**, not deletions.

---

## Actor

Who or what performed the transition.

```ts
type ActorType = "USER" | "SYSTEM" | "SERVICE" | "API" | "AUTOMATION";

interface LifecycleActor {
  type: ActorType;
  id?: string;     // user ID, service name, etc.
  label?: string;  // human-readable display name
}
```

---

## Transition Reason

Why the transition occurred.

```ts
type TransitionReasonType =
  | "MANUAL"       // performed by a human
  | "IMPORT"       // bulk import process
  | "SYSTEM"       // system-initiated
  | "API"          // external API call
  | "VERIFICATION" // verification succeeded/failed
  | "MIGRATION"    // migrated from legacy system
  | "AUTOMATION"   // automated workflow
  | "UNKNOWN";     // unclassified

type TransitionSource =
  | "USER_INTERFACE"
  | "API"
  | "IMPORT"
  | "MIGRATION"
  | "SYSTEM"
  | "EXTERNAL"
  | "SCHEDULED_TASK";

interface TransitionReason {
  type: TransitionReasonType;
  detail?: string;
  source?: TransitionSource;
  timestamp?: Timestamp;
}
```

---

## Workflow Status

The current status of an entity within its workflow.

```ts
interface StatusInfo<TState = LifecycleState> {
  currentState: TState;
  enteredAt: Timestamp;
  actor?: LifecycleActor;
  reason?: TransitionReason;
  metadata?: Record<string, unknown>;
}

interface WorkflowStatus<TState = LifecycleState> {
  definition: WorkflowDefinition<TState>;
  current: StatusInfo<TState>;
  lastTransition?: LifecycleHistory<TState>;
  availableTransitions: TState[];
  totalTransitions: number;
  isTerminal: boolean;
}
```

---

## Extending Workflows

To add custom states for a specific entity:

```ts
type PublisherState = LifecycleState | "REGISTERED" | "DUE_DILIGENCE";

const publisherWorkflow: WorkflowDefinition<PublisherState> = {
  initialState: "DRAFT",
  allowedTransitions: [
    { from: "DRAFT", to: "REGISTERED" },
    { from: "REGISTERED", to: "DUE_DILIGENCE" },
    { from: "DUE_DILIGENCE", to: "VERIFIED" },
    // ... base states are also available
  ],
  terminalStates: ["ARCHIVED", "DELETED"],
  customStates: ["REGISTERED", "DUE_DILIGENCE"],
};
```

---

## Rollback Philosophy

- Transitions are **append-only**. History is never mutated or deleted.
- Rollback creates a **new transition** from current state back to the original state.
- The `rollbackOf` field links the rollback entry to the original transition.
- This preserves a complete audit trail of all state changes.
- Soft delete (`DELETED` state) uses the same transition mechanism — no separate table needed.

---

## Integration with Identity

When combined with the identity framework, each entity has both:

1. A set of `GenericIdentifier`s (UUID, slug, email, etc.)
2. A `WorkflowStatus` tracking its lifecycle

The primary identifier is established when the entity enters `PUBLISHED` state.

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

---

## Address Framework

The address module (`src/address/`) provides a universal, reusable address model described in [RFC-0006](../rfcs/draft/RFC-0006-address-framework.md).

### Core Interface

```ts
interface Address {
  id: Identifier;
  type: AddressType;       // see types below
  label?: string;
  primary: boolean;
  country: string;          // only required field
  state?: string;
  district?: string;
  city?: string;
  postalCode?: string;
  locality?: string;
  street?: string;
  street2?: string;
  building?: string;
  unit?: string;
  postOfficeBox?: string;
  raw?: string;
  timezone?: string;
  language?: string;
  coordinates?: AddressCoordinates;
  localized?: LocalizedAddressMap;
  privacy: PrivacyLevel;
  status: AddressStatus;
  validation?: AddressValidation;
  lifecycle?: Record<string, unknown>;
  audit: AuditMetadata;
}
```

### Address Types

| Type | Description |
|------|-------------|
| `HEAD_OFFICE` | Primary legal headquarters |
| `REGISTERED_OFFICE` | Official registered address |
| `BILLING` | Invoice and payment address |
| `SHIPPING` | Physical delivery address |
| `WAREHOUSE` | Storage and distribution |
| `BRANCH` | Branch office location |
| `HOME` | Residential/private address |
| `EVENT` | Temporary event location |
| `TEMPORARY` | Short-term address |
| `MAILING` | Postal correspondence |
| `WORK` | Workplace address |
| `VIRTUAL` | Virtual office address |
| `LEGAL` | Legal service address |
| `VENUE` | Event venue address |
| `STUDIO` | Creative workspace |
| `OTHER` | Any other address type |

### Privacy & Status

- **Privacy**: `PUBLIC` (visible to all), `PRIVATE` (owner only), `INTERNAL` (internal staff)
- **Status**: `ACTIVE`, `INACTIVE`, `ARCHIVED`, `DELETED`

### Geolocation

```ts
interface AddressCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: GeoAccuracy;  // ROOFTOP | RANGE | APPROXIMATE | CENTROID
  source?: GeocodingProvider;
  lastGeocoded?: string;
}
```

### Validation & Verification

Two-tier model:
1. **Format validation** — is the address structurally valid?
2. **Existence verification** — does the address actually exist?

```ts
interface AddressVerification {
  status: AddressVerificationStatus;
  method?: AddressVerificationMethod;
  verifiedAt?: string;
  expiresAt?: string;
  verifiedBy?: string;
}
```

Verification methods: `POSTCARD`, `LETTER`, `DOCUMENT`, `GEOLOCATION`, `VISIT`, `EXTERNAL_API`, `EXISTING_RELATIONSHIP`.

### Localization

Supports localized address fields per locale via `LocalizedAddressMap` — useful for multi-language addresses in international contexts.

### Immutable History

Each address change creates an append-only `AddressHistoryEntry` linked via `supersedes`/`supersededBy`. The previous snapshot is preserved and never mutated.

### Organization Integration

`Organization.addresses` now uses the shared `Address` type (was `OrganizationAddress`). All 16 `AddressType` values are available — not just the original 7.

---

## Contact Framework

The contact module (`src/contact/`) provides a universal, reusable contact model described in [RFC-0007](../rfcs/draft/RFC-0007-contact-framework.md). It separates **who** the contact is (Contact entity) from **how** they are reached (ContactMethod value object).

### Core Architecture

```
Contact (entity)                   ContactMethod (value object)
────────────────                   ─────────────────────────────
Who is the person?                 How do we reach them?
What is their role?                What channel do we use?
When are they available?           Is the channel verified?
What language do they prefer?      Is the channel public?
                                   What is the actual address/value?
```

### ContactName

```ts
interface ContactName {
  givenName?: string;
  familyName?: string;
  middleName?: string;
  prefix?: string;
  suffix?: string;
  fullName: string;        // required
  nativeScript?: string;   // native writing system
  romanized?: string;       // Latin transliteration
}
```

Names support full Unicode. Only `fullName` is required.

### Contact Entity

```ts
interface Contact {
  id: Identifier;
  type: ContactType;           // 16 types (see below)
  label?: string;
  primary: boolean;
  name: ContactName;
  organization?: string;
  department?: string;
  title?: string;
  responsibilities?: string;
  region?: string;
  language?: string;           // BCP-47 tag
  timezone?: string;           // IANA timezone
  availability?: Availability;
  preferredChannels?: { method: string; order: number; label?: string }[];
  methods: ContactMethod[];    // unlimited per contact
  notes?: string;
  status: ContactStatus;       // ACTIVE | INACTIVE | ARCHIVED | DELETED
  audit: AuditMetadata;
}
```

### Contact Types

| Type | Description |
|------|-------------|
| `PRIMARY` | Default primary contact |
| `GENERAL` | General inquiry contact |
| `BILLING` | Billing, invoicing, and accounting |
| `EDITORIAL` | Editorial department |
| `RIGHTS` | Rights, permissions, and licensing |
| `SALES` | Sales, distribution, and retail |
| `MEDIA` | Press, media, and PR |
| `SUPPORT` | Customer or technical support |
| `LEGAL` | Legal department or representative |
| `EMERGENCY` | After-hours, urgent matters |
| `TECHNICAL` | Technical or IT contact |
| `ARCHIVE` | Historical or archival contact |
| `MANAGEMENT` | Executive or senior management |
| `OPERATIONS` | Facilities, logistics, HR |
| `COMPLIANCE` | Regulatory and compliance |
| `OTHER` | Any type not covered above |

### ContactMethod

Each contact may have unlimited methods. Each method has independent verification and privacy.

```ts
interface ContactMethod {
  id: Identifier;
  type: ContactMethodType;     // 12 types
  value: string;
  label?: string;
  primary: boolean;
  verified: boolean;
  verifiedAt?: string;
  verificationMethod?: string;
  privacy: ContactPrivacyLevel; // PUBLIC | PRIVATE | INTERNAL
  preferred: boolean;
  preferredOrder?: number;
  availability?: Availability;
  status: ContactMethodStatus; // ACTIVE | INACTIVE | EXPIRED
  audit: AuditMetadata;
}
```

### Contact Method Types

| Method | Identifier Format | Verification |
|--------|-------------------|-------------|
| `EMAIL` | RFC 5322 | Email confirmation |
| `PHONE` | E.164 | SMS code |
| `MOBILE` | E.164 | SMS code |
| `WHATSAPP` | E.164 or WhatsApp ID | WhatsApp message |
| `SIGNAL` | Signal username or phone | Signal message |
| `TELEGRAM` | Telegram username | Telegram message |
| `FAX` | E.164 | Manual |
| `WEBSITE` | URL | Domain ownership |
| `POSTAL_ADDRESS` | Address reference | Postcard |
| `SOCIAL_MEDIA` | Platform URL/handle | Platform-specific |
| `API_ENDPOINT` | URL | Token exchange |
| `OTHER` | String | Configurable |

### Privacy Levels

| Level | Visibility | Example |
|-------|------------|---------|
| `PUBLIC` | All actors (including Visitors) | General inquiry email |
| `PRIVATE` | Entity owner and Administrators | Personal mobile number |
| `INTERNAL` | Administrators only | Security contact |

Default privacy varies by contact type (e.g., PRIMARY → PUBLIC, LEGAL → PRIVATE, ARCHIVE → INTERNAL).

### Verification

| State | Description |
|-------|-------------|
| `UNVERIFIED` | No verification attempted |
| `PENDING` | Code sent, awaiting confirmation |
| `VERIFIED` | Successfully verified |
| `EXPIRED` | Verification expired, must renew |
| `FAILED` | Verification attempt failed |
| `REVOKED` | Previously verified, now revoked |

Verification is per-method, immutable, and append-only.

### Availability & Business Hours

```ts
interface Availability {
  timezone?: string;            // IANA identifier
  businessHours?: BusinessHours[];
  holidays?: Holiday[];
  outOfOffice?: OutOfOffice[];
  responseTime?: string;        // descriptive, not SLA
  availabilityNote?: string;
}
```

Availability can be defined at both the Contact level and overridden per ContactMethod.

### Immutable History

Contact changes create append-only `ContactHistoryEntry` records linked via `supersedes`/`supersededBy`. Methods are never physically deleted — they transition to `INACTIVE` or `EXPIRED`.

### Organization Integration

`Organization.contacts` now uses the shared `Contact` type (was `OrganizationContact`). All 16 `ContactType` values are available — not just the original 8 `ContactRole` values. `ContactRole` type removed from organization module.

---

## Verification Framework

The verification module (`src/verification/`) provides a universal, module-independent verification system described in [RFC-0008](../rfcs/draft/RFC-0008-verification-framework.md). Any entity or value object — Organization, Publisher, Address, Contact, Identifier — can be a verification target.

### Core Architecture

Three core objects: **VerificationEvent** (single attempt), **VerificationRecord** (projected aggregate state), and **Evidence** (supporting material).

```
VerificationEvent (append-only) ──► VerificationRecord (read-only projection)
       │
       └── Evidence (cryptographically hashed, immutable)
```

### Verification States

```
UNVERIFIED
    │
    ▼
PENDING ──► VERIFIED ──► EXPIRED ──► PENDING (re-verify)
    │                      │
    └──► REJECTED          └──► REVOKED
```

| State | Description |
|-------|-------------|
| `UNVERIFIED` | Initial state. No verification attempted. |
| `PENDING` | Verification in progress. Awaiting completion. |
| `VERIFIED` | Verification succeeded. |
| `REJECTED` | Verification failed. |
| `EXPIRED` | Previous VERIFIED state expired. |
| `REVOKED` | Previously VERIFIED, revoked by authority. |

### Verification Levels

| Level | Description | Typical Expiration |
|-------|-------------|-------------------|
| `BASIC` | Minimal confirmation (email, format) | 12 months |
| `STANDARD` | Moderate authenticity (email + phone) | 12 months |
| `ENHANCED` | Substantial with document evidence | 24 months |
| `ACCREDITED` | Comprehensive due diligence | 36 months |
| `TRUSTED` | Highest level, long-standing track record | 36 months (annual review) |

### Verification Methods (14)

| Method | Typical Workflow |
|--------|-----------------|
| `EMAIL` | Send verification link |
| `SMS` | Send code via SMS |
| `PHONE_CALL` | Automated call with code |
| `WEBSITE_OWNERSHIP` | Meta tag, file upload, or DNS record |
| `DNS_RECORD` | TXT/CNAME record on domain |
| `GOVERNMENT_REGISTRY` | Lookup in official registry |
| `BUSINESS_REGISTRY` | Lookup in business register |
| `ISBN_AGENCY` | ISBN prefix lookup |
| `MANUAL_REVIEW` | Human document review |
| `COMMUNITY_VALIDATION` | Endorsement by trusted entities |
| `DIGITAL_SIGNATURE` | Cryptographic signature check |
| `API_VERIFICATION` | Third-party API confirmation |
| `DOCUMENT_REVIEW` | Uploaded document review |
| `CUSTOM` | Configurable custom method |

### VerificationEvent

```ts
interface VerificationEvent {
  id: Identifier;
  targetType: string;            // e.g., "Organization", "Email"
  targetId: Identifier;
  targetRef?: string;            // human-readable reference
  level: VerificationLevel;
  state: VerificationState;      // PENDING | VERIFIED | REJECTED | EXPIRED | REVOKED
  methods: VerificationMethodType[];
  evidence: Evidence[];
  verifier: { actorType: "SYSTEM" | "HUMAN"; actorId: Identifier };
  workflow: "AUTOMATED" | "HUMAN_REVIEW" | "HYBRID";
  confidence: number;            // 0.0 – 1.0
  occurredAt: string;
  recordedAt: string;
  expiresAt?: string;
  supersedes?: Identifier;
  supersededBy?: Identifier;
  audit: AuditMetadata;
}
```

### Evidence Model

```ts
interface Evidence {
  id: Identifier;
  type: EvidenceType;            // 14 types
  hash: { algorithm: "SHA-256"; value: string };
  location?: string;             // storage path
  mimeType?: string;
  size?: number;
  retention: { policy: "STANDARD" | "EXTENDED" | "INDEFINITE" };
  status: "CURRENT" | "PURGED";
  audit: AuditMetadata;
}
```

Evidence is hashed at ingestion (SHA-256 minimum). The hash is stored separately for tamper detection. Retention policies: STANDARD (7 years), EXTENDED (10 years), INDEFINITE (never purged).

### Immutable History

Every verification event is append-only. Events are linked via `supersedes`/`supersededBy` forming an auditable chain. `VerificationRecord` is a read-only projection derived from the event stream.

### VerificationRecord (Read-Only Projection)

```ts
interface VerificationRecord {
  targetType: string;
  targetId: Identifier;
  currentState: VerificationState;
  currentLevel: VerificationLevel;
  currentConfidence: number;
  verifiedAt?: string;
  expiresAt?: string;
  eventCount: number;
  latestEvent: Identifier;
}
```

### Workflows

- **Automated**: TRIGGERED → IN_PROGRESS → COMPLETED (VERIFIED/REJECTED) or ESCALATED → HUMAN_REVIEW
- **Human Review**: SUBMITTED → ASSIGNED → IN_REVIEW → APPROVED/REJECTED (with REQUEST_CHANGES loop)
- **Hybrid**: Automated initial check, escalated to human review on low confidence

### Confidence & Trust Scoring

- **Confidence**: Per-event score (0.0–1.0) based on method reliability. Composite via AND (min), OR (max), or weighted average.
- **Trust Score**: Aggregate across all targets for an entity. Components: verification level (40%), age (20%), history (15%), incidents (15%), endorsements (10%).

### Batch Verification

Supports verifying multiple targets in a single operation. Each target is processed independently. Results are aggregated.

### Publisher Integration

`PublisherWebsite.verificationMethod` now uses the shared `VerificationMethodType` (was `WebsiteVerificationMethod`). All 14 method types are available. `WebsiteVerificationMethod` type removed from publisher module.

---

## Media Asset Framework

The media asset module (`src/media/`) provides a universal, storage-abstracted media asset model described in [RFC-0009](../rfcs/draft/RFC-0009-media-asset-framework.md). Assets are immutable, content-addressed, and ownership-agnostic.

### Core Architecture

```
Asset (immutable, content-addressed)    AssetRelationship (many-to-many)
├── category / type                     ├── entityType / entityId
├── hash / checksum (SHA-256)           ├── assetType (per-entity usage)
├── storage (backend-abstracted)        ├── primary flag
├── versions (append-only chain)        └── effective dates
├── derivatives (auto-generated)
├── metadata (extensible)
└── localized (multilingual)
```

### Asset

```ts
interface Asset extends BaseEntity {
  category: AssetCategory;
  type: AssetType;
  label?: string;
  description?: string;
  filename: string;
  extension: string;
  mimeType: string;
  size: number;
  hash: ContentHash;
  width?: number;
  height?: number;
  duration?: number;
  language?: string;
  metadata: AssetMetadata;
  derivatives: AssetDerivative[];
  currentVersion: number;
  versionCount: number;
  versions: AssetVersion[];
  storage: StorageRecord;
  cdn?: CDNRecord;
  checksum: ContentHash;
  visibility: AssetVisibility;
  status: AssetStatus;
  retention?: RetentionPolicy;
  localized?: LocalizedMetadataMap;
  holdUntil?: Timestamp;
  audit: AuditMetadata;
}
```

### Asset Categories (7, closed enum)

| Category | Code |
|----------|------|
| Image | `IMAGE` |
| Document | `DOCUMENT` |
| Audio | `AUDIO` |
| Video | `VIDEO` |
| Archive | `ARCHIVE` |
| Dataset | `DATASET` |
| Other | `OTHER` |

### Asset Types (extensible per category)

- **Image**: `LOGO`, `COVER`, `PROFILE_PHOTO`, `BANNER`, `THUMBNAIL`, `PREVIEW`, `SCREENSHOT`, `PHOTOGRAPH`, `ILLUSTRATION`, `ICON`, `QR_CODE`, `OTHER_IMAGE`
- **Document**: `CERTIFICATE`, `CONTRACT`, `ISBN_DOCUMENT`, `MANUSCRIPT`, `MARKETING_MATERIAL`, `LICENCE`, `REGISTRATION_DOC`, `TAX_DOCUMENT`, `LEGAL_DOCUMENT`, `REPORT`, `POLICY`, `BRAND_GUIDELINE`, `OTHER_DOCUMENT`
- **Audio**: `AUDIOBOOK`, `SAMPLE`, `INTERVIEW`, `PODCAST`, `OTHER_AUDIO`
- **Video**: `TRAILER`, `INTERVIEW_VIDEO`, `EVENT_RECORDING`, `TUTORIAL`, `OTHER_VIDEO`
- **Archive**: `SOURCE_FILES`, `RAW_IMAGES`, `BACKUP`, `OTHER_ARCHIVE`
- **Dataset**: `METADATA_EXPORT`, `ANALYTICS_DATA`, `REFERENCE_DATA`, `OTHER_DATASET`

### Asset Lifecycle

```
UPLOADED → ACTIVE → ARCHIVED → DELETED
                └──→ DELETED
```

States: `UPLOADED` (processing), `ACTIVE` (available), `ARCHIVED` (retained, not served), `DELETED` (purged, metadata retained).

### Visibility

| Level | Access | Serving |
|-------|--------|---------|
| `PUBLIC` | Any actor | Direct URL |
| `PRIVATE` | Entity owner, Verifiers, Administrators | Signed URL |
| `INTERNAL` | Administrators only | Signed URL + logging |

### Content Hash

```ts
interface ContentHash {
  algorithm: "SHA-256";
  value: string;
}
```

Files are stored at `{prefix}/{hash[0:2]}/{hash[2:4]}/{hash}{.extension}` — naturally deduplicated.

### Versioning

Immutable, append-only version chain. Each version links to previous/next.

```ts
interface AssetVersion {
  version: number;
  assetId: Identifier;
  previousVersion?: Identifier;
  nextVersion?: Identifier;
  hash: ContentHash;
  size: number;
  filename: string;
  createdAt: Timestamp;
  createdBy: Identifier;
  reason: VersionReason;  // INITIAL | UPDATE | REBRAND | CORRECTION | FORMAT_CHANGE | OTHER
}
```

### Derivatives (12 types)

| Type | Source | Description |
|------|--------|-------------|
| `THUMBNAIL_SMALL` | IMAGE | 150×150 thumbnail |
| `THUMBNAIL_MEDIUM` | IMAGE | 300×300 thumbnail |
| `THUMBNAIL_LARGE` | IMAGE | 600×600 thumbnail |
| `PREVIEW` | IMAGE, DOCUMENT | Low-resolution preview |
| `OPTIMIZED` | IMAGE | Format-optimized variant (e.g., WebP) |
| `PDF_PREVIEW` | DOCUMENT | First-page image |
| `AUDIO_SAMPLE` | AUDIO | 30-second clip |
| `VIDEO_THUMBNAIL` | VIDEO | Keyframe thumbnail |
| `VIDEO_PREVIEW` | VIDEO | Low-resolution preview |
| `TRANSCODED` | AUDIO, VIDEO | Alternative format |
| `OCR_TEXT` | DOCUMENT, IMAGE | Extracted text |
| `CUSTOM` | ANY | Extensible |

Derivatives are full Asset records referencing their source.

### Metadata (Extensible)

Four sections: `system` (technical), `descriptive` (curated), `ai` (placeholder for future AI services), `custom` (arbitrary).

### Storage Abstraction

| Backend | Code |
|---------|------|
| Local Filesystem | `local` |
| S3-compatible | `s3` |
| Google Cloud Storage | `gcs` |
| Azure Blob Storage | `azure` |
| CDN | `cdn` |

```ts
interface StorageRecord {
  backend: StorageBackendType;
  bucket: string;
  key: string;
  region?: string;
  endpoint?: string;
  storageClass?: StorageClass;
}

interface CDNRecord {
  url: string;
  enabled: boolean;
  distributionId?: string;
  purgedAt?: string;
}
```

### Ownership (Many-to-Many)

```ts
interface AssetRelationship {
  id: Identifier;
  assetId: Identifier;
  entityType: RelationshipEntityType;  // ORGANIZATION | PUBLISHER | AUTHOR | BOOK | EDITION | ...
  entityId: Identifier;
  assetType: AssetType;                // per-entity usage type
  primary: boolean;
  order?: number;
  label?: string;
  effectiveFrom?: Timestamp;
  effectiveUntil?: Timestamp;
  audit: AuditMetadata;
}
```

An asset can belong to multiple entities. Each relationship records how the entity uses the asset.

### Retention Policies

| Policy | Description | Default |
|--------|-------------|---------|
| `STANDARD` | 3 years after last reference | Default |
| `EXTENDED` | 7 years (legal/compliance) | |
| `INDEFINITE` | Never purged | Critical assets |

---

## Search Framework

The search module (`src/search/`) provides a universal, engine-agnostic search abstraction described in [RFC-0011](../rfcs/draft/RFC-0011-search-framework.md). It is the discovery layer for every domain entity.

### Core Architecture

```
SearchQuery ──► Search Engine (abstracted) ──► SearchResult<T>
     │               │
     ├─ filters      ├─ postgresql
     ├─ facets       ├─ opensearch
     ├─ sort         ├─ meilisearch
     └─ pagination   ├─ typesense
                     └─ algolia
```

### SearchQuery

```ts
interface SearchQuery {
  q?: string;                           // full-text query
  language?: string;                    // BCP-47 language tag
  entityTypes?: string[];               // scope to entity types
  filters?: SearchFilter[];             // structured filters
  facets?: string[];                    // requested facet fields
  sort?: SearchSort | SearchSort[];     // sort configuration
  pagination: SearchPagination;         // cursor or offset
  searchAfter?: string;                 // deep pagination cursor
  minScore?: number;                    // minimum relevance threshold
  explain?: boolean;                    // score explanation
  mode?: SearchMode;                    // "AND" | "OR"
  taxonomyExpansion?: TaxonomyExpansion; // EXACT | IMMEDIATE_CHILDREN | SUBTREE
  synonyms?: boolean;                   // enable synonym expansion
  fields?: string[];                    // restrict result fields
  searchableFields?: { field: string; boost: number }[];
}
```

### SearchResult

```ts
interface SearchResult<T = Record<string, unknown>> {
  total: number;
  page: OffsetPage;
  cursor?: CursorPage;
  results: SearchHit<T>[];
  facets?: SearchFacet[];
  suggestions?: Suggestion[];
  queryTimeMs: number;
}
```

### SearchHit

```ts
interface SearchHit<T = Record<string, unknown>> {
  score: number;
  rank: number;
  entityType: string;
  entityId: string;
  summary: T;
  highlights?: Highlight;
  attributes?: Record<string, unknown>;
  explanation?: Record<string, number>;
}
```

### Filters

12 operators: `EQ`, `NEQ`, `IN`, `NIN`, `GT`, `GTE`, `LT`, `LTE`, `EXISTS`, `NOT_EXISTS`, `PREFIX`, `WITHIN_RADIUS`, `WITHIN_BOUNDING_BOX`, `WITHIN_POLYGON`.

```ts
interface SearchFilter {
  field: string;
  operator: SearchFilterOperator;
  value?: unknown;
  values?: unknown[];
  latitude?: number;
  longitude?: number;
  radius?: string;
  topLeft?: { latitude: number; longitude: number };
  bottomRight?: { latitude: number; longitude: number };
  polygon?: { latitude: number; longitude: number }[];
}
```

### Pagination

Supports both OFFSET (simple, jump-to-page) and CURSOR (stable, deep pagination):

```ts
type PaginationType = "OFFSET" | "CURSOR";

interface SearchPagination {
  type: PaginationType;
  cursor?: string;
  offset?: number;
  limit: number;
}
```

### Facets

```ts
interface SearchFacet {
  field: string;
  buckets: FacetBucket[];
}

interface FacetBucket {
  value: string;
  label?: string;
  count: number;
}
```

### Sorting

```ts
interface SearchSort {
  field: string;
  order: SortOrder;           // ASC | DESC
  mode?: "MIN" | "MAX" | "AVG" | "SUM";
}
```

Default sort is by relevance. Multi-field sort is supported (primary, secondary, etc.).

### Scoring Model

```
score = textRelevance * 0.60
      + verificationLevel * 0.15
      + recency * 0.10
      + popularity * 0.10
      + proximity * 0.05
```

All components are normalized 0.0–1.0. Weights are configurable via `SearchWeight`.

### Suggestions

```ts
type SuggestionType = "CORRECTION" | "RELATED" | "COMPLETION" | "PROMOTED";

interface Suggestion {
  text: string;
  type: SuggestionType;
  score: number;
  entityType?: string;
  entityId?: string;
}
```

### Engine Capabilities

```ts
interface SearchEngineCapabilities {
  fullText: boolean;
  exact: boolean;
  prefix: boolean;
  fuzzy: boolean;
  phonetic: boolean;
  autocomplete: boolean;
  faceted: boolean;
  geo: boolean;
  cursorPagination: boolean;
  fieldBoosting: boolean;
  highlight: boolean;
  suggestions: boolean;
  synonymExpansion: boolean;
  taxonomyExpansion: boolean;
}
```

Each engine declares what it supports. The framework adapts queries accordingly.

### Supported Engines

| Engine | Code |
|--------|------|
| PostgreSQL Full-Text Search | `postgresql` |
| OpenSearch / Elasticsearch | `opensearch` |
| Meilisearch | `meilisearch` |
| Typesense | `typesense` |
| Algolia (Cloud) | `algolia` |

### Engine Agnostic

The framework imports only from `@tprokash/types/domain` and shared primitives. No business modules, no engine-specific types.

---

## Organization Framework

The organization module (`src/organization/`) provides a reusable framework for legal and institutional entities. Organization is **not** Publisher — it is the legal/institutional backbone that Publishers, Printers, Distributors, Bookstores, and Libraries reference.

### Organization

```ts
interface Organization extends BaseEntity {
  slug: string;
  name: string;
  nativeName?: string;
  romanizedName?: string;
  englishName?: string;
  aliases?: string[];
  type: OrgType[];                    // 18 types
  tagline?: string;
  mission?: string;
  vision?: string;
  description?: string;
  foundedYear?: number;
  active: boolean;
  verificationLevel: OrgVerificationLevel;  // BASIC | REGISTERED | VETTED
  identifiers: GenericIdentifier[];         // 14 identifier types
  relationships: OrganizationRelationship[];
  parentOrganizations: OrganizationSummary[];
  subsidiaries: OrganizationSummary[];
  legal?: LegalInfo;
  addresses: Address[];
  contacts: Contact[];
  branding?: OrganizationBranding;
  lifecycle: WorkflowStatus<OrgState>;
}
```

### Organization Types

18 types: `COMMERCIAL_COMPANY`, `NON_PROFIT`, `GOVERNMENT`, `UNIVERSITY`, `SCHOOL`, `LIBRARY`, `FOUNDATION`, `ASSOCIATION`, `PUBLISHER_GROUP`, `PRINTING_COMPANY`, `DISTRIBUTOR`, `BOOKSTORE_CHAIN`, `RESEARCH_INSTITUTE`, `MEDIA_COMPANY`, `INTERNATIONAL_ORGANIZATION`, `COMMUNITY_ORGANIZATION`, `RELIGIOUS_ORGANIZATION`, `OTHER`.

### Lifecycle

Reuses the Lifecycle Framework with three custom states:
- **ACTIVE** — Fully operational and verified.
- **DISSOLVED** — Legally terminated. Relationships frozen.
- **RESTORED** — Reinstated after dissolution (transitions back to ACTIVE).
- **MERGED** — Absorbed into another organization (merge target).

### Graph-Based Relationships

13 relationship types supporting unlimited-depth hierarchy:

| Type | Cardinality |
|------|-------------|
| PARENT | 0..N |
| SUBSIDIARY | 0..N |
| DIVISION | 0..N |
| DEPARTMENT | 0..N |
| BRANCH | 0..N |
| OFFICE | 0..N |
| AFFILIATE | 0..N |
| PARTNER | 0..N |
| MEMBER | 0..N |
| OWNER | 0..N |
| OPERATOR | 0..1 |
| SPONSOR | 0..N |
| FUNDER | 0..N |

Relationships are directional, support cycles, and carry metadata (effective dates, status, audit trail).

### Identifiers

Reuses `GenericIdentifier` from the identity framework with 14 types:

`UUID`, `REGISTRATION_NUMBER`, `TAX_ID`, `BIN`, `TIN`, `WEBSITE`, `EMAIL`, `PHONE`, `ISNI`, `GRID`, `ROR`, `DUNS`, `LEI`, `CUSTOM`

### Verification

Three levels: `BASIC` (email + website), `REGISTERED` (registration verified), `VETTED` (full due diligence). Verification history is append-only.

### Merge Strategy

- Merged-from organization transitions to `MERGED` state.
- All identifiers, relationships, and history preserved on merged-into organization.
- Subsidiaries of merged-from become subsidiaries of merged-into.
- Slugs and URLs redirect permanently (301).
- Reversal requires manual Administrator intervention.

