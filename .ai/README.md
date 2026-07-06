# .ai — AI Context & Agentic Tooling

## What belongs here

- **`context/`** — Project context files read before every development task: project-state, repository-tree, architecture-index, database-index, documentation-index, dataset-index, development-rules
- **`milestones/`** — Milestone tracking records
- **`prompts/`** — Reusable AI prompts for common agentic workflows
- **`standards/`** — Coding standards and conventions for AI tooling

## What does NOT belong here

- Application source code (see `backend/`, `frontend/`, `api/`)
- Database schemas (see `database/`)
- Architecture documents (see `architecture/`)
- Data files (see `data/`)

## Dependencies

- All context files reference documents in `architecture/`, `database/`, `specifications/`, `docs/`, `data/`
- `project-state.md` depends on `Source123/CONSTITUTION.md` and `Source123/README.md`

## Notes

Context files are read by AI agents at the start of every development session. Keep them accurate and up to date. Update `project-state.md` when milestones advance or architecture freezes change.
