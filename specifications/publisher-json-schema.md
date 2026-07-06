# Publisher JSON Schema

**Version:** 1.0.0\
**Status:** Approved

---

## Purpose

Define the JSON schema for publisher data interchange. All publisher data imports, exports, and API payloads must conform to this schema.

## Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://tprokash.org/schemas/publisher-v1.json",
  "title": "Publisher",
  "type": "object",
  "required": ["publisher_id", "name_bn", "name_en", "slug"],
  "properties": {
    "publisher_id": {
      "type": "string",
      "pattern": "^PUB-[A-Z0-9]{10}$",
      "description": "Unique publisher identifier"
    },
    "name_bn": {
      "type": "string",
      "minLength": 1,
      "description": "Publisher name in Bengali"
    },
    "name_en": {
      "type": "string",
      "minLength": 1,
      "description": "Publisher name in English"
    },
    "slug": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$",
      "description": "URL-safe unique identifier"
    },
    "website_url": {
      "type": "string",
      "format": "uri",
      "description": "Official website URL"
    },
    "founded_year": {
      "type": "integer",
      "minimum": 1800,
      "maximum": 2100
    },
    "status": {
      "type": "string",
      "enum": ["active", "inactive", "defunct"],
      "default": "active"
    },
    "description_bn": { "type": "string" },
    "description_en": { "type": "string" },
    "logo_url": { "type": "string", "format": "uri" },
    "verification_level": {
      "type": "string",
      "enum": ["Verified", "Partially Verified", "Community Verified", "Needs Review"],
      "default": "Needs Review"
    },
    "created_at": { "type": "string", "format": "date-time" },
    "updated_at": { "type": "string", "format": "date-time" },
    "imprint_ids": {
      "type": "array",
      "items": { "type": "string", "pattern": "^IMP-[A-Z0-9]{10}$" }
    },
    "address_ids": {
      "type": "array",
      "items": { "type": "string", "pattern": "^ADR-[A-Z0-9]{10}$" }
    },
    "source_ids": {
      "type": "array",
      "items": { "type": "string", "pattern": "^SRC-[A-Z0-9]{10}$" }
    }
  }
}
```

## Validation Rules

1. `publisher_id` must match the PUB- prefix pattern.
2. `name_bn` and `name_en` are both required — bilingual data is mandatory.
3. `slug` must be lowercase with hyphens, no spaces.
4. `founded_year` must be a four-digit integer between 1800 and 2100.
5. `status` must be one of the three defined values.
6. All URLs must be valid URIs.

## Example

```json
{
  "publisher_id": "PUB-A1B2C3D4E5",
  "name_bn": "সময় প্রকাশন",
  "name_en": "Somoy Prokash",
  "slug": "somoy-prokash",
  "website_url": "https://example.com",
  "founded_year": 1995,
  "status": "active",
  "verification_level": "Verified",
  "source_ids": ["SRC-F6G7H8I9J0"]
}
```

## Related

- Template: `data/templates/publisher.template.json`
- Schema: `database/schema.sql` — publisher table
