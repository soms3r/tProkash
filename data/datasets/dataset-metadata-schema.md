# Dataset Metadata Schema

**Version:** 1.0.0\
**Status:** Approved

---

## Purpose

Define the required metadata structure for every tProkash dataset. All dataset releases MUST include a `dataset.json` file conforming to this schema.

## Schema

```json
{
  "dataset_id": "DST-A1B2C3D4E5",
  "dataset_name": "Bangladesh Publisher Directory",
  "name_bn": "বাংলাদেশ প্রকাশক ডিরেক্টরি",
  "name_en": "Bangladesh Publisher Directory",
  "slug": "bangladesh-publisher-directory",
  "version": "1.0.0",
  "description": "Verified directory of book publishers operating in Bangladesh.",
  "license": "ODbL 1.0",
  "language": "bn",
  "country": "BD",
  "created_at": "2026-07-06T00:00:00Z",
  "updated_at": "2026-07-06T00:00:00Z",
  "record_count": 0,
  "source_count": 0,
  "verification_status": "draft",
  "file_url": null,
  "row_count": 0,
  "is_public": true,
  "publisher_id": null,
  "sources": [],
  "included_entities": {
    "publishers": 0,
    "authors": 0,
    "books": 0,
    "editions": 0,
    "imprints": 0,
    "printers": 0,
    "distributors": 0,
    "bookstores": 0
  }
}
```

## Field Descriptions

| Field | Type | Required | Description |
|---|---|---|---|
| dataset_id | string | yes | Unique dataset identifier (DST- prefix) |
| dataset_name | string | yes | Human-readable English name |
| name_bn | string | yes | Dataset name in Bengali |
| name_en | string | yes | Dataset name in English |
| slug | string | yes | URL-safe identifier |
| version | string | yes | Semantic version (SemVer) |
| description | string | no | Detailed description of contents |
| license | string | yes | License identifier (default: ODbL 1.0) |
| language | string | yes | Primary language code (ISO 639-1) |
| country | string | yes | Country code (ISO 3166-1 alpha-2) |
| created_at | string (date-time) | yes | ISO 8601 creation timestamp |
| updated_at | string (date-time) | yes | ISO 8601 last update timestamp |
| record_count | integer | no | Number of records in dataset |
| source_count | integer | no | Number of distinct sources |
| verification_status | string | no | One of: draft, pending, verified, partially_verified, rejected, archived |
| file_url | string (uri) | no | URL to downloadable dataset file |
| row_count | integer | no | Total data rows |
| is_public | boolean | no | Whether dataset is publicly accessible |
| publisher_id | string | no | Publishing organization (PUB- prefix) |
| sources | array | no | Source references (SRC- prefix) |
| included_entities | object | no | Count of each entity type included |

## Versioning

Datasets follow Semantic Versioning (MAJOR.MINOR.PATCH):

- **MAJOR:** Breaking changes to data structure or semantics
- **MINOR:** Additions that do not break existing consumers
- **PATCH:** Corrections, additions of new records

## License Requirements

Every dataset must declare a license. Recommended licenses:

- **ODbL 1.0** for database contents (default)
- **CC BY 4.0** for documentation
- **CC0 1.0** for public domain data

## Verification Requirements

Dataset-level verification status conveys the overall trustworthiness of the dataset:

- **draft:** Dataset is being assembled, not ready for use
- **pending:** Dataset assembled, awaits verification review
- **verified:** All records meet verification standards
- **partially_verified:** Some records verified, others pending
- **rejected:** Dataset failed verification
- **archived:** Superseded by newer version, kept for historical reference
