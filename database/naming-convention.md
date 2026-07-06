# Naming Convention

**Version:** 1.0.0\
**Status:** Approved

---

## 1. General Rules

- All names are in English.
- Use lowercase throughout.
- Use snake_case for all identifiers (tables, columns, indexes, constraints).
- Singular form for table names (publisher, not publishers).
- No reserved words as identifiers.

## 2. Table Names

- Singular noun: `publisher`, `book`, `edition`.
- Junction tables combine two singular entity names with underscore: `book_author`, `book_publisher`.
- Alphabetical order for junction components: `book_author` not `author_book`.
- Acronyms remain lowercase: `isbn`, `api_client`.

## 3. Column Names

- Primary key: `{table_name}_id` (e.g., `publisher_id`).
- Foreign key: same as referenced primary key (e.g., `publisher_id`).
- Boolean columns: prefix with `is_`, `has_`, or similar (e.g., `is_active`, `has_digital_rights`).
- Date columns: suffix with `_date` (e.g., `founded_date`, `published_date`).
- Timestamp columns: suffix with `_at` (e.g., `created_at`, `updated_at`).
- Count columns: prefix with `num_` (e.g., `num_pages`, `num_copies`).
- Monetary columns: include currency suffix where ambiguous (e.g., `price_bdt`, `price_usd`).
- URL columns: suffix with `_url` (e.g., `website_url`, `logo_url`).
- Code columns: suffix with `_code` (e.g., `language_code`, `currency_code`).
- Name columns: suffix with `_name` or use `name_bn`, `name_en` for bilingual.
- Description columns: suffix with `_description` or use `description_bn`, `description_en`.

## 4. Index Names

```
idx_{table_name}_{column_name}
```

- Single column: `idx_book_title`.
- Multi column: `idx_book_author_book_author`.
- Unique: `uidx_{table_name}_{column_name}` (e.g., `uidx_isbn_code`).

## 5. Constraint Names

```
{type}_{table_name}_{column_name}
```

- Primary key: `pk_{table_name}` (e.g., `pk_publisher`).
- Foreign key: `fk_{child_table}_{parent_table}` (e.g., `fk_imprint_publisher`).
- Unique: `uq_{table_name}_{column}` (e.g., `uq_isbn_code`).
- Check: `ck_{table_name}_{column}` (e.g., `ck_review_rating`).
- Default: no named constraint; use column default.

## 6. Junction Tables

- Named by combining the two entity table names in alphabetical order.
- Columns: both foreign keys, plus any relationship attributes.
- Primary key is a composite of both foreign keys unless surrogate key is justified.

## 7. Soft Delete Column

- Named `deleted_at` on every table.
- NULL means not deleted. A timestamp means deleted.

## 8. Audit Columns

Every table includes these three columns at the end:
- `created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`
- `updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`
- `deleted_at TIMESTAMP DEFAULT NULL`

Application-layer triggers or ORM middleware manage `updated_at`.
