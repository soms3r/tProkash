# RFCs (Request for Comments)

## Purpose

RFCs document significant architectural decisions, design proposals, and
structural changes to tProkash. They provide a permanent record of why and
how a change was made, ensuring that context survives individual memory
and verbal discussions.

## RFCs vs. GitHub Issues

| Aspect | RFCs | GitHub Issues |
|--------|------|---------------|
| Scope | Architectural, multi-package, or breaking changes | Bug fixes, small features, tasks |
| Format | Structured markdown document | Free-form description |
| Lifespan | Permanent design record | Closed after resolution |
| Audience | Current and future contributors | Current sprint team |
| Intent | Capture rationale and trade-offs | Track work items |

A rule of thumb: if a change touches more than one package, alters a public
API, or introduces a new framework concept, it needs an RFC. Everything
else goes in an Issue.

## RFC Lifecycle

```
Draft  →  Review  →  Accepted  →  Implemented
                              ↘  Superseded
```

- **Draft** — The RFC is being written. Not yet ready for feedback.
- **Review** — Open for discussion. Stakeholders review and comment.
- **Accepted** — Consensus reached. Implementation may begin.
- **Implemented** — The work is done and merged.
- **Superseded** — A newer RFC replaces this one. The original is kept for
  historical reference.

## Numbering Convention

RFCs are numbered sequentially: `RFC-0001`, `RFC-0002`, etc.

- The number is assigned when the RFC enters **Review** (not Draft).
- Numbers never repeat and never collide with Issue IDs.
- The registry file (`rfcs/registry.json`) maps each number to its current
  status and file path.
