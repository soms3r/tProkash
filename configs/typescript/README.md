# TypeScript

Shared TypeScript configuration for all tProkash projects.

**What it contains:**
- Base `tsconfig.json` with strict mode
- App-specific configs (next.js, node)
- Package-specific configs (library)
- Path aliases matching workspace package names
- Declaration output settings

**Used by:** All apps, packages, and services via `extends`
