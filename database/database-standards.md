# Database Standards

**Version:** 1.0.0\
**Status:** Approved

---

## 1. Target Databases

| Target | Version | Role |
|---|---|---|
| PostgreSQL | 15+ | Primary production database |
| MySQL | 8.0+ | Compatible deployment |
| SQLite | 3.40+ | Development, testing, embedded |

The primary target is PostgreSQL. MySQL and SQLite schemas are derived from the PostgreSQL schema with database-specific adjustments.

## 2. Data Types

| Concept | PostgreSQL | MySQL | SQLite |
|---|---|---|---|
| Primary key | VARCHAR(15) | VARCHAR(15) | VARCHAR(15) |
| Short text | VARCHAR(255) | VARCHAR(255) | VARCHAR(255) |
| Long text | TEXT | TEXT | TEXT |
| Multilingual text | TEXT | TEXT | TEXT |
| Integer | INTEGER | INT | INTEGER |
| Decimal | NUMERIC(12,2) | DECIMAL(12,2) | REAL |
| Boolean | BOOLEAN | TINYINT(1) | INTEGER (0/1) |
| Date | DATE | DATE | TEXT (ISO 8601) |
| Timestamp | TIMESTAMP | DATETIME(6) | TEXT (ISO 8601) |
| JSON | JSONB | JSON | TEXT (JSON) |
| URL | TEXT | TEXT | TEXT |
| Email | VARCHAR(254) | VARCHAR(254) | VARCHAR(254) |
| IP address | VARCHAR(45) | VARCHAR(45) | VARCHAR(45) |

## 3. Character Encoding

- **PostgreSQL:** UTF-8 encoding (ENCODING 'UTF8')
- **MySQL:** utf8mb4 character set
- **SQLite:** UTF-8 (default)

## 4. Storage Engine

- **PostgreSQL:** Default (heap-based)
- **MySQL:** InnoDB
- **SQLite:** Default

## 5. Transaction Isolation

- **PostgreSQL:** READ COMMITTED (default)
- **MySQL:** REPEATABLE READ (default)
- **SQLite:** SERIALIZABLE (default)

## 6. SQL Style

- Keywords in UPPERCASE (SELECT, FROM, WHERE, INSERT, CREATE).
- Each major clause on a new line.
- Indent join conditions and WHERE clauses.
- Aliases use the AS keyword.
- Every statement ends with a semicolon.
- Comments use -- for single line, /* */ for blocks.

## 7. File Encoding

- All SQL files use UTF-8 encoding.
- Line endings: LF (Unix-style).
- No BOM.

## 8. Schema Organization

SQL files are organized in this order:

1. Extensions (if any)
2. Domain types / ENUMs
3. Lookup tables
4. Core entity tables
5. Junction tables
6. Indexes
7. Views (if any)
8. Functions / Triggers (if any)

## 9. Documentation

Every table must include a COMMENT (MySQL/PostgreSQL) or inline documentation explaining its purpose. Every column with a non-obvious purpose must include a comment.

## 10. Review Requirements

All schema changes require:

- ADR documenting the decision.
- Migration script in `database/migrations/`.
- Updated schema files (vendor-neutral + all targets).
- Updated data dictionary.
- Updated entity registry.
- Updated relationship registry.
- Peer review before merge.
