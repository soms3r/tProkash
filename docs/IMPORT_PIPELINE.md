# Import Pipeline

**Version:** 1.0.0\
**Status:** Approved

---

## Purpose

Define the standard workflow for importing data into the tProkash database. All data imports must follow this pipeline to ensure consistency, provenance, and verification.

## Scope

Data entering the system from external sources: community submissions, bulk imports, partner data, and manual entry.

## Pipeline Stages

```
Source Acquisition → Validation → Staging → Verification → Publication
```

### 1. Source Acquisition

- Capture the source material (URL, document, email, phone log).
- Assign a source_id and record in the `source` table.
- Classify source type per the predefined list.
- Assign initial confidence score.

**Output:** Source record created in `sources/` staging.

### 2. Validation

- Validate data against the entity JSON schema.
- Check required fields: bilingual names, valid IDs, correct prefixes.
- Validate relationships (referenced IDs must exist or be in the same batch).
- Check domain rules (rating 1-5, quantity >= 0, ISBN check digit).

**Output:** Validation report (pass/fail/warnings).

### 3. Staging

- Import valid records into `data/imports/` as JSON files.
- Assign temporary or permanent entity IDs.
- Create entity_source junction records.
- Mark verification_status as "draft".
- Set confidence_score based on source type:
  - government_registry: 90
  - isbn_agency: 85
  - official_website: 70
  - publisher_email: 60
  - phone_confirmation: 55
  - publisher_document: 50
  - news_article: 40
  - book_fair_catalog: 40
  - social_media: 20
  - community_submission: 10

**Output:** Staged JSON files in `data/imports/`.

### 4. Verification

- Verification operator reviews staged records.
- Updates verification_status to verified, partially_verified, or rejected.
- Adjusts confidence_score if needed.
- Records verification in the `verification` table.
- Links verification to user and source.

**Output:** Verification records created.

### 5. Publication

- Move verified records from staging to the production `data/` directories.
- Update entity verification_level.
- Record change_history entries for each new entity.
- Update or create dataset metadata.
- Archive import file to `data/imports/archive/`.

**Output:** Production data files in `data/{entity_type}/`.

## File Naming

Import files follow this convention:

```
{entity_type}_{date}_{batch_id}.json
```

Example: `publishers_20260706_001.json`

## Import Types

| Type | Description | Verification Required |
|---|---|---|
| bulk_import | Large batch from trusted source | Spot-check |
| community_submission | User-contributed data | Full review |
| manual_entry | Operator-entered data | Full review |
| api_import | Data from partner API | Automated |
| correction | Fix to existing data | Depends on field |

## Error Handling

- Schema validation failures: rejected immediately with error log.
- Missing required fields: quarantined for manual review.
- Duplicate detection: flagged for merge review.
- Relationship integrity failures: held until referenced records are available.

## Related

- Scripts: `scripts/import-workflow.md`
- Templates: `data/templates/`
- Schemas: `specifications/`
