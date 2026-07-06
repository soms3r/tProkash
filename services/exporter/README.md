# Exporter

Data export and dataset packaging service.

**Stack:** TypeScript, batch processing

**Purpose:** Generates versioned dataset packages (JSON, CSV) from the database. Produces dataset metadata, changelogs, and schema files.

**Depends on:** `@tprokash/types`, `@tprokash/database`, `@tprokash/utils`

**Consumed by:** Internal (CLI / scheduled jobs)
