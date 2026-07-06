# Soft Delete Policy

**Version:** 1.0.0\
**Status:** Approved

---

## 1. Principle

Data is never physically deleted from the database. Every table includes a `deleted_at` column that records when a row was logically deleted. Soft delete preserves referential integrity and enables recovery.

## 2. Implementation

Every entity table must include:

```sql
deleted_at TIMESTAMP DEFAULT NULL
```

- `NULL` — row is active
- Non-NULL timestamp — row is deleted

## 3. Query Convention

All application queries must include a filter for active rows:

```sql
WHERE deleted_at IS NULL
```

Views or default WHERE clauses should be used where the ORM or query builder supports them.

## 4. Cascade Behavior

Soft-deleting a parent does NOT automatically soft-delete its children. Explicit cascade rules:

- **Publisher soft-delete:** Sets imprint publisher_id to NULL (orphaned).
- **Book soft-delete:** Junction rows (book_author, book_publisher, etc.) remain unchanged but are excluded from queries by the active filter.
- **Edition soft-delete:** ISBN remains attached but inactive.
- **User soft-delete:** User retains associated audit log entries. User is anonymized (email replaced, password invalidated).

## 5. Restore

Soft-deleted rows may be restored by setting `deleted_at = NULL`. Restore is an audited action logged in audit_log.

## 6. Hard Delete

Hard delete (physical removal) is permitted only in these cases:

- Test or seed data that was never exposed to users.
- Audit log entries that were created in error during testing.
- Duplicate records identified within 24 hours of creation.

All hard deletes must be approved and logged.

## 7. Purge

Old soft-deleted data may be purged after 3 years. Purge is a batch operation executed during maintenance windows. Purge is logged and reversible from backup for 30 days.

## 8. Referential Integrity

Foreign keys referencing soft-deleted rows are maintained. Deleted parent rows remain available for historical reference but are excluded from active queries.
