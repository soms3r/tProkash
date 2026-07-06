# Data

## What belongs here

Structured data files organized by entity type. Each subdirectory contains JSON or CSV data files for a specific domain entity (publishers, authors, books, etc.). The `datasets/` directory holds packaged, versioned releases. `imports/` and `exports/` are working directories for data pipelines. `templates/` contains JSON templates defining the required structure for each entity type.

## What does NOT belong here

- Database schema or SQL files (see `database/`)
- Application source code
- Generated or scraped data without source attribution
- Personal or confidential information
- Binary files exceeding 10 MB

## Dependencies

- Entity structure defined in `020-domain-architecture.md`
- JSON schemas in `specifications/`
- Import pipelines defined in `docs/IMPORT_PIPELINE.md`

## Notes

TODO: Establish data ingestion workflow and automated validation.
