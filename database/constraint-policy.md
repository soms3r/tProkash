# Constraint Policy

**Version:** 1.0.0\
**Status:** Approved

---

## 1. Principle

Constraints enforce data integrity at the database level. All integrity rules defined in the domain architecture must be implemented as database constraints. Application-level validation is secondary to database-level enforcement.

## 2. Primary Key Constraints

Every table has exactly one primary key. Primary keys are declared as `{table_name}_id VARCHAR(15) PRIMARY KEY` for entity tables. Junction tables use composite primary keys.

## 3. Foreign Key Constraints

Every foreign key relationship must have a named foreign key constraint. Foreign keys reference the parent table's primary key. The naming convention is `fk_{child_table}_{parent_table}`.

- **Restrict delete** by default — do not allow deletion of a parent if children exist.
- **Cascade delete** only on junction/lookup tables where child rows are meaningless without the parent (e.g., `book_author` cascades on `book` delete).
- **Set null** only for optional relationships where the child may exist without the parent.

## 4. Unique Constraints

Unique constraints enforce business uniqueness rules. Named as `uq_{table_name}_{column}`.

- ISBN code must be unique across all isbn records.
- Publisher slug must be unique per publisher.
- Language code (ISO) must be unique.
- User email must be unique.
- Role name must be unique.
- Tag name must be unique.
- Category slug must be unique.
- Series slug should be unique.
- API client ID must be unique.

## 5. Check Constraints

Check constraints enforce domain rules on column values.

- Rating must be between 1 and 5.
- Quantity must be greater than or equal to zero.
- Year must be a four-digit positive integer.
- Status must be one of the defined enum values (enforced via CHECK or domain type).
- Email must contain @ (basic format check).
- Verification level must be one of: Verified, Partially Verified, Community Verified, Needs Review.

## 6. NOT NULL Constraints

Primary keys are always NOT NULL. Foreign keys are NOT NULL for required relationships, NULL for optional relationships. All audit columns (created_at, updated_at) are NOT NULL. deleted_at is nullable.

## 7. Default Values

- Boolean columns default to FALSE unless otherwise specified.
- Timestamp columns default to CURRENT_TIMESTAMP.
- Status columns default to the initial lifecycle state.
- Numeric counters default to 0.

## 8. Enforcement Level

Constraints are enforced at the database level and must pass before data is committed. No application bypass is permitted. The only exception is bulk data import, where constraints may be deferred and validated post-import.
