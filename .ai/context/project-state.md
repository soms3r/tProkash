# Project State

## Current Milestone

**Milestone 1: Core Database Architecture (v0.1.0)**

Status: In Progress (Core Architecture Approved, Implementation Phase)

## Completed Sprints / Deliverables

- TP-CON-001 Project Constitution approved (Foundational)
- TP-ARCH-020 Domain Architecture v1.0.0 approved (720 lines, 42 entities, 99 business rules)
- Database schema (`schema.sql`) — 64 tables across vendor-neutral, MySQL, PostgreSQL, SQLite variants
- Database policies: database-standards, naming-convention, id-strategy, constraint-policy, index-policy, soft-delete-policy, versioning-policy, audit-policy, data-dictionary (2234 lines)
- Entity registry (48 entities) and relationship registry (100 relationships)
- Change history model, source model, verification model specs
- Specifications: 13 documents including publisher standard, JSON schemas, record lifecycle, workflow state machine
- Data templates: publisher, author, book, dataset, source, verification (6 files)
- Dataset metadata schema (DST- prefix, SemVer, ODbL 1.0)
- Docs: 21 documents covering data collection, verification, provenance, pipelines, workflows, policies
- Source123/ archive with project README, Constitution, roadmap, Milestone 1 deliverables

## Repository Structure

```
.ai/            AI context, prompts, milestones, standards
.github/        GitHub templates, workflows, issue templates
api/            API application (placeholder)
architecture/   Domain architecture documents
archive/        Archived content (placeholder)
assets/         Static assets (placeholder)
backend/        Backend application (placeholder)
data/           Structured data files by entity type
database/       Database schemas, policies, migrations
decisions/      Architecture Decision Records (placeholder)
design/         ER diagrams (Draw.io, Mermaid)
docs/           Documentation, policies, guides, workflows
examples/       Example files (placeholder)
exports/        Export output (placeholder)
frontend/       Frontend application (placeholder)
infrastructure/ Infrastructure configs (placeholder)
legal/          Legal documents (placeholder)
research/       Research materials (placeholder)
scripts/        Automation scripts, workflow docs
Source123/      Source documents, milestones, constitution
specifications/ Formal specifications, JSON schemas
templates/      File/entity templates (placeholder)
tests/          Test files (placeholder)
tools/          Utility tools (placeholder)
Source123.zip   ZIP archive of Source123/
```

## Frozen Architecture

The following architectural decisions are frozen and must not be changed without a new ADR:

1. **Database-first architecture** — All designs derive from the database schema; application layers follow
2. **Prefixed ID strategy** — `{PREFIX}-XXXXXXXXXX` (15 chars) for all entities (72 prefixes defined)
3. **Polymorphic entity linking** — Via `(entity_type, entity_id)` pattern
4. **Soft delete** — `deleted_at TIMESTAMP DEFAULT NULL` on all tables
5. **Audit columns** — `created_at`, `updated_at`, `deleted_at` on every table
6. **Bilingual data** — Bengali (`bn`) and English (`en`) for all named entities
7. **Verification levels** — Verified, Partially Verified, Community Verified, Needs Review
8. **Source-attributed data** — Every fact links to a Source
9. **Vendor-neutral SQL primary** — `schema.sql` is canonical; MySQL/PostgreSQL/SQLite are ports
10. **Third Normal Form (3NF)** — No denormalization without documented exception
11. **Semantic Versioning** — For schemas, datasets, and releases
12. **No fabricated data** — Never generate fake publisher data; unknown values remain null

## Pending Milestones

| Milestone | Description | Status |
|-----------|-------------|--------|
| M1.1 | Core Database Architecture | In Progress (schema, policies, specs approved) |
| M1.2 | Seed Data & Publishing Workflows | Pending |
| M1.3 | API Foundation | Pending |
| M2.0 | Open Publisher Directory MVP | Pending |
| M2.1 | Search & Discovery | Pending |
| M2.2 | Publishing Handbook | Pending |
| M3.0 | Community Features | Pending |
| M3.1 | Automated Verification Pipeline | Pending |
| M4.0 | API v1 Public Release | Pending |
