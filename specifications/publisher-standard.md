# Publisher Standard

**Document ID:** SPEC-PUB-001\
**Version:** 1.0.0\
**Status:** Approved

---

## 1. Purpose

Define the canonical Publisher data model for the tProkash ecosystem. This standard governs all Publisher data regardless of storage format (SQL, JSON, CSV) or transport (API, file, import).

## 2. Scope

All systems, pipelines, and data files that create, read, update, or delete Publisher records must conform to this standard.

## 3. Entity Definition

A Publisher is an organization that produces and distributes books, journals, or other literary works for the Bangladeshi market. A Publisher may operate under multiple Imprints, employ or contract Authors, and provide various publishing-related services.

## 4. Field Classification

Every Publisher field is classified into one of four categories:

### REQUIRED

Fields that must always be present. Records missing any REQUIRED field are invalid and must be rejected.

- publisher_id
- legal_name_bn
- legal_name_en
- display_name
- verification_status
- created_at
- updated_at

### RECOMMENDED

Fields that should be populated when the data is available. Missing RECOMMENDED fields produce a warning but do not block import.

- slug
- trade_name_bn
- trade_name_en
- website_url
- founded_year
- status
- description_bn
- description_en
- logo_url
- services
- primary_contact
- primary_email
- primary_phone
- address_city
- address_country

### OPTIONAL

Fields that are populated only when specifically relevant.

- registration_number
- bin
- tin
- isbn_prefix
- social_media_links
- alternate_names
- notes
- parent_organization_id
- address_line_1
- address_line_2
- address_postal_code
- latitude
- longitude

### SYSTEM

Fields managed exclusively by the system. These must never be provided by external data sources.

- created_at
- updated_at
- deleted_at
- created_by
- updated_by
- change_history
- audit_log_entries

## 5. Publisher Identifiers

See `publisher-identifiers.md` for the complete identifier specification.

## 6. Publisher Status

A Publisher may be in one of the following states at any time:

- **active:** Currently publishing and operational
- **inactive:** Registered but not actively publishing
- **defunct:** Ceased operations permanently
- **suspended:** Temporarily inactive

See `publisher-status.md` for state transition rules.

## 7. Publisher Services

A Publisher may offer any combination of services defined in `publisher-services.md`.

## 8. Verification

Publisher records follow the verification workflow defined in `publisher-verification.md`.

## 9. Validation

Field-level validation rules are defined in `publisher-validation.md`.

## 10. Related Documents

- Publisher fields: `specifications/publisher-fields.md`
- Publisher validation: `specifications/publisher-validation.md`
- Publisher verification: `specifications/publisher-verification.md`
- Publisher services: `specifications/publisher-services.md`
- Publisher identifiers: `specifications/publisher-identifiers.md`
- Publisher status: `specifications/publisher-status.md`
- JSON schema: `specifications/publisher-json-schema.md`
- Template: `data/templates/publisher.template.json`
- Data guide: `docs/PUBLISHER_DATA_GUIDE.md`
