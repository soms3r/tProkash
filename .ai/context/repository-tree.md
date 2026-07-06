# Repository Tree — Top-Level Folders

## `.ai/`
AI context files for agentic tooling. Contains:
- `context/` — Project overview, repository map, glossary, folder purpose, coding rules, architecture summary
- `milestones/` — Milestone tracking (`.gitkeep`)
- `prompts/` — AI prompts (`.gitkeep`)
- `standards/` — Coding standards (`.gitkeep`)

## `.github/`
GitHub configuration. Contains:
- `ISSUE_TEMPLATE/` — Issue templates (`.gitkeep`)
- `PULL_REQUEST_TEMPLATE.md` — PR template (TODO)
- `workflows/` — CI/CD workflows (`.gitkeep`)

## `api/`
API application code. Placeholder — not yet implemented.

## `architecture/`
Domain architecture documents. Contains one critical document:
- `020-domain-architecture.md` — 720-line approved architecture defining 42 entities, 99 business rules, and lifecycle state machines

## `archive/`
Archived/stale content. Placeholder — not yet populated.

## `assets/`
Static assets (images, logos). Placeholder — not yet populated.

## `backend/`
Backend application code. Placeholder — not yet implemented.

## `data/`
Structured data files organized by entity type. Contains:
- `authors/`, `books/`, `bookstores/`, `distributors/`, `editors/`, `printers/`, `publishers/`, `sources/` — Entity data directories (placeholders)
- `datasets/` — Versioned dataset releases with metadata schema
- `exports/`, `imports/` — Working directories for data pipelines
- `templates/` — JSON templates (author, book, publisher, dataset, source, verification)

## `database/`
Database schemas, policies, and migration scripts. Contains:
- `schema.sql` — Vendor-neutral canonical schema (64 tables)
- `schema-mysql.sql`, `schema-postgresql.sql`, `schema-sqlite.sql` — DB-specific ports
- 10 policy documents (naming, IDs, constraints, indexes, soft-delete, versioning, audit, data-dictionary, entity-registry, relationship-registry)
- 3 model specifications (change-history, source, verification)
- `migrations/`, `seed/`, `exports/`, `relationships/`, `schema/` — Placeholder directories

## `decisions/`
Architecture Decision Records. Placeholder — not yet populated.

## `design/`
Design documents and diagrams:
- `erd.drawio` — Entity-Relationship Diagram (Draw.io)
- `erd.mmd` — Entity-Relationship Diagram (Mermaid)

## `docs/`
Documentation: policies, guides, workflows. Contains 21 documents covering data collection, verification, provenance, pipelines, policies, and review workflows.

## `examples/`
Example files. Placeholder — not yet populated.

## `exports/`
Export output directory. Placeholder — not yet populated.

## `frontend/`
Frontend application code. Placeholder — not yet implemented.

## `infrastructure/`
Infrastructure configuration. Placeholder — not yet populated.

## `legal/`
Legal documents and templates. Placeholder — not yet populated.

## `research/`
Research materials. Placeholder — not yet populated.

## `scripts/`
Automation scripts and workflow documentation:
- `README.md` — Folder purpose description
- `import-workflow.md` — 108-line import workflow SOP (7-step process)

## `Source123/`
Source documents, archives, and project constitution:
- `README.md` — Project vision, goals, and overview
- `CONSTITUTION.md` — TP-CON-001 Project Constitution (8 core principles, engineering/data/api principles)
- Word docs: Contributing guide, data policy, data schema, roadmap
- Milestone archives: `tProkash_Milestone1_v0.1.0.zip`, `tProkash_Milestone1.1_CoreDatabaseArchitecture.zip`
- Extracted milestone directories

## `specifications/`
Formal specifications and JSON schemas. Contains 13 documents: publisher standard, publisher JSON schema, book JSON schema, author JSON schema, dataset JSON schema, publisher fields, identifiers, services, status, validation, verification, record lifecycle, workflow state machine.

## `templates/`
File/entity templates. Placeholder — not yet populated.

## `tests/`
Test files. Placeholder — not yet populated.

## `tools/`
Utility tools. Placeholder — not yet populated.
