# Import Workflow

**Version:** 1.0.0\
**Status:** Approved

---

## Purpose

Standard operating procedure for importing data into the tProkash system. This document guides operators through the end-to-end import process.

## Prerequisites

- Source material collected and referenced
- Entity JSON schema reviewed
- Target entity type confirmed in the domain model
- Operator has appropriate role permissions

## Workflow Steps

### Step 1: Prepare Source

1. Identify the source material (website URL, document, email, etc.).
2. Verify the source fits one of the 12 defined source types.
3. Open `data/templates/source.template.json` as reference.
4. Create a source record with complete metadata.

### Step 2: Validate Source

1. Check source URL is accessible (for online sources).
2. Verify source credibility:
   - Government registry or ISBN agency: high confidence (80-100)
   - Official website or publisher email: medium-high (60-79)
   - News article or book fair catalog: medium (40-59)
   - Social media or community submission: low (0-39)
3. Assign initial confidence_score.

### Step 3: Prepare Entity Data

1. Open the appropriate template from `data/templates/`.
2. Fill in all required fields:
   - bilingual names (Bengali + English)
   - valid ID with correct prefix
   - slug
3. Fill in optional fields where data is available.
4. Do NOT fabricate or guess data — leave uncertain fields blank.

### Step 4: Validate Entity Data

1. Verify against the JSON schema in `specifications/`.
2. Check ID prefix matches entity type.
3. Verify all referenced IDs exist.
4. Validate domain rules:
   - Review rating: 1-5
   - Publication year: 4 digits
   - Quantity: non-negative
5. Fix any validation failures before proceeding.

### Step 5: Stage Import

1. Save the validated entity data as a JSON file in `data/imports/`.
2. Naming convention: `{entity}_{YYYYMMDD}_{batch_id}.json`.
3. Create entity_source junction linking the new entity to its source.
4. Set initial verification_status to "pending" if source is trustworthy, "draft" otherwise.

### Step 6: Verify

1. Review the staged data for accuracy.
2. Cross-reference with the source material.
3. Update verification_status:
   - All facts confirmed: "verified"
   - Some facts unconfirmed: "partially_verified"
   - Data is inaccurate: "rejected"
4. Record verification in the verification table.
5. Adjust confidence_score based on review findings.

### Step 7: Publish

1. Move the verified data file from `data/imports/` to `data/{entity_type}/`.
2. Update the entity record's verification_level in the database.
3. Record a change_history entry for the creation.
4. Archive the import file to `data/imports/archive/`.

## One-Time vs Batch

For single records, follow steps 1-7 directly.

For batch imports (multiple records from the same source):
1. Prepare the source once (Step 1-2).
2. Prepare all entity records (Step 3).
3. Validate all records in batch (Step 4).
4. Stage all records together (Step 5).
5. Verify records individually or by sampling (Step 6).
6. Publish all verified records (Step 7).

## Rollback

If an error is discovered after publication:
1. Do NOT delete the record (use soft delete).
2. Set verification_status to "rejected".
3. Record the reason in change_history.
4. Create a corrected import following the full workflow.

## Related

- Import pipeline: `docs/IMPORT_PIPELINE.md`
- Templates: `data/templates/`
- Schemas: `specifications/`
