# @tprokash/database

PostgreSQL database layer powered by [Drizzle ORM](https://orm.drizzle.team).

## Connection Lifecycle

The database client follows a singleton factory pattern:

```ts
import { createClient, getClient, closeClient } from "@tprokash/database";

// Connect (idempotent — returns cached client on subsequent calls)
const db = await createClient("postgresql://user:pass@localhost:5432/tprokash");

// Access the client anywhere
const client = getClient();

// Disconnect (close the connection pool)
await closeClient();
```

### Graceful Shutdown

Call `closeClient()` during application shutdown to drain the connection pool. The `postgres` driver respects a 5-second timeout for in-flight queries.

In the NestJS API app (`apps/api`), shutdown is handled in `main.ts` via `SIGTERM`/`SIGINT` listeners.

## Migration Workflow

Migrations are managed with **drizzle-kit**. Configuration lives at `packages/database/drizzle.config.ts`.

### Setup

Ensure `DATABASE_URL` is set in your environment or `.env` file:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/tprokash
```

### Workflow

#### 1. Define Schema

Update table definitions in `src/schema/index.ts` using Drizzle ORM:

```ts
import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});
```

#### 2. Generate Migration

```bash
pnpm --filter @tprokash/database db:generate
```

This produces a migration folder under `migrations/` (e.g., `migrations/0000_<name>/`) with:
- `meta.json` — Drizzle metadata
- `snapshot.json` — Schema snapshot
- `down.sql` — Rollback SQL

#### 3. Review

Always review the generated SQL before applying:

```bash
cat migrations/0000_<name>/meta.json
```

Check the `up` SQL and the `down.sql` for correctness.

#### 4. Apply

```bash
pnpm --filter @tprokash/database db:migrate
```

This runs all pending migrations against the database and records them in the `__drizzle_migrations` table.

#### 5. Check for Pending Changes (Dry-Run)

```bash
pnpm --filter @tprokash/database db:check
```

This checks whether your schema definition has un-migrated changes without generating migration files.

### Available Commands

| Command | Description |
|---------|-------------|
| `pnpm db:generate` | Generate a migration from schema changes |
| `pnpm db:migrate` | Apply pending migrations |
| `pnpm db:check` | Check for pending changes (dry-run, no files created) |
| `pnpm db:push` | Push schema directly (dev only — skips migration files) |
| `pnpm db:studio` | Open Drizzle Studio (GUI for browsing data) |

### Directory Structure

```
packages/database/
  migrations/          — Generated migration files (auto-generated)
    meta/              — Drizzle Kit metadata (_journal.json, snapshots)
    README.md          — Migration directory documentation
    0000_<name>/       — Individual migration folder
      meta.json
      snapshot.json
      down.sql
  src/
    client/            — Connection factory (create / get / close)
    config/            — Database config from shared environment
    health/            — Health checker (ping database)
    migration/         — Migration runner, status, and version checkers
    schema/            — Drizzle ORM table definitions
    types/             — TypeScript type re-exports
    index.ts           — Public API barrel
  drizzle.config.ts    — drizzle-kit configuration
```

## Programmatic Migration API

The package exports utilities for running and inspecting migrations at runtime.

### `runMigrations(options?)`

Applies pending migrations programmatically.

```ts
import { runMigrations, getClient, createClient } from "@tprokash/database";
import { getDatabaseConfig } from "@tprokash/database";

const config = getDatabaseConfig();
await createClient(config.url);

const result = await runMigrations();
// { success: true, migrationsTable: "__drizzle_migrations" }

if (!result.success) {
  console.error("Migration failed:", result.error);
}
```

Options:

- `migrationsFolder` — Path to migrations directory (default: resolves to `packages/database/migrations`)
- `migrationsTable` — Name of the drizzle migration tracking table (default: `__drizzle_migrations`)

### `getMigrationStatus(migrationsFolder?)`

Returns applied and pending migrations.

```ts
import { getMigrationStatus } from "@tprokash/database";

const status = await getMigrationStatus();
// {
//   total: 3,
//   applied: [{ index: 0, name: "0000_initial", hash: "abc123", appliedAt: Date }],
//   pending: [{ index: 1, name: "0001_add_books", hash: "def456", appliedAt: null }]
// }
```

### `getDatabaseVersion()`

Returns the latest applied migration hash.

```ts
import { getDatabaseVersion } from "@tprokash/database";

const version = await getDatabaseVersion();
// { version: "abc123", appliedAt: Date, migrationCount: 3 }
// { version: null, appliedAt: null, migrationCount: 0 }  ← no migrations applied
```

## Rollback Strategy

Drizzle Kit does not support automatic rollbacks. Use one of these approaches:

### 1. Manual Rollback

Each migration folder contains a `down.sql` file with the reverse SQL. Run it against the database:

```bash
psql $DATABASE_URL -f migrations/0001_add_books/down.sql
```

Then remove the corresponding entry from `migrations/meta/_journal.json` (or the `__drizzle_migrations` table).

### 2. Database Restore

Restore a pre-migration snapshot from a backup:

```bash
pg_restore -d $DATABASE_URL backup_before_migration.dump
```

### 3. Schema Push (Dev Only)

In development, you can use `db:push` to overwrite the schema. Do **NOT** use this in production.

## Team Workflow

1. **Branch** — Each feature branch creates its own migration(s).
2. **Generate** — Run `db:generate` after defining schema changes.
3. **Review** — Commit the generated migration folder. Review SQL in PR.
4. **Merge** — Ensure migrations are applied in order (sequential indices).
5. **Deploy** — Run `db:migrate` as part of the deployment process.

### Avoiding Conflicts

- Migrations are numbered sequentially (0000, 0001, ...). If two branches both generate migration `0001`, the merge may conflict.
- **Solution**: Run `db:generate` after merge to re-index. Or agree on a naming convention per feature area.

### Ordering in CI/CD

```bash
# In CI pipeline, before starting the app:
pnpm --filter @tprokash/database db:migrate
```

## Production Safety

- Always test migrations against a **staging** environment first.
- Run a **dry-run** check with `db:check` before generating migrations.
- Review generated SQL before committing migration files.
- Take a **database snapshot** before applying migrations in production.
- Migrations run **sequentially** — if one fails, none after it are applied.
- The `__drizzle_migrations` table tracks applied hashes, preventing re-application.
- `db:push` is for development only — it does not generate migration files and can cause data loss.

## Health Check

```ts
import { checkDatabaseHealth } from "@tprokash/database";

const health = await checkDatabaseHealth();
// { connected: true, latencyMs: 3 }
// { connected: false, error: "Connection refused" }
```

## Configuration

Database config is loaded from the shared `@tprokash/config` package. The `DATABASE_URL` environment variable is read from `.env` or the process environment.

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/tprokash
```

## Driver

Uses [postgres](https://github.com/porsager/postgres) (postgres.js) — the lightweight PostgreSQL client. Connection pool defaults: `max: 10`, `idle_timeout: 30s`, `connect_timeout: 10s`.
