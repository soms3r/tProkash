# Database

Shared database access layer for tProkash.

**Stack:** TypeScript, Drizzle ORM or Kysely

**What it contains:**
- Schema definitions matching `database/schema.sql`
- Migration runner and seed utilities
- Query helpers and repository pattern
- Connection management
- Type-safe query builder wrappers

**Depends on:** `@tprokash/types`, `database/schema.sql` (canonical SQL source)

**Used by:** `apps/api`, internal services
