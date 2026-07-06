# Versioning Policy

**Version:** 1.0.0\
**Status:** Approved

---

## 1. Principle

The database schema and its data follow semantic versioning. Schema changes are tracked and versioned to enable reproducible builds, migrations, and rollbacks.

## 2. Schema Versioning

The database schema version is stored in a `schema_version` table:

```sql
CREATE TABLE schema_version (
    version VARCHAR(20) PRIMARY KEY,
    description TEXT NOT NULL,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    checksum VARCHAR(64) NOT NULL,
    applied_by VARCHAR(100) NOT NULL
);
```

Version format follows SemVer: MAJOR.MINOR.PATCH.

- **MAJOR:** Breaking schema changes (table/column removal, type changes).
- **MINOR:** Non-breaking additions (new tables, new columns, new indexes).
- **PATCH:** Fixes (constraint corrections, index adjustments, comment updates).

## 3. Migration Files

Migrations are stored in `database/migrations/` with the naming convention:

```
V{version}__{description}.sql
```

Examples:
- `V1_0_0__initial_schema.sql`
- `V1_1_0__add_series_table.sql`
- `V1_1_1__fix_isbn_unique_constraint.sql`

## 4. Migration Execution

- Migrations are applied in version order.
- Each migration is wrapped in a transaction.
- On failure, the transaction is rolled back.
- The migration is recorded in schema_version only on successful completion.
- Checksum verification prevents modification of applied migrations.

## 5. Downgrade

Downgrade scripts are optional for PATCH versions but required for MAJOR and MINOR versions. Downgrade scripts are named:

```
V{version}__{description}__rollback.sql
```

## 6. Seed Data Versioning

Seed data follows the same versioning as schema. Seed files in `database/seed/` are named:

```
V{version}__seed_{description}.sql
```

Seed data is applied after schema migrations.

## 7. Data Versioning

The Dataset entity tracks versioned exports of domain data. Dataset versions follow SemVer independently of the schema version. Each Dataset record stores its version, schema version at time of export, and a checksum.

## 8. Changelog

A changelog (`CHANGELOG.md`) in the database directory documents every schema version, its changes, and its date.
