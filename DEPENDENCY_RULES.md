# Dependency Rules

This document defines the allowed dependency relationships between every directory in the tProkash monorepo.

## Symbol Key

- **→** = "may depend on"
- **↛** = "must not depend on"

---

## Apps

### `apps/web`
→ `packages/ui`, `packages/types`, `packages/utils`, `packages/validation`
→ `services/search`
↛ `apps/admin`, `apps/api`, `apps/docs`
↛ `services/notifications`, `services/storage`, `services/importer`, `services/exporter`

### `apps/admin`
→ `packages/ui`, `packages/types`, `packages/utils`, `packages/validation`, `packages/config`
→ `services/search`, `services/notifications`
↛ `apps/web`, `apps/api`, `apps/docs`
↛ `services/storage`, `services/importer`, `services/exporter`

### `apps/api`
→ `packages/types`, `packages/validation`, `packages/database`, `packages/config`, `packages/utils`
→ `services/search`, `services/storage`
↛ `apps/web`, `apps/admin`, `apps/docs`
↛ `services/notifications`, `services/importer`, `services/exporter`

### `apps/docs`
→ none (static content)
↛ any package, app, or service

---

## Packages

### `packages/types`
→ none (zero-dependency base)

### `packages/utils`
→ none (zero-dependency base)

### `packages/validation`
→ `packages/types`
↛ any other package, app, or service

### `packages/config`
→ `packages/types`
↛ any other package, app, or service

### `packages/ui`
→ `packages/types`, `packages/utils`
↛ `packages/database`, `packages/validation`, `packages/config`, `packages/sdk`
↛ any app or service

### `packages/database`
→ `packages/types`, `packages/config`
↛ `packages/ui`, `packages/sdk`, `packages/validation`, `packages/utils`
↛ any app or service

### `packages/sdk`
→ `packages/types`
↛ `packages/database`, `packages/ui`, `packages/validation`, `packages/config`, `packages/utils`
↛ any app or service

---

## Services

### `services/search`
→ `packages/types`, `packages/database`, `packages/config`
↛ any app or other service

### `services/notifications`
→ `packages/types`, `packages/database`, `packages/config`
↛ any app or other service

### `services/storage`
→ `packages/types`, `packages/config`
↛ any app or other service

### `services/importer`
→ `packages/types`, `packages/database`, `packages/validation`, `packages/utils`, `packages/config`
↛ any app or other service

### `services/exporter`
→ `packages/types`, `packages/database`, `packages/utils`, `packages/config`
↛ any app or other service

---

## Global Rules

1. **Packages cannot depend on apps.** No package may import from `apps/*`.
2. **Services cannot depend on apps.** No service may import from `apps/*`.
3. **Services cannot depend on other services.** Services are independent deployable units.
4. **Apps cannot depend on other apps.** Apps communicate via the API or shared services, never via direct imports.
5. **Circular dependencies are forbidden.** The dependency graph must always be a directed acyclic graph.
6. **Shared base packages.** `@tprokash/types`, `@tprokash/utils` are zero-dependency and form the foundation of the graph.
7. **`@tprokash/database`** is the only package that accesses the database. All other packages, apps, and services go through it.
8. **`@tprokash/types`** is the shared contract. All interfaces that cross package boundaries must be defined here.
9. **`@tprokash/validation`** is the single validation authority. Validation logic must not be duplicated in apps.
10. **Dev dependencies (TypeScript, ESLint, Prettier, Vitest, etc.)** are hoisted to the root and are available to every package, app, and service without explicit dependency declarations.
