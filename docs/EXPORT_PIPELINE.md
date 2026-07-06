# Export Pipeline

**Version:** 1.0.0\
**Status:** Approved

---

## Purpose

Define the standard workflow for exporting data from the tProkash database. All data exports must follow this pipeline to ensure completeness, accuracy, and traceability.

## Scope

Data leaving the system for public release, partner distribution, research use, or archival.

## Pipeline Stages

```
Query → Validation → Packaging → Metadata → Publication
```

### 1. Query

- Define the export scope: entity type, date range, verification level.
- Execute database query with active records (deleted_at IS NULL).
- Respect soft-delete: exclude soft-deleted records unless explicitly requested.
- Include all related junction data for referential integrity.

**Output:** Raw query result set.

### 2. Validation

- Validate exported records against the entity JSON schema.
- Verify all required fields are populated.
- Check relationship integrity (referenced IDs exist).
- Count records and compare to expected totals.
- Flag any records that fail validation for exclusion.

**Output:** Validation report with pass/fail counts.

### 3. Packaging

- Format data as JSON or CSV per export specification.
- Organize files by entity type within the dataset directory.
- Generate `dataset.json` metadata file.
- Include schema files for reference.
- Create data dictionary excerpt for the dataset.

**Output:** Structured dataset directory.

### 4. Metadata

dataset.json must include:
- dataset_id, dataset_name, version
- name_bn, name_en, slug
- license, language, country
- created_at, updated_at
- record_count, source_count
- verification_status
- included_entities with counts per type

**Output:** Complete dataset metadata.

### 5. Publication

- Copy dataset to `data/exports/` with timestamp.
- Record export event in audit_log.
- Update dataset table in database.
- Create source links for the dataset.
- Make dataset available for download (if public).

**Output:** Published dataset in `data/exports/` or `data/datasets/`.

## File Naming

Export directories follow this convention:

```
{entity}-v{major}.{minor}.{patch}/
```

Example: `publishers-v1.2.0/`

## Export Formats

| Format | Extension | When to Use |
|---|---|---|
| JSON | .json | Structured data with nested relationships |
| CSV | .csv | Tabular data, flat records |
| JSON Lines | .jsonl | Large datasets, streaming |

## Export Types

| Type | Description | Destination |
|---|---|---|
| public_release | Open data publication | `data/datasets/` |
| partner_export | Data shared with partner | `data/exports/` |
| research_snapshot | Point-in-time for research | `data/exports/` |
| backup | System backup | Archive |
| changelog | Changes since last export | `data/exports/` |

## Quality Checks

Before publication:
1. All records pass schema validation
2. Record count matches expected range
3. No duplicate IDs within the dataset
4. All foreign key references resolve within dataset or are documented as external
5. License and attribution information is included
6. Dataset is openable and parseable

## Related

- Dataset versioning: `docs/DATASET_VERSIONING.md`
- Templates: `data/templates/`
- Schemas: `specifications/`
