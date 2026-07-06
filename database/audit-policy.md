# Audit Policy

**Version:** 1.0.0\
**Status:** Approved

---

## 1. Principle

Every significant data change must be recorded in an immutable audit log. The audit log provides a complete, tamper-evident history of who did what, when, and what changed.

## 2. Audit Log Table

The `audit_log` table captures all auditable events:

| Column | Type | Description |
|---|---|---|
| audit_log_id | VARCHAR(15) | Primary key |
| actor_id | VARCHAR(15) | User who performed the action (FK to user, nullable for anonymous) |
| action | VARCHAR(50) | Action type |
| entity_type | VARCHAR(50) | Type of entity affected |
| entity_id | VARCHAR(15) | ID of entity affected |
| old_values | JSONB / TEXT | Previous state (null for CREATE) |
| new_values | JSONB / TEXT | New state (null for DELETE) |
| ip_address | VARCHAR(45) | Client IP address |
| user_agent | TEXT | Client user agent |
| created_at | TIMESTAMP | When the action occurred |

## 3. Actions

The following actions are audited:

- CREATE — entity created
- UPDATE — entity modified
- DELETE — entity soft-deleted
- RESTORE — entity restored from soft-delete
- LOGIN — user authenticated
- LOGOUT — user signed out
- EXPORT — data export generated
- IMPORT — data import completed
- VERIFY — verification status changed
- MERGE — entities merged
- ARCHIVE — entity moved to archive

## 4. Entities Audited

All core business entities are audited:

- publisher, imprint, book, edition, isbn
- author, contributor
- user, role, permission
- contract, license, submission
- review, award
- distributor, printer, printing, warehouse, inventory
- bookstore, reader, organization
- dataset, source, verification
- api_client

## 5. Immutability

Audit log entries are append-only. Once written, an entry must never be modified or deleted. This is enforced at the database level via a trigger or restricted permissions. Application code must never UPDATE or DELETE from audit_log.

## 6. Retention

Audit log data is retained indefinitely. If storage becomes a concern, audit logs older than 7 years may be moved to cold storage, but must remain queryable.

## 7. Implementation

- **PostgreSQL:** Use a trigger function on each audited table to write to audit_log.
- **MySQL:** Use a trigger on each audited table.
- **SQLite:** Use application-layer logging since trigger support is limited in some configurations.

The `old_values` and `new_values` store a JSON representation of the row before and after the change. For CREATE, old_values is NULL. For DELETE, new_values is NULL.
