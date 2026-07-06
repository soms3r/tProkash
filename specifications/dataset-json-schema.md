# Dataset JSON Schema

**Version:** 1.0.0\
**Status:** Approved

---

## Purpose

Define the JSON schema for dataset metadata. All dataset metadata files (`dataset.json`) must conform to this schema.

## Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://tprokash.org/schemas/dataset-v1.json",
  "title": "Dataset Metadata",
  "type": "object",
  "required": [
    "dataset_id", "dataset_name", "name_bn", "name_en",
    "slug", "version", "license", "language", "country",
    "created_at", "updated_at"
  ],
  "properties": {
    "dataset_id": {
      "type": "string",
      "pattern": "^DST-[A-Z0-9]{10}$"
    },
    "dataset_name": {
      "type": "string",
      "description": "Human-readable dataset name"
    },
    "name_bn": { "type": "string" },
    "name_en": { "type": "string" },
    "slug": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$"
    },
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$",
      "description": "Semantic version (SemVer)"
    },
    "description": { "type": "string" },
    "license": {
      "type": "string",
      "default": "ODbL 1.0"
    },
    "language": {
      "type": "string",
      "description": "ISO 639-1 language code"
    },
    "country": {
      "type": "string",
      "description": "ISO 3166-1 alpha-2 country code"
    },
    "created_at": { "type": "string", "format": "date-time" },
    "updated_at": { "type": "string", "format": "date-time" },
    "record_count": {
      "type": "integer",
      "minimum": 0
    },
    "source_count": {
      "type": "integer",
      "minimum": 0
    },
    "verification_status": {
      "type": "string",
      "enum": ["draft", "pending", "verified", "partially_verified", "rejected", "archived"]
    },
    "file_url": { "type": "string", "format": "uri" },
    "row_count": { "type": "integer", "minimum": 0 },
    "is_public": { "type": "boolean", "default": true },
    "publisher_id": {
      "type": "string",
      "pattern": "^PUB-[A-Z0-9]{10}$"
    },
    "sources": {
      "type": "array",
      "items": { "type": "string", "pattern": "^SRC-[A-Z0-9]{10}$" }
    },
    "included_entities": {
      "type": "object",
      "properties": {
        "publishers": { "type": "integer", "minimum": 0 },
        "authors": { "type": "integer", "minimum": 0 },
        "books": { "type": "integer", "minimum": 0 },
        "editions": { "type": "integer", "minimum": 0 },
        "imprints": { "type": "integer", "minimum": 0 },
        "printers": { "type": "integer", "minimum": 0 },
        "distributors": { "type": "integer", "minimum": 0 },
        "bookstores": { "type": "integer", "minimum": 0 }
      }
    }
  }
}
```

## Validation Rules

1. `dataset_id` must match the DST- prefix pattern.
2. `version` must be a valid SemVer string (e.g., 1.0.0, 2.3.1).
3. `verification_status` must be one of the six defined values.
4. All entity count fields in `included_entities` must be non-negative.
5. `created_at` must be before or equal to `updated_at`.

## Example

```json
{
  "dataset_id": "DST-A1B2C3D4E5",
  "dataset_name": "Bangladesh Publisher Directory",
  "name_bn": "বাংলাদেশ প্রকাশক ডিরেক্টরি",
  "name_en": "Bangladesh Publisher Directory",
  "slug": "bangladesh-publisher-directory",
  "version": "1.0.0",
  "description": "Verified directory of book publishers in Bangladesh.",
  "license": "ODbL 1.0",
  "language": "bn",
  "country": "BD",
  "created_at": "2026-07-06T00:00:00Z",
  "updated_at": "2026-07-06T00:00:00Z",
  "record_count": 150,
  "source_count": 75,
  "verification_status": "verified",
  "is_public": true,
  "included_entities": {
    "publishers": 150,
    "imprints": 200,
    "authors": 0,
    "books": 0,
    "editions": 0,
    "printers": 0,
    "distributors": 0,
    "bookstores": 0
  }
}
```

## Related

- Dataset metadata: `data/datasets/dataset-metadata-schema.md`
- Template: `data/templates/dataset.template.json`
- Schema: `database/schema.sql` — dataset table
