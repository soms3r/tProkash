# Roadmap — tProkash v0.2

## Overview

Version 0.2 transforms the approved database architecture into the first working product: a read-only public directory of Bangladeshi publishers, books, and authors with search, profiles, datasets, and an API.

**Release target:** Q4 2026

---

## Sprint 1: Product Blueprint (current sprint)

| Activity | Deliverables |
|----------|-------------|
| Product vision definition | `product/VISION.md` |
| MVP scope definition | `product/MVP.md` |
| Feature prioritization | `product/FEATURE_MATRIX.md` |
| User personas | `product/USER_PERSONAS.md` |
| User stories | `product/USER_STORIES.md` |
| Navigation specification | `product/NAVIGATION.md` |
| Search specification | `product/SEARCH_SPECIFICATION.md` |
| Public profile specification | `product/PUBLIC_PROFILE_SPEC.md` |
| Release roadmap | `product/ROADMAP_V0.2.md` |

**Acceptance criteria:** All product specification documents approved by stakeholders.

---

## Sprint 2: Data Population

| Activity | Deliverables |
|----------|-------------|
| Load 50+ publisher profiles | Populated `data/publishers/` with verified records |
| Load 200+ book records | Populated `data/books/` with verified records |
| Load 100+ author profiles | Populated `data/authors/` with verified records |
| Load lookup tables | Categories, languages, countries, roles |
| Data validation | All records pass JSON schema validation |
| Dataset packaging | First `publishers-v1` and `books-v1` datasets |

**Acceptance criteria:** Data directory contains validated, verified records meeting minimum counts. First datasets packaged and ready.

---

## Sprint 3: Frontend Foundation

| Activity | Deliverables |
|----------|-------------|
| Project scaffolding | Frontend framework, build tooling, linting, formatting |
| Design system | CSS/component foundation following responsive, accessible patterns |
| Home page | Stats hero, featured content, search bar |
| Publisher profile page | Full publisher profile per `PUBLIC_PROFILE_SPEC.md` |
| Book profile page | Full book profile per `PUBLIC_PROFILE_SPEC.md` |
| Author profile page | Full author profile per `PUBLIC_PROFILE_SPEC.md` |
| Search page | Search results with faceted filters and pagination |
| Bilingual display | Bengali/English toggle |
| About page | Static content page |
| 404 page | Custom error page |
| Navigation | Global header and footer |

**Acceptance criteria:** All public pages render with real data. Responsive and accessible.

---

## Sprint 4: API & Datasets

| Activity | Deliverables |
|----------|-------------|
| REST API v1 | Endpoints: GET /publishers, GET /publishers/{id}, GET /books, GET /books/{id}, GET /authors, GET /authors/{id}, GET /search |
| API versioning | /api/v1/ prefix |
| API documentation page | Endpoint reference, examples, rate limits |
| Dataset download page | Download UI for packaged datasets |
| Dataset files | JSON and CSV formats for each dataset type |
| Search API integration | Frontend search calls API |
| Autocomplete API | Type-ahead endpoint |
| Pagination | Cursor/offset pagination across all list endpoints |

**Acceptance criteria:** API returns correct data for all endpoints. Dataset downloads are functional. Search works end-to-end.

---

## Sprint 5: Polish & Launch

| Activity | Deliverables |
|----------|-------------|
| Performance optimization | Sub-second page loads, search under 3s |
| Mobile testing | Test on 320px-1920px viewports |
| Accessibility audit | WCAG 2.1 AA compliance |
| Error handling | All error states implemented (see NAVIGATION.md) |
| Edge case handling | Empty states, missing data, long text, special characters |
| SEO | Meta tags, sitemap, semantic HTML |
| Basic analytics | Page view and search query tracking |
| Beta release | v0.2.0-beta.1 |
| Bug fixes | Community feedback loop |
| **v0.2.0 release** | **First public release** |

**Acceptance criteria:** All pages pass accessibility audit. Load times meet targets. No critical or high-severity bugs.

---

## Post-v0.2 (v0.3+)

| Feature | Target |
|---------|--------|
| User accounts and registration | v0.3 |
| Data submission forms | v0.3 |
| Publisher claim workflow | v0.3 |
| Editor review dashboard | v0.3 |
| Advanced search | v0.3 |
| Bookstore directory | v0.4 |
| Printer directory | v0.4 |
| Distributor directory | v0.4 |
| Related books / recommendations | v0.4 |
| Reader reviews and ratings | v0.5 |
| Events and awards | v0.5 |
| Publishing workflow | v0.5+ |
| Marketplace / e-commerce | v1.0 |
| AI-powered enrichment | v1.0 |
