# @tprokash/types

Shared TypeScript type definitions for all tProkash entities and contracts.

**Stack:** TypeScript

**Depends on:** None (zero-dependency package)

**Used by:** Every package, app, and service

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

interface AuditInfo {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: Identifier;
  updatedBy?: Identifier;
}

interface BaseEntity {
  id: Identifier;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: Pagination;
}
```
