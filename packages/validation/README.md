# Validation

Shared validation rules and schemas for tProkash entities.

**Stack:** TypeScript, Zod or Valibot

**What it contains:**
- Entity validation schemas (publisher, book, person, edition)
- Field-level validators (bilingual name, ISBN, prefixed ID, URL)
- Business rule validators
- Schema versioning and migration validation
- JSON Schema generation from Zod schemas

**Depends on:** `@tprokash/types`

**Used by:** `apps/api`, `services/importer`, `services/exporter`
