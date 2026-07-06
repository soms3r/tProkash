# Dataset Versioning

**Version:** 1.0.0\
**Status:** Approved

---

## Purpose

Define the versioning strategy for all tProkash datasets. Consistent versioning ensures consumers can track changes, manage updates, and maintain compatibility.

## Scope

All published datasets under `data/datasets/`. This policy applies to data versions, not schema versions (see `database/versioning-policy.md`).

## Definitions

- **Dataset:** A packaged collection of domain data with metadata.
- **Release:** A specific version of a dataset published for consumption.
- **Snapshot:** A point-in-time export of database records.
- **Incremental:** A release containing only records changed since the previous version.

## Versioning Scheme

Datasets follow **Semantic Versioning** (SemVer): `MAJOR.MINOR.PATCH`

### MAJOR (breaking)

Increment when:
- Columns are removed or renamed
- Data types change (e.g., string to integer)
- Entity identifiers are reassigned
- Relationship semantics change
- License terms change

### MINOR (non-breaking additions)

Increment when:
- New columns are added
- New entity types are included
- New records are added without breaking existing ones
- New data formats are supported alongside existing ones

### PATCH (backward-compatible fixes)

Increment when:
- Data corrections (fixed typos, updated URLs)
- Verification status changes
- Source references are added
- Metadata corrections

## Version Manifest

Every dataset directory contains a `CHANGELOG.md`:

```markdown
# Changelog

## 1.1.0 - 2026-07-06
- Added 25 new publisher records
- Added contact_method column

## 1.0.1 - 2026-07-05
- Corrected 3 publisher names
- Updated 5 website URLs

## 1.0.0 - 2026-07-01
- Initial release
```

## Release Frequency

- **PATCH releases:** As needed, no schedule
- **MINOR releases:** Monthly or quarterly
- **MAJOR releases:** As needed, announced 30 days in advance

## Backward Compatibility

- PATCH and MINOR releases must not break existing consumers.
- MAJOR releases may break compatibility with a deprecation notice.
- Previous MAJOR versions remain available for at least 6 months.
- A migration guide is provided for each MAJOR release.

## Verification at Release

Every dataset release must pass:
1. Schema validation against the JSON schema
2. Record count verification
3. Source reference integrity check
4. ID prefix validation
5. Bilingual completeness check

## Related

- JSON schema: `specifications/dataset-json-schema.md`
- Metadata schema: `data/datasets/dataset-metadata-schema.md`
- Database versioning: `database/versioning-policy.md`
