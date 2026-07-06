# Change History Entity Model

## Purpose

The Change History entity records every field-level modification made to core data entities within the tProkash ecosystem. It captures *what changed*, *what the old and new values were*, *who made the change*, *why*, and *which source supported the change*. This provides a complete, immutable audit trail of data evolution, enabling rollback analysis, provenance tracing, and data quality monitoring.

---

## Difference from `audit_log`

The tProkash ecosystem has (or will have) a separate `audit_log` table recording user actions (login, logout, report generation, permission changes). `change_history` is distinct:

| Dimension | `audit_log` | `change_history` |
|---|---|---|
| **Focus** | WHO did WHAT | WHAT CHANGED and WHY |
| **Granularity** | Action-level (one row per user action) | Field-level (one row per changed field) |
| **Data captured** | User ID, action type, timestamp, IP address, affected entity (optional) | Entity type, entity ID, field name, old value, new value, change reason, source ID |
| **Mutation** | Append-only (insert only) | Append-only (insert only) |
| **Typical query** | "What did user X do yesterday?" | "What was the publisher's name before the last edit?" |
| **Retention** | May be purged after a period | Retained indefinitely (permanent provenance) |

Both tables coexist. A single user action (e.g., "Edit Publisher Name") might produce:
- **1 row** in `audit_log`: `{user: X, action: "UPDATE_PUBLISHER", entity: PUB123}`
- **1+ rows** in `change_history`: `{entity: publisher/PUB123, field: name, old: "Somoy", new: "Somoy Prokash", reason: "correction", source: SRC00042}`

---

## Table: `change_history`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `change_history_id` | `VARCHAR(15)` | `PK` | Unique identifier (e.g., `CHG000000000001`). Auto-generated via sequence. |
| `entity_type` | `VARCHAR(255)` | `NOT NULL` | Polymorphic entity type (e.g., `publisher`, `book`, `author`, `series`, `edition`). |
| `entity_id` | `VARCHAR(255)` | `NOT NULL` | Primary key value of the entity whose field was changed. |
| `field_name` | `VARCHAR(255)` | `NOT NULL` | The name of the column/field that was modified (e.g., `name`, `address`, `isbn`, `publication_date`). |
| `old_value` | `TEXT` | — | The previous value before the change. `NULL` if the field was previously `NULL` (e.g., populating a previously empty optional field). |
| `new_value` | `TEXT` | — | The new value after the change. `NULL` if the field was cleared/deleted. |
| `changed_by` | `VARCHAR(15)` | — | Foreign key to the `user` table identifying who made the change. May be `NULL` for system-triggered changes (e.g., imports, migrations). |
| `change_reason` | `TEXT` | — | Free-text or enumerated reason explaining why the change was made (see Change Reason Types below). |
| `source_id` | `VARCHAR(15)` | — | Foreign key to the `source` table linking the new value to its provenance. `NULL` if the change was not source-driven (e.g., formatting-only correction). |
| `changed_at` | `TIMESTAMP` | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | When the change occurred (set by application logic, not the row insert time). |
| `created_at` | `TIMESTAMP` | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | Row creation timestamp (database insert time). |

### Foreign Keys

| Constraint | References | Behavior |
|---|---|---|
| `fk_change_history_user` | `user(user_id)` | `SET NULL` on user delete (preserve history even if user is removed). |
| `fk_change_history_source` | `source(source_id)` | `RESTRICT` on source delete (do not allow deleting a source that has linked change records). |

### Indexes

| Index Name | Columns | Purpose |
|---|---|---|
| `idx_change_history_entity` | `(entity_type, entity_id)` | Quickly retrieve all changes for a specific entity. |
| `idx_change_history_changed_by` | `(changed_by)` | Find all changes made by a specific user. |
| `idx_change_history_source_id` | `(source_id)` | Find all changes attributed to a specific source. |
| `idx_change_history_changed_at` | `(changed_at)` | Time-range queries for data quality monitoring and reporting. |

---

## When to Use `change_history` vs `audit_log`

| Scenario | Use |
|---|---|
| A user updates a publisher's name from "Somoy" to "Somoy Prokash" | `change_history` — captures the old/new values and the reason |
| A user logs in to the system | `audit_log` — no data change occurred |
| A user deletes a book record | **Both**: `audit_log` captures the delete action; `change_history` captures each field being set to `NULL` (or records a single entry with a `delete` reason) |
| A bulk import adds 500 new books | `change_history` — one row per field per book, with `change_reason = 'import'` |
| A user generates a report | `audit_log` — no data change occurred |
| A user merges two author records | `change_history` — captures the changes on the surviving record, with `change_reason = 'merge'` |
| A system process re-verifies data and auto-corrects formatting | `change_history` — with `changed_by = NULL` and `change_reason = 'system'` |

**Rule of thumb**: If the change modifies the value of a data field that a consumer of the data would care about, it belongs in `change_history`. If it is an operational or security action with no data mutation, it belongs in `audit_log`.

---

## Required Application Logic

### Trigger Pattern (Application Layer)

Every `UPDATE` statement on a core entity table should be preceded by logic that:

1. **Reads the existing values** of the fields being updated.
2. **Compares old vs. new** for each field.
3. **Inserts a `change_history` row** for each field that differs.

This can be implemented as:

- **Database triggers** (if the RDBMS supports row-level triggers): A `BEFORE UPDATE` trigger that iterates over changed columns and inserts into `change_history`.
- **ORM hooks / middleware**: In the application layer, a base model class or event listener intercepts update calls and writes change history automatically.
- **Repository pattern**: In a service/repository layer, methods like `updatePublisher(id, data)` perform the diff and insert change history as part of the same transaction.

### Example Pseudocode (Application Layer)

```python
def update_publisher(publisher_id, new_data, changed_by, change_reason, source_id=None):
    publisher = db.query("SELECT * FROM publisher WHERE publisher_id = ?", publisher_id)
    changes = []
    for field, new_value in new_data.items():
        old_value = getattr(publisher, field)
        if old_value != new_value:
            changes.append({
                "entity_type": "publisher",
                "entity_id": publisher_id,
                "field_name": field,
                "old_value": old_value,
                "new_value": new_value,
                "changed_by": changed_by,
                "change_reason": change_reason,
                "source_id": source_id,
                "changed_at": now()
            })
    if changes:
        db.transaction():
            db.execute("UPDATE publisher SET ... WHERE publisher_id = ?", ...)
            for ch in changes:
                db.execute("INSERT INTO change_history (...) VALUES (...)", ch)
    return publisher
```

### Fields That Should Trigger Change History

All mutable business fields on core entities should be tracked. This includes but is not limited to:

- **Publisher**: `name`, `address`, `phone`, `email`, `website`, `trade_license_number`, `status`
- **Book**: `title`, `subtitle`, `isbn`, `publication_date`, `price`, `edition`, `language`, `description`, `cover_image_url`, `status`
- **Author**: `name`, `pen_name`, `biography`, `date_of_birth`, `nationality`, `status`
- **Series**: `name`, `description`, `publisher_id`
- **Edition**: `isbn`, `publication_date`, `price`, `page_count`, `format`, `status`

Fields that should NOT trigger change history (typically managed elsewhere):

- `created_at`, `updated_at` (managed by timestamps)
- `deleted_at` (handled by soft-delete logic)
- Computed/derived fields (materialized at read time)
- Internal metadata not exposed to data consumers

---

## Change Reason Types

The `change_reason` column is a free-text field, but the application should enforce (via a dropdown, enum, or validation) one of the following standard reason types. Each has distinct implications for auditing and data quality.

| Reason | Description | Example |
|---|---|---|
| `correction` | The previous value was incorrect. A verified source supports the new value. | Correcting a misspelled publisher name: old `"Somoy"` → new `"Somoy Prokash"` |
| `enhancement` | Adding missing or incomplete data. The old value was `NULL` or a placeholder. | Adding a previously missing ISBN to a book record. |
| `merge` | Two or more entity records were merged into one. The surviving record's fields are updated to reflect the combined data. | Merging duplicate author records: keeping one `author_id` and updating its name to include both sets of credits. |
| `import` | Data was imported from an external system (bulk load, migration, API sync). | Bulk import of 10,000 books from a legacy system. |
| `system` | An automated system process made the change (e.g., formatting normalization, data enrichment service, deduplication script). | Auto-capitalizing publisher names, formatting phone numbers to a standard pattern. |
| `restoration` | A previous value was restored (rollback to a known-good state). | Restoring a publisher's address after an erroneous edit. |

---

## Examples

### Example 1: Correcting a Publisher Name

A verifier notices that the publisher "Somoy" is consistently referred to as "Somoy Prokash" on its official website and trade license. They update the record.

**UPDATE executed:**
```sql
UPDATE publisher SET name = 'Somoy Prokash' WHERE publisher_id = 'PUB000000000123';
```

**Change history rows generated:**
| change_history_id | entity_type | entity_id | field_name | old_value | new_value | changed_by | change_reason | source_id | changed_at |
|---|---|---|---|---|---|---|---|---|---|
| `CHG000000000001` | `publisher` | `PUB000000000123` | `name` | `Somoy` | `Somoy Prokash` | `USR000000000042` | `correction` | `SRC000000000042` | `2026-06-15 10:30:00` |

### Example 2: Merging Two Author Records

Two author records are determined to refer to the same person: "Humayun Ahmed" (AUT0001) and "Humayun Ahmmed" (AUT0002 — a misspelling). AUT0002 is merged into AUT0001.

**Change history rows for the surviving record (AUT0001):**
| change_history_id | entity_type | entity_id | field_name | old_value | new_value | changed_by | change_reason | source_id | changed_at |
|---|---|---|---|---|---|---|---|---|---|
| `CHG000000000010` | `author` | `AUT000000000001` | `biography` | *(NULL)* | `Born 1948 in Netrokona. Wrote over 200 books.` | `USR000000000042` | `merge` | `SRC000000000089` | `2026-06-16 14:00:00` |

**Change history rows for the merged-out record (AUT0002) — each field set to NULL or superseded:**
| change_history_id | entity_type | entity_id | field_name | old_value | new_value | changed_by | change_reason | source_id | changed_at |
|---|---|---|---|---|---|---|---|---|---|
| `CHG000000000011` | `author` | `AUT000000000002` | `status` | `active` | `merged` | `USR000000000042` | `merge` | `SRC000000000089` | `2026-06-16 14:00:00` |
| `CHG000000000012` | `author` | `AUT000000000002` | `merged_into` | *(NULL)* | `AUT000000000001` | `USR000000000042` | `merge` | `SRC000000000089` | `2026-06-16 14:00:00` |

### Example 3: Bulk Import

A system import adds 500 books from a legacy spreadsheet. A single change history entry per field per book is created.

| change_history_id | entity_type | entity_id | field_name | old_value | new_value | changed_by | change_reason | source_id | changed_at |
|---|---|---|---|---|---|---|---|---|---|
| `CHG000000000500` | `book` | `BOK000000000001` | `title` | *(NULL)* | `কালো তালিকা` | `USR_SYSTEM` | `import` | `SRC000000000300` | `2026-06-10 08:00:00` |
| `CHG000000000501` | `book` | `BOK000000000001` | `isbn` | *(NULL)* | `978-984-93509-3-8` | `USR_SYSTEM` | `import` | `SRC000000000300` | `2026-06-10 08:00:00` |
| `CHG000000000502` | `book` | `BOK000000000001` | `publication_date` | *(NULL)* | `2025-02-01` | `USR_SYSTEM` | `import` | `SRC000000000300` | `2026-06-10 08:00:00` |

---

## Future Considerations

### Automatic Diff Generation

When an entity is updated via a form or API, the application layer should automatically compute the diff between the current database state and the submitted payload, generating `change_history` rows for every differing field. This eliminates the need for manual change tracking and ensures completeness.

Implementation approaches:

- **ORM listeners**: Hibernate Envers (Java), Django Simple History (Python), PaperTrail (Ruby), or similar.
- **Generic diff utility**: A function that accepts an object and a payload, introspects the object's fields, and returns a list of changes.
- **JSON snapshot comparison**: Store periodic full snapshots of entity records as JSON and diff them programmatically.

### Rollback Capability

With `change_history` recording the `old_value` for each field, a rollback is theoretically straightforward:

```sql
-- Rollback publisher name to its previous value:
UPDATE publisher SET name = (
    SELECT old_value FROM change_history
    WHERE entity_type = 'publisher'
      AND entity_id = 'PUB000000000123'
      AND field_name = 'name'
    ORDER BY changed_at DESC
    LIMIT 1
)
WHERE publisher_id = 'PUB000000000123';
```

However, rollback requires careful consideration:

1. **Cascading effects** — Rolling back a publisher name might orphan book records that reference the name (if denormalized).
2. **Chain integrity** — Rolling back should itself generate a `change_history` entry with reason `restoration`.
3. **Authorization** — Rollback should be restricted to senior verifiers and admins.
4. **Temporal queries** — The system could support "as-of" queries using `change_history` to reconstruct what an entity looked like at any point in time.

### Versioned Entity Views

A future enhancement could materialize versioned snapshots of entities by applying `change_history` in order. This would enable:

- A "diff view" comparing two points in time.
- A "timeline view" showing how an entity evolved.
- A "who changed what" report for data governance compliance.
