# Modules — tProkash Modular Architecture

## Why the Project is Modular

The Bangladeshi publishing ecosystem spans multiple distinct domains — from publisher directories and book catalogs to printing, distribution, and community features. A modular architecture isolates these domains into independently developable, testable, and deployable units. This approach:

- Prevents domain logic from leaking across boundaries
- Enables parallel development by multiple contributors
- Allows each module to evolve at its own pace
- Simplifies testing and validation within bounded contexts
- Makes the system understandable without loading the entire codebase

## Module Communication Principles

1. **Stable interfaces, not shared internals** — Modules communicate through well-defined public interfaces (APIs, events, or data contracts). Internal implementations are never exposed.
2. **No circular dependencies** — Dependencies form a directed acyclic graph. Lower-layer modules (e.g., `core`) must not depend on higher-layer modules (e.g., `api`).
3. **Data contracts over method calls** — Cross-module data exchange uses schema-validated contracts (JSON Schema, protobuf, or equivalent), never direct database access.
4. **Eventual consistency across modules** — Modules own their data and publish events when state changes. Other modules consume events asynchronously.
5. **Versioned interfaces** — All public interfaces (schemas, APIs, events) are versioned using Semantic Versioning. Breaking changes require a major version bump and migration plan.

## Ownership Rules

1. **One module, one owner** — Every module has a single designated owner (team or individual) responsible for its design, implementation, and quality.
2. **Module owns its data** — Each module exclusively owns its database tables or data stores. Other modules access data only through the owning module's public interfaces.
3. **Change within, communicate outward** — Internal refactoring does not require cross-module coordination. Changes to public interfaces require notification to all dependent modules.
4. **ADR required for boundary changes** — Any change that alters a module's public interface, data ownership, or dependency graph must be documented in an Architecture Decision Record (see `decisions/`).
5. **Tests travel with the module** — Unit and integration tests live inside the module's `tests/` directory. Cross-module integration tests live in the consuming module or a dedicated test harness.

## Extension Strategy

1. **Prefer composition over modification** — New capabilities are added by composing existing modules, not by modifying them. If a new module needs data from an existing one, it consumes its public interface.
2. **Feature flags in high-risk modules** — Modules with external impact (API, search, publishing) support feature flags to enable gradual rollout.
3. **Deprecate, don't delete** — When a module interface becomes obsolete, mark it deprecated with a migration path. Remove only after all consumers have migrated.
4. **Schema evolution is additive** — JSON Schemas and database schemas evolve by adding optional fields. Mandatory fields and breaking changes require a new major version.

## Future Module Creation Policy

1. Each module maps to one bounded context in the domain architecture (`architecture/020-domain-architecture.md`).
2. New modules require an ADR that defines: purpose, responsibilities, owned data, dependencies, public interfaces, and out-of-scope items.
3. The module must follow the standard structure: `README.md`, `docs/`, `specifications/`, `tests/`.
4. If an existing module already covers 80%+ of the proposed module's domain, extend the existing module rather than creating a new one.
5. New modules must document their position in the dependency graph and verify no circular dependencies are introduced.
