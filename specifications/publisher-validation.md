# Publisher Validation

**Version:** 1.0.0\
**Status:** Approved

---

## Purpose

Define validation rules for Publisher data at all stages: import, update, and display.

## Scope

All Publisher records in the system, regardless of how they enter (manual entry, bulk import, API, community submission).

## Validation Rules

### Field-Level Rules

| Rule ID | Field | Rule | Error Message |
|---|---|---|---|
| PUB-VAL-001 | publisher_id | Must match pattern `^PUB-[A-Z0-9]{10}$` | Invalid publisher ID format |
| PUB-VAL-002 | publisher_id | Must be unique across all records | Duplicate publisher ID |
| PUB-VAL-003 | legal_name_bn | Must not be empty | Legal name (Bengali) is required |
| PUB-VAL-004 | legal_name_bn | Must contain at least one Bengali character | Legal name must include Bengali text |
| PUB-VAL-005 | legal_name_en | Must not be empty | Legal name (English) is required |
| PUB-VAL-006 | legal_name_en | Must contain only Latin characters, spaces, and punctuation | Legal name contains invalid characters |
| PUB-VAL-007 | display_name | Must not be empty | Display name is required |
| PUB-VAL-008 | display_name | Maximum 255 characters | Display name too long |
| PUB-VAL-009 | slug | Must match pattern `^[a-z0-9-]+$` | Slug must be lowercase with hyphens only |
| PUB-VAL-010 | slug | Must be unique across all records | Duplicate slug |
| PUB-VAL-011 | website_url | Must be a valid URI format if provided | Invalid website URL |
| PUB-VAL-012 | website_url | Must use HTTPS when available | Website should use HTTPS |
| PUB-VAL-013 | founded_year | Must be integer between 1800 and 2100 | Invalid founded year |
| PUB-VAL-014 | founded_year | Must not be in the future | Founded year cannot be in the future |
| PUB-VAL-015 | status | Must be one of: active, inactive, defunct, suspended | Invalid publisher status |
| PUB-VAL-016 | verification_status | Must be one of: draft, pending, verified, partially_verified, rejected, archived | Invalid verification status |
| PUB-VAL-017 | bin | Must be 9 or 13 digits if provided | Invalid BIN format |
| PUB-VAL-018 | tin | Must be 11 or 13 digits if provided | Invalid TIN format |
| PUB-VAL-019 | isbn_prefix | Must match pattern `^\\d{1,7}$` if provided | Invalid ISBN publisher prefix |
| PUB-VAL-020 | primary_email | Must be valid email format if provided | Invalid email format |
| PUB-VAL-021 | primary_phone | Must contain only digits, +, -, (, ) if provided | Invalid phone format |
| PUB-VAL-022 | address_country | Must be ISO 3166-1 alpha-2 code if provided | Invalid country code |
| PUB-VAL-023 | confidence_score | Must be integer between 0 and 100 | Invalid confidence score |
| PUB-VAL-024 | logo_url | Must reference an image file (jpg, png, gif, svg, webp) if provided | Invalid logo URL format |

### Business Rules

| Rule ID | Rule | Description |
|---|---|---|
| PUB-VAL-101 | Bilingual required | Every publisher must have both Bengali and English names |
| PUB-VAL-102 | Name consistency | display_name should match either legal_name or trade_name |
| PUB-VAL-103 | Unique name | No two active publishers may have the same legal_name_en |
| PUB-VAL-104 | At least one contact | Every publisher should have at least one contact method |
| PUB-VAL-105 | Website format normalization | Website URLs must be stored without trailing slash, lowercased |
| PUB-VAL-106 | Duplicate detection | A fuzzy match on legal_name_en + city is run on every new record to detect duplicates |
| PUB-VAL-107 | Self-reference guard | parent_organization_id must not reference the same publisher_id |

### Duplicate Detection Algorithm

When a new Publisher record is created, the system checks for potential duplicates:

1. **Exact match:** legal_name_en matches an existing record (case-insensitive) → reject as duplicate
2. **Fuzzy match:** legal_name_en similarity > 80% (Levenshtein ratio) → flag for manual review
3. **Name + City:** Same legal_name_en in same address_city → flag for manual review
4. **URL match:** Same website_url → flag for manual review

## Validation Severity

| Level | Behavior |
|---|---|
| ERROR | Record is rejected. Import fails for this record. |
| WARNING | Record is accepted but flagged for review. |
| INFO | Record is accepted. Notification sent to reviewer. |

## Validation Contexts

| Context | ERROR triggers | WARNING triggers |
|---|---|---|
| API create | Record rejected, 422 response | Record created, warning in response |
| API update | Record unchanged, 422 response | Record updated, warning in response |
| Bulk import | Record moved to failed/ | Record moved to warning/ |
| Manual entry | Field highlighted, cannot save | Field highlighted, can save |
