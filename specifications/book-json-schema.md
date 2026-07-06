# Book JSON Schema

**Version:** 1.0.0\
**Status:** Approved

---

## Purpose

Define the JSON schema for book data interchange. All book data imports, exports, and API payloads must conform to this schema.

## Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://tprokash.org/schemas/book-v1.json",
  "title": "Book",
  "type": "object",
  "required": ["book_id", "title_bn", "title_en", "slug"],
  "properties": {
    "book_id": {
      "type": "string",
      "pattern": "^BOK-[A-Z0-9]{10}$"
    },
    "title_bn": {
      "type": "string",
      "minLength": 1
    },
    "title_en": {
      "type": "string",
      "minLength": 1
    },
    "subtitle_bn": { "type": "string" },
    "subtitle_en": { "type": "string" },
    "slug": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$"
    },
    "description_bn": { "type": "string" },
    "description_en": { "type": "string" },
    "num_pages": {
      "type": "integer",
      "minimum": 1
    },
    "publication_year": {
      "type": "integer",
      "minimum": 1800,
      "maximum": 2100
    },
    "series_number": {
      "type": "integer",
      "minimum": 1
    },
    "created_at": { "type": "string", "format": "date-time" },
    "updated_at": { "type": "string", "format": "date-time" },
    "imprint_id": {
      "type": "string",
      "pattern": "^IMP-[A-Z0-9]{10}$"
    },
    "series_id": {
      "type": "string",
      "pattern": "^SER-[A-Z0-9]{10}$"
    },
    "author_ids": {
      "type": "array",
      "items": { "type": "string", "pattern": "^PER-[A-Z0-9]{10}$" },
      "minItems": 1
    },
    "publisher_ids": {
      "type": "array",
      "items": { "type": "string", "pattern": "^PUB-[A-Z0-9]{10}$" }
    },
    "edition_ids": {
      "type": "array",
      "items": { "type": "string", "pattern": "^EDN-[A-Z0-9]{10}$" }
    },
    "category_ids": {
      "type": "array",
      "items": { "type": "string", "pattern": "^CAT-[A-Z0-9]{10}$" }
    },
    "source_ids": {
      "type": "array",
      "items": { "type": "string", "pattern": "^SRC-[A-Z0-9]{10}$" }
    }
  }
}
```

## Validation Rules

1. `book_id` must match the BOK- prefix pattern.
2. Both `title_bn` and `title_en` are required.
3. `author_ids` must contain at least one author — a book cannot exist without an author.
4. `publication_year` must be a four-digit integer.
5. `num_pages` must be positive if provided.
6. All ID references must use the correct prefix pattern.

## Example

```json
{
  "book_id": "BOK-A1B2C3D4E5",
  "title_bn": "পথের পাঁচালী",
  "title_en": "Pather Panchali",
  "slug": "pather-panchali",
  "publication_year": 1929,
  "author_ids": ["PER-F6G7H8I9J0"],
  "publisher_ids": ["PUB-K1L2M3N4O5"],
  "category_ids": ["CAT-P6Q7R8S9T0"]
}
```

## Related

- Template: `data/templates/book.template.json`
- Schema: `database/schema.sql` — book, edition, book_author tables
