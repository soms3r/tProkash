# Importer

Data import and ingestion service.

**Stack:** TypeScript, batch processing

**Purpose:** Validates and imports data from external sources (JSON, CSV, publisher feeds). Runs validation schemas, deduplicates, and writes to the database.

**Depends on:** `@tprokash/types`, `@tprokash/database`, `@tprokash/validation`, `@tprokash/utils`

**Consumed by:** Internal (CLI / scheduled jobs)
