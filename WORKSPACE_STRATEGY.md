# Workspace Strategy

## Tool Comparison

### pnpm

**Strengths:**
- Strict dependency isolation — prevents phantom dependencies and incorrect imports
- Content-addressable store — efficient disk usage across projects
- Workspace protocol (`workspace:*`) — native monorepo support
- Fast — parallel installation, caching
- Mature ecosystem — widely adopted for TypeScript monorepos
- `.npmrc` strict mode catches misconfigured imports at install time

**Weaknesses:**
- Node module structure differs from npm (can confuse some tools)
- Slightly steeper learning curve for teams used to npm

### npm Workspaces

**Strengths:**
- Built into npm — zero extra tooling
- Simple to set up
- Familiar to all Node.js developers

**Weaknesses:**
- Hoists dependencies to root — phantom dependencies go undetected
- Slower than pnpm
- No content-addressable storage — duplicate packages consume more disk
- Workspace features are less mature than pnpm or yarn

### Turborepo

**Strengths:**
- Parallel task execution — builds, tests, and lint run in dependency order
- Caching — local and remote (Vercel) task caching speeds up CI
- Configuration as code — `turbo.json` defines pipeline
- Framework-agnostic — works with any build tool
- Native pnpm/npm/yarn workspace support

**Weaknesses:**
- Not a package manager — must pair with pnpm, npm, or yarn
- Remote caching requires Vercel account (pro tier) or self-hosted server
- Adds complexity for very small projects

### Nx

**Strengths:**
- Comprehensive — task runner, cache, dependency graph visualization, code generation
- Language-agnostic — supports JS, Go, Python, Rust
- Powerful plugin system
- Affected command — only run tasks for changed projects
- Enforces project boundaries and dependency rules

**Weaknesses:**
- Steep learning curve — large API surface and configuration
- Heavier than Turborepo for simple monorepos
- Overkill for projects under 10 packages
- Plugin system can introduce breaking changes

---

## Recommendation: pnpm + Turborepo

| Role | Tool | Why |
|------|------|-----|
| **Package manager** | **pnpm** | Strict dependency isolation prevents phantom dependencies. Content-addressable store saves disk. Workspace protocol is mature and well-supported. |
| **Task runner** | **Turborepo** | Fast parallel execution with caching. Zero-config for most pipelines. Native pnpm integration. Lighter than Nx but covers all needs. |
| **Linting** | **ESLint v9+ with `typescript-eslint`** | Industry standard. Shared config via `configs/eslint`. Flat config support. |
| **Formatting** | **Prettier** | Universal formatting. Shared config via `configs/prettier`. CI check on every PR. |
| **Testing** | **Vitest** | Fast, Vite-native, Jest-compatible API. Built-in coverage, watch mode, and workspace support. |
| **Git hooks** | **husky + lint-staged** | Run lint + format on staged files before commit. Enforces code quality at the gate. |
| **Commit conventions** | **commitlint + conventional commits** | `feat:`, `fix:`, `chore:`, `docs:` prefixes. Enables automatic changelog generation and semantic versioning. |

## Why Not Nx

Nx is powerful but introduces unnecessary complexity for tProkash's current scale. The project has ~20 packages/apps/services — well within Turborepo's sweet spot. If the monorepo grows to 50+ projects with complex cross-cutting concerns, Nx should be reevaluated.

## Implementation Plan

1. Install pnpm globally (`npm i -g pnpm`)
2. Initialize workspace root with `pnpm-workspace.yaml`
3. Define workspace packages: `apps/*`, `packages/*`, `services/*`
4. Install Turborepo as root dev dependency
5. Create `turbo.json` with pipeline definitions:
   - `build` — depends on dependencies' build, outputs dist/
   - `lint` — depends on workspace lint config
   - `typecheck` — depends on workspace tsconfig
   - `test` — depends on build
6. Configure shared TypeScript, ESLint, Prettier configs
7. Set up husky + lint-staged + commitlint
8. Add CI pipeline (GitHub Actions): lint → typecheck → test → build
