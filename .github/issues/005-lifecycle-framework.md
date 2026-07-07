# Issue-005: Shared Lifecycle Framework

## Title

Shared Lifecycle Framework

## Objective

Create a generic lifecycle/state machine framework that every future module (Publisher, Author, Book, Printer, Distributor, Bookstore, Library, Dataset, Source, Event, Award) will reuse instead of reinventing state management.

## Scope

- Framework-only: generic types, no business logic
- Nine base states: DRAFT, IMPORTED, PENDING_REVIEW, PENDING_VERIFICATION, VERIFIED, PUBLISHED, SUSPENDED, ARCHIVED, DELETED
- WorkflowDefinition with allowed transitions, initial state, terminal states, custom states
- LifecycleHistory with full transition audit trail
- Actor tracking (USER, SYSTEM, SERVICE, API, AUTOMATION)
- TransitionReason with provenance/source tracking
- Rollback support via append-only history
- Soft delete compatibility (DELETED is a state, not a hard delete)
- Custom state extension per entity

## Acceptance Criteria

1. `packages/types/src/lifecycle/` created with 8 files
2. All types defined: LifecycleState, LifecycleTransition, LifecycleHistory, LifecycleActor, TransitionReason, WorkflowDefinition, WorkflowStatus
3. `packages/types/src/index.ts` exports lifecycle module
4. `packages/types/README.md` documents the framework
5. `.github/issues/005-lifecycle-framework.md` created
6. `pnpm build` passes
7. `pnpm lint` passes
8. `pnpm test` passes

## Files Created

- `packages/types/src/lifecycle/state.ts` — BaseState, LifecycleState, BASE_STATES constant
- `packages/types/src/lifecycle/actor.ts` — ActorType, LifecycleActor
- `packages/types/src/lifecycle/reason.ts` — TransitionReasonType, TransitionSource, TransitionReason
- `packages/types/src/lifecycle/transition.ts` — LifecycleTransition
- `packages/types/src/lifecycle/history.ts` — AllowedTransition, LifecycleHistory
- `packages/types/src/lifecycle/workflow.ts` — WorkflowDefinition, WorkflowConfig
- `packages/types/src/lifecycle/status.ts` — StatusInfo, WorkflowStatus
- `packages/types/src/lifecycle/index.ts` — Barrel exports

## Files Modified

- `packages/types/src/index.ts` — Added `export * from "./lifecycle"`
- `packages/types/README.md` — Full lifecycle framework documentation

## Future Work

- State machine validation utilities (verify transitions at runtime)
- Concrete workflow definitions for specific entities (Publisher, Book, etc.)
- Database schema for lifecycle history storage
- Transition guard/rule engine

## Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| DELETED is a state, not a field | Unified state machine; one mechanism for all state changes including deletion |
| History is append-only | Full audit trail; rollbacks create new entries rather than mutating history |
| Generic TState parameter | Entities define their own state unions while inheriting base states |
| AllowedTransition as explicit from→to pairs | Exhaustive validation; any unlisted pair is automatically forbidden |
| Actor tracking separate from identity | Actor may be a user, system, or external service — not necessarily an entity identifier |
| TransitionReason includes source | Provenance tracking for audit and compliance |
| BASE_STATES as const array | Runtime iteration for UI, validation, and migration scripts |
