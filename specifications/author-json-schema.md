# Author JSON Schema

**Version:** 1.0.0\
**Status:** Approved

---

## Purpose

Define the JSON schema for author/person data interchange. All author data imports, exports, and API payloads must conform to this schema.

## Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://tprokash.org/schemas/author-v1.json",
  "title": "Author",
  "type": "object",
  "required": ["person_id", "name_bn", "name_en", "slug"],
  "properties": {
    "person_id": {
      "type": "string",
      "pattern": "^PER-[A-Z0-9]{10}$"
    },
    "name_bn": {
      "type": "string",
      "minLength": 1
    },
    "name_en": {
      "type": "string",
      "minLength": 1
    },
    "slug": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$"
    },
    "birth_year": {
      "type": "integer",
      "minimum": 1800,
      "maximum": 2100
    },
    "death_year": {
      "type": "integer",
      "minimum": 1800,
      "maximum": 2100
    },
    "biography_bn": { "type": "string" },
    "biography_en": { "type": "string" },
    "website_url": { "type": "string", "format": "uri" },
    "pseudonym_of_id": {
      "type": "string",
      "pattern": "^PER-[A-Z0-9]{10}$"
    },
    "created_at": { "type": "string", "format": "date-time" },
    "updated_at": { "type": "string", "format": "date-time" },
    "book_ids": {
      "type": "array",
      "items": { "type": "string", "pattern": "^BOK-[A-Z0-9]{10}$" }
    },
    "source_ids": {
      "type": "array",
      "items": { "type": "string", "pattern": "^SRC-[A-Z0-9]{10}$" }
    }
  }
}
```

## Validation Rules

1. `person_id` must match the PER- prefix pattern.
2. Both `name_bn` and `name_en` are required.
3. `death_year` must be greater than `birth_year` if both are present.
4. `pseudonym_of_id` must reference an existing author record.
5. URLs must be valid URIs.

## Example

```json
{
  "person_id": "PER-A1B2C3D4E5",
  "name_bn": "সৈয়দ মুজতবা আলী",
  "name_en": "Syed Mujtaba Ali",
  "slug": "syed-mujtaba-ali",
  "birth_year": 1904,
  "death_year": 1974,
  "book_ids": ["BOK-F6G7H8I9J0", "BOK-K1L2M3N4O5"]
}
```

## Related

- Template: `data/templates/author.template.json`
- Schema: `database/schema.sql` — person table
