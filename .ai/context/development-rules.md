# Development Rules

## Architecture

1. **Architecture changes require an ADR** — Any modification to frozen architecture (see `project-state.md`) must follow the ADR process: Proposal → Discussion → ADR → Approval → Implementation.
2. **Never redesign the repository** — The top-level structure is frozen. New directories may be added, but existing ones must not be renamed, moved, or deleted.
3. **Database-first** — All designs derive from the database schema. Application layers follow the schema, not the reverse.
4. **Prefer extending existing standards** — When adding new entities, fields, or features, extend the existing patterns (prefix IDs, bilingual names, audit columns, soft delete, polymorphic linking) rather than creating new conventions.

## Data

5. **Never generate fake publisher data** — All data must be real and attributable to a source. Unknown values remain null.
6. **Always use UTF-8** — All text files, JSON data, SQL scripts, and documentation must be UTF-8 encoded.
7. **Every fact must be traceable to a source** — Data without source attribution must not be committed.
8. **Always validate against JSON schemas** — Before committing data, validate against the corresponding schema in `specifications/`.

## Files

9. **Never delete files without instruction** — Do not remove files or directories unless explicitly asked.
10. **Never modify SQL** — Schema files are frozen without a new ADR.
11. **Never modify API code** — API layer is not yet implemented; do not create or modify API files.
12. **Never modify templates** — Data templates in `data/templates/` define the contract; do not alter them.
13. **Never modify architecture documents** — Architecture documents are approved and frozen.

## Process

14. **Documentation before implementation** — Write specs and docs before writing code.
15. **Always use Semantic Versioning** — For schemas, datasets, and releases.
16. **Vendor-neutral SQL is canonical** — `schema.sql` is the source of truth; DB-specific ports are derivatives.
17. **No fabricated data** — Never invent or guess data values.
18. **Prefer stable designs** — Design for extensibility and backward compatibility.
19. **Commit messages must be concise** — Match the repo style: short, descriptive, imperative mood.

## Conventions

20. **Bilingual naming** — All named entities must have both Bengali (`bn`) and English (`en`) names where applicable.
21. **Prefixed IDs** — All entities use `{PREFIX}-XXXXXXXXXX` format (15 chars total).
22. **Singular snake_case** — Table names are singular snake_case.
23. **3NF compliance** — Keep schemas in Third Normal Form; no denormalization without documented exception.
24. **No fabricated source data** — Never generate fake source records, confidence scores, or verification statuses.
