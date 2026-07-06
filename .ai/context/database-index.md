# Database Index

## Schemas

| File | Lines | Description |
|------|-------|-------------|
| `database/schema.sql` | 1139 | Vendor-neutral canonical schema (64 tables, primary/foreign keys, indexes, audit columns) |
| `database/schema-mysql.sql` | — | MySQL 8.0+ port |
| `database/schema-postgresql.sql` | — | PostgreSQL 15+ port |
| `database/schema-sqlite.sql` | — | SQLite 3.40+ port (dev/test) |

## Policies & Standards

| File | Lines | Description |
|------|-------|-------------|
| `database/database-standards.md` | 96 | Multi-DB target standards, tooling, version control |
| `database/naming-convention.md` | 77 | Singular snake_case tables, `{table}_id` PKs, `fk_child_parent`, `idx_table_column` |
| `database/id-strategy.md` | 91 | Prefixed ID strategy: `{PREFIX}-XXXXXXXXXX` (15 chars), 72 prefix types |
| `database/constraint-policy.md` | 62 | DB-level enforcement primary; application-level secondary |
| `database/index-policy.md` | 76 | Index creation, naming, monitoring, maintenance |
| `database/soft-delete-policy.md` | 62 | `deleted_at TIMESTAMP DEFAULT NULL` on all tables; NULL = active |
| `database/versioning-policy.md` | 77 | SemVer for schema (`schema_version` table); migration scripts |
| `database/audit-policy.md` | 73 | Append-only `audit_log` table; immutable entries |

## Registries & Dictionaries

| File | Lines | Description |
|------|-------|-------------|
| `database/data-dictionary.md` | 2234 | Complete data dictionary covering all 64 tables, columns, types, constraints |
| `database/entity-registry.md` | 57 | Registry of 48 entities with ID prefixes |
| `database/relationship-registry.md` | 109 | 100 relationships documented with source/target/type/cardinality |

## Model Specifications

| File | Lines | Description |
|------|-------|-------------|
| `database/change-history-model.md` | 241 | Change history model spec (field-level diffs) |
| `database/source-model.md` | 216 | Source entity model (12 source types, confidence score) |
| `database/verification-model.md` | 268 | Verification entity model (6 statuses, polymorphic linking) |

## Directories (Placeholders)

| Directory | Purpose |
|-----------|---------|
| `database/migrations/` | Migration scripts |
| `database/seed/` | Seed data scripts |
| `database/exports/` | Database exports |
| `database/relationships/` | Relationship definition files |
| `database/schema/` | Schema fragment files |
