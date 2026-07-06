# Dataset Index

## Dataset Directory

All datasets live under `data/datasets/`. Currently no published datasets exist — directory is ready for population.

### Metadata Schema

`data/datasets/dataset-metadata-schema.md` (v1.0.0, Approved)

Required metadata fields:
- `dataset_id`: DST- prefix (e.g. DST-A1B2C3D4E5)
- `dataset_name`, `name_bn`, `name_en`: Bilingual naming
- `slug`: URL-safe identifier
- `version`: Semantic Versioning (MAJOR.MINOR.PATCH)
- `license`: ODbL 1.0 (default), CC BY 4.0, CC0 1.0
- `language`: ISO 639-1
- `country`: ISO 3166-1 alpha-2 (BD)
- `verification_status`: draft, pending, verified, partially_verified, rejected, archived

### Planned Dataset Types

| Type | Description |
|------|-------------|
| `publishers-v1/` | Publisher directory |
| `authors-v1/` | Author registry |
| `books-v1/` | Book catalog |
| `combined-v1/` | Cross-referenced multi-entity dataset |

### Dataset Format

Each dataset directory contains:
- `dataset.json` — Metadata conforming to schema
- `data/` — Data files (JSON or CSV)
- `schema/` — Structure schemas
- `CHANGELOG.md` — Version history

## Data Templates

Defined in `data/templates/` — JSON templates defining required structure for each entity type:

| Template | Prefix | Lines | Key Features |
|----------|--------|-------|-------------|
| `publisher.template.json` | PUB- | 296 | v2.0.0, 38 fields across 4 classifications (required/recommended/optional/system) |
| `book.template.json` | BOK- | 108 | Bilingual titles, edition refs, author/publisher/category refs |
| `author.template.json` | PER- | 87 | Bilingual names, birth/death year, biography, pseudonym support |
| `dataset.template.json` | DST- | 112 | Version, license, entity counts |
| `source.template.json` | SRC- | 82 | 12 source types, confidence score, verification status |
| `verification.template.json` | VRF- | 60 | 6 statuses, confidence score, polymorphic entity linking |

## Entity Data Directories (Placeholders)

| Directory | Entity Type | ID Prefix |
|-----------|-------------|-----------|
| `data/publishers/` | Publisher | PUB- |
| `data/authors/` | Author/Person | PER- |
| `data/books/` | Book | BOK- |
| `data/bookstores/` | Bookstore | BST- |
| `data/distributors/` | Distributor | DST- |
| `data/editors/` | Editor (Contributor) | — |
| `data/printers/` | Printer | PRN- |
| `data/sources/` | Source | SRC- |

## Related Specifications

| Document | Description |
|----------|-------------|
| `specifications/publisher-json-schema.md` | Publisher JSON Schema |
| `specifications/book-json-schema.md` | Book JSON Schema |
| `specifications/author-json-schema.md` | Author JSON Schema |
| `specifications/dataset-json-schema.md` | Dataset JSON Schema |
| `docs/DATASET_VERSIONING.md` | Dataset versioning strategy |
| `docs/DATA_COLLECTION_GUIDE.md` | Data collection procedures |
| `docs/IMPORT_PIPELINE.md` | Import workflow |
| `docs/EXPORT_PIPELINE.md` | Export workflow |
| `scripts/import-workflow.md` | Import SOP (7-step process) |
