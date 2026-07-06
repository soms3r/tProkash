# Index Policy

**Version:** 1.0.0\
**Status:** Approved

---

## 1. Principle

Indexes are created to support query performance, uniqueness enforcement, and foreign key joins. Every foreign key column must be indexed. Additional indexes are added based on query patterns, not speculation.

## 2. Mandatory Indexes

Every foreign key column must have a B-tree index. Named as `idx_{child_table}_{fk_column}`.

Examples:
- `idx_imprint_publisher_id` on `imprint(publisher_id)`
- `idx_book_author_author_id` on `book_author(author_id)`
- `idx_book_author_book_id` on `book_author(book_id)`

## 3. Lookup Indexes

Columns frequently used in WHERE, JOIN, and ORDER BY clauses should be indexed:

- `publisher.slug`
- `book.title` (full-text or B-tree depending on query pattern)
- `author.name`
- `isbn.code`
- `edition.isbn_id`
- `user.email`
- `submission.status`
- `audit_log.created_at`

## 4. Full-Text Search Indexes

Full-text search indexes are defined separately per target database:

- **PostgreSQL:** GIN tsvector index on concatenated searchable columns.
- **MySQL:** FULLTEXT index on searchable columns.
- **SQLite:** FTS5 virtual table for full-text search.

Full-text indexes are maintained asynchronously through the Search Index entity.

## 5. Composite Indexes

Composite indexes are created for multi-column query patterns:

- `(publisher_id, status)` for filtering publisher books by status.
- `(book_id, role_id)` for book_contributor lookups by role.
- `(entity_type, entity_id)` for polymorphic lookups (tagging, verification).

## 6. Unique Indexes

Unique constraints automatically create unique indexes. No additional unique indexes are needed.

## 7. Partial Indexes

PostgreSQL-specific partial indexes are used for soft-delete filtering:

```sql
CREATE INDEX idx_book_active ON book(title) WHERE deleted_at IS NULL;
```

## 8. Index Maintenance

- Indexes are reviewed quarterly.
- Unused indexes are dropped.
- Indexes on tables exceeding 100,000 rows are analyzed for usage.
- No more than 5 indexes per table unless justified.
- Composite indexes count as one index.

## 9. Prohibited Index Types

- Hash indexes (not WAL-logged in all databases).
- GiST/GIN indexes (except full-text) unless specifically approved.
- BRIN indexes unless on naturally-ordered data (e.g., audit_log).
