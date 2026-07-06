# API

Public REST API for tProkash — serves data to web, admin, and external consumers.

**Stack:** TypeScript, Node.js, Hono or Fastify

**Purpose:** Read-only and (future) write endpoints for all domain entities. Handles authentication, rate limiting, request validation.

**Depends on:** `@tprokash/types`, `@tprokash/validation`, `@tprokash/database`, `@tprokash/config`

**Serves:** `apps/web`, `apps/admin`, external API consumers
