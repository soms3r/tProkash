# tProkash Monorepo

## Repository Philosophy

One repository. One truth. tProkash is structured as a monorepo because the project's domain — the Bangladeshi publishing ecosystem — is deeply interconnected. Separating every piece into its own repository would create synchronization overhead, duplicate tooling, and friction for contributors.

**Key beliefs:**

- **Shared code, shared standards.** Every package follows the same linting, formatting, and type-checking rules. Consistency is enforced at the repository level, not negotiated across repos.
- **Atomic changes across boundaries.** A change to the database schema, the TypeScript types, an API endpoint, and the frontend component that consumes it can happen in a single commit.
- **Discoverability.** Any contributor can find any piece of the system without knowing which repo to look in.
- **Scale the team, not the repos.** As tProkash grows, we add more packages and apps, not more repositories.

## Folder Ownership

| Directory | Owner | Purpose |
|-----------|-------|---------|
| `apps/` | Application teams | Runnable applications (web, admin, API, docs site) |
| `packages/` | Platform team | Shared libraries consumed by apps and services |
| `services/` | Service teams | Long-running background services |
| `configs/` | Platform team | Shared tool configurations |
| `modules/` | Domain teams | Bounded-context module definitions |
| `database/` | Database team | Canonical SQL schemas and policies |
| `docs/` | Product team | Documentation and guides |
| `product/` | Product team | Product specifications and roadmaps |
| `.ai/` | Platform team | AI context and agent configurations |

Each directory has a single designated owner (team or individual) responsible for its design and quality. Cross-directory changes require coordination with the owning team.

## Dependency Rules

See `DEPENDENCY_RULES.md` for the complete dependency graph.

**Summary:**
- Apps may depend on packages and services
- Services may depend on packages
- Packages never depend on apps or services
- `@tprokash/types` and `@tprokash/utils` are zero-dependency base packages
- `@tprokash/database` is the single source of truth for data access
- No circular dependencies allowed

## Import Rules

1. **Package references use workspace protocol.** All internal dependencies use `"@tprokash/*": "workspace:*"` in `package.json`.
2. **Apps import from the public API of packages.** No deep imports into internal package structure (e.g., `@tprokash/database/internal` is forbidden).
3. **Relative imports within an app or package are allowed.** Relative imports crossing package boundaries are forbidden.
4. **Services import from packages only.** Services never import directly from apps.
5. **Type-only imports should use `import type`** to avoid runtime side-effects.

## Shared Package Rules

1. **Every package has a single entry point.** Defined by the `exports` field in `package.json`. No barrel files that re-export everything.
2. **Packages are independently versioned.** Follow SemVer. Breaking changes in a shared package require a major version bump and migration guide.
3. **Packages publish type declarations.** Every package generates `.d.ts` files so consumers get full type safety.
4. **No application logic in packages.** Packages provide utilities, types, and shared infrastructure — not business workflows.
5. **The `@tprokash/database` package** is the exclusive ORM/database access layer. Apps and services do not import query builders directly.
6. **The `@tprokash/types` package** is the contract layer. All interfaces shared between packages, apps, and services live here.
7. **The `@tprokash/validation` package** is the validation layer. All entity validation logic lives here, not spread across apps.

## Versioning Strategy

| Entity | Versioning Scheme | Scope |
|--------|------------------|-------|
| Monorepo releases | CalVer (YYYY.MINOR.PATCH) or SemVer | Whole-repo tagged releases |
| Shared packages | SemVer | Independent per package |
| API versions | SemVer (in URL path: /v1/, /v2/) | Public contract |
| Database schema | SemVer (via schema_version table) | Schema migrations |
| Datasets | SemVer (MAJOR.MINOR.PATCH) | Data releases |

**Release tags:** `v0.2.0`, `@tprokash/ui@1.0.0`, `db-v1.0.0`

## Development Workflow

1. **Branch from `main`.** Feature branches use `feat/`, fixes use `fix/`, chores use `chore/`.
2. **Run local checks before pushing.** `pnpm lint && pnpm typecheck && pnpm test` must pass.
3. **Open a pull request.** PRs must be reviewed by at least one owner of each affected directory.
4. **CI runs on every PR.** Lint, typecheck, test, build.
5. **Merge to `main`.** Squash merge with conventional commit message.
6. **Deploy from `main`.** Release branches used only for hotfixes.

## Build Strategy

- **All packages are compiled by `tsc`** or `tsup` for library bundles.
- **Apps are built by their framework** (Next.js for web/admin, Hono/Fastify for API).
- **Services are built as standalone Node.js bundles** (esbuild).
- **Build order** is determined by the dependency graph (handled by Turborepo).
- **Output goes to `dist/`** inside each package/app/service (gitignored).
- **All artifacts are produced by CI**, never committed.

## Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit tests | Vitest | Individual functions, utilities, validators |
| Integration tests | Vitest | Database queries, API endpoints (with test DB) |
| Component tests | Vitest + Testing Library | UI components in isolation |
| E2E tests | Playwright | Critical user journeys across the full stack |
| Contract tests | Zod schema validation | API request/response against schemas |

**Rules:**
- Tests live alongside the code they test (`*.test.ts` files).
- Every package must have at least 80% line coverage.
- Database integration tests use a test-specific SQLite database.
- E2E tests run against a staging environment, not local dev.

## Release Strategy

1. **Pre-release (alpha/beta/rc).** Published from feature branches for early testing.
2. **Release candidate.** Branch from `main`, deploy to staging, run full E2E suite.
3. **Stable release.** Tag on `main` with release notes in GitHub Releases.
4. **Hotfix.** Branch from the release tag, fix, merge back to `main` and tag a patch.
5. **Dataset releases.** Independent of code releases. Tagged and published from `data/` pipelines.

**Release artifacts:**
- GitHub Release with changelog
- Docker images for all apps and services (tagged with release version)
- npm packages for `@tprokash/sdk` (published to npm registry)
- Dataset packages in `data/datasets/` (committed to repo)
