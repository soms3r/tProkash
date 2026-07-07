---
title: Publisher Module Architecture
status: Draft
number: RFC-0004
version: 0.2
authors:
  - tbd
created: 2026-07-06
updated: 2026-07-06
---

# RFC-0004: Publisher Module Architecture

## 1. Vision

A **Publisher** inside tProkash is any identity — legal or not — that
produces, distributes, or makes available creative, academic, or
informational works. A Publisher may be a company, government agency,
university press, NGO, self-publishing individual, imprint, publishing
program, department, or any other entity that acts as a publishing
identity.

A Publisher is **not** always a legal organization. The domain model
must never assume that a Publisher owns or embeds legal identity.
Instead:

- **Publisher** is the publishing identity.
- **Organization** is a separate, future domain entity that represents
  a legal person.

A Publisher may:
- belong to an Organization
- be operated by an Organization
- be managed by an Organization
- be owned by an Organization
- stand alone with no Organization at all

The Organization domain is not defined in this RFC. It is referenced
only to establish the boundary. A future RFC will define the
Organization model.

The Publisher module is the blueprint for all domain modules that
follow (Author, Book, Editor, Printer, Distributor, Bookstore, Library,
Dataset, Source, Organization, etc.). Every architectural decision made
here is expected to be reused.

## 2. Goals

- Define the Publisher domain model using the existing identity, domain
  contracts, and lifecycle frameworks.
- Separate the concept of Publisher (publishing identity) from
  Organization (legal entity), ensuring the model does not assume legal
  identity ownership.
- Support imprints, publishing programs, and hierarchical publisher
  relationships.
- Support multi-country operations, multiple languages, and
  internationalization from the start.
- Establish a consistent pattern for entity types, relationships, and
  public/private data boundaries that all future modules will follow.
- Specify verification and trust levels that enable progressive
  engagement (anonymous → verified → accredited → trusted).
- Define import, export, search, and API resource shapes without
  committing to implementation details.
- Ensure the design accommodates all known publisher types without
  special-casing any of them.

## 3. Non-Goals

- Implement controllers, services, repositories, or database schema.
- Define REST endpoints or GraphQL resolvers.
- Create validation logic, migration files, or seed data.
- Build UI components or admin panels.
- Implement authentication or authorization guards.
- Define event handlers or integration with external systems.
- Support multi-tenancy or organization hierarchies within a publisher.
- Define specific database indexes or query optimization strategies.
- Implement the Organization domain (deferred to a future RFC).
- Implement the Address framework (deferred to a future RFC).
- Implement the Contact framework (deferred to a future RFC).

## 4. Actors

| Actor | Description |
|-------|-------------|
| **Publisher** | The publishing identity itself, represented in the system by an authenticated account or agent that acts on its behalf. |
| **Administrator** | Manages publisher accounts, handles disputes, and oversees the verification/accreditation process. |
| **Contributor** | A user who submits or updates publisher data (e.g., an editor adding metadata). |
| **Verifier** | A trusted role that reviews documentation and advances a publisher through trust levels. |
| **Visitor** | An unauthenticated consumer of public publisher profiles and catalog data. |
| **API Consumer** | An external system or service that reads publisher data via the API. |

## 5. Publisher Types

| Type | Description |
|------|-------------|
| **Commercial** | For-profit publishing house. |
| **University** | University press or academic institution publisher. |
| **Government** | Official government publishing agency. |
| **NGO** | Non-governmental organisation publisher. |
| **Self Publishing** | Individual author-publisher. |
| **Digital First** | Born-digital publisher with no print legacy. |
| **Independent** | Small to medium independent publisher. |
| **Magazine** | Periodical magazine publisher. |
| **Journal** | Academic or trade journal publisher. |
| **Newspaper** | Daily or weekly newspaper publisher. |
| **Printing Press** | Service-oriented printer that also publishes. |
| **Children Publisher** | Specialises in children's literature. |
| **Educational Publisher** | Specialises in textbooks and educational materials. |
| **Academic Publisher** | Scholarly books, monographs, and journals. |
| **Religious Publisher** | Faith-based or denominational publisher. |
| **International** | Multi-national or multi-language publisher. |
| **Other** | Any type not covered by the above list. |

These types are represented as an extensible string union. They inform
verification requirements, metadata schema, and search filters but do
not drive separate database tables or service classes. A publisher may
declare multiple types.

## 6. Publisher Lifecycle

The Publisher lifecycle reuses the **Lifecycle Framework** from
`@tprokash/types/src/lifecycle/`. The base states provided by the
framework are extended with publisher-specific states.

### Framework Base States

```
DRAFT → IMPORTED → PENDING_REVIEW → PENDING_VERIFICATION → VERIFIED
    → PUBLISHED → SUSPENDED → ARCHIVED → DELETED
```

### Publisher-Specific States

**Trust-level states** (custom, layered on top of base lifecycle):

```
VERIFIED
    ↓
ACCREDITED
    ↓
TRUSTED
```

These three states represent increasing levels of verification. A
publisher progresses through them by submitting evidence, being reviewed
by a Verifier, and accumulating a track record.

- **VERIFIED** — Basic identity confirmed. Documents checked.
- **ACCREDITED** — Business credentials validated. Operational history
  reviewed.
- **TRUSTED** — Long-standing positive track record. Reduced oversight.

### Transition Map

```
 DRAFT ──────────────────────────────────────────┐
   │                                              │
   ▼                                              │
 IMPORTED ──► PENDING_REVIEW                      │
   │                                              │
   ▼                                              │
 PENDING_VERIFICATION                             │
   │                                              │
   ▼                                              │
 VERIFIED ──► ACCREDITED ──► TRUSTED              │
   │                                              │
   ▼                                              │
 PUBLISHED ◄──────────────────────────────────────┘
   │
   ├──► SUSPENDED ──► VERIFIED  (re-entry after remediation)
   ├──► ARCHIVED
   └──► DELETED
```

A publisher cannot skip trust levels (must go VERIFIED → ACCREDITED →
TRUSTED sequentially).

### Transition Reasons

The framework's `TransitionReasonType` is reused. In addition, the
following publisher-specific reasons are defined:

- `ACCREDITATION_GRANTED`
- `ACCREDITATION_REVOKED`
- `TRUST_LEVEL_EARNED`
- `TRUST_LEVEL_EXPIRED`
- `DOCUMENTATION_SUBMITTED`
- `DOCUMENTATION_REJECTED`
- `MANUAL_REVIEW_PASSED`
- `MANUAL_REVIEW_FAILED`

### Allowed Transitions

Each from→to pair is explicitly listed (as required by the framework).
Any unlisted pair is automatically forbidden.

## 7. Identity

Publishers reuse `GenericIdentifier` from the identity framework. Each
identifier is an instance of `GenericIdentifier` with an
`IdentifierType`, `VerificationStatus`, and optional `Ownership` and
`AuditMetadata`.

### Required Identifiers

| Identifier | Type | Purpose | Verification |
|------------|------|---------|-------------|
| **UUID** | `UUID` | Internal system identifier. Auto-generated. | Always verified (system). Primary. |
| **Slug** | `SLUG` | Human-readable URL-safe name. Globally unique. | Always verified (system). |
| **Registration** | `REGISTRATION` | Official registration or business ID. | Requires document check. |
| **BIN** | `BIN` | Business Identification Number (tax ID, company number). | Requires document check. |
| **TIN** | `TIN` | Taxpayer Identification Number. | Requires document check. |
| **ISBN Prefix** | `ISBN_PREFIX` | Registered ISBN publisher prefix. | Requires external registry check. |
| **Website** | `WEBSITE` | Official publisher website URL. | Verified via domain ownership check. |
| **Phone** | `PHONE` | Official contact phone number. | Verified via SMS or call-back. |
| **Email** | `EMAIL` | Official contact email address. | Verified via email confirmation. |

Exactly one identifier must be marked as primary (the UUID). Multiple
identifiers of the same type are allowed (e.g., multiple email addresses,
multiple ISBN prefixes), but only one can be primary per type when the
type designates a single-primary constraint.

### Multiple ISBN Prefixes

A publisher may own **0..N ISBN prefixes**. Each ISBN prefix is a
separate identifier record and must support:

- **Verification** — confirmed against the official ISBN agency registry
- **Issuer** — the agency that issued the prefix (e.g., ISBN Agency,
  Bowker)
- **Effective Date** — when the prefix became active
- **Status** — active, expired, revoked, transferred

### Historical Identity

Publisher identity history must never be lost. The following are
supported as historical identity records:

- Former Name
- Former Legal Name
- Former Website
- Former Logo
- Former Slug
- Former ISBN Prefix
- Alias
- Trade Name (doing-business-as)
- Native Name (in the publisher's native script)
- Romanized Name (transliteration)
- English Name

Historical records are immutable. They are appended, never overwritten.
Each historical record carries the effective period (from, until) and
an audit trail.

## 8. Imprint Architecture

A Publisher may operate one or more **imprints**. Imprints are publishing
identities, not legal entities. They represent sub-brands, series, or
publishing programs under a parent publisher.

### Imprint Types

| Type | Description |
|------|-------------|
| **Parent Publisher** | The top-level publishing identity. May own multiple imprints. |
| **Child Publisher** | A publisher that operates under a parent. A child may have its own imprints. |
| **Imprint** | A brand or sub-brand of a publisher. Not a legal entity. |
| **Publishing Label** | A named label used for a specific category or genre. |
| **Series Imprint** | An imprint limited to a specific series of works (e.g., Penguin Classics). |

### Hierarchy Examples

```
Penguin Random House (Parent Publisher)
    ├── Penguin (Imprint)
    │   ├── Puffin (Imprint)
    │   ├── Ladybird (Imprint)
    │   └── Allen Lane (Imprint)
    ├── Viking (Imprint)
    ├── Vintage (Imprint)
    └── Cornerstone (Imprint)
```

### Relationship Model (Future)

An imprint is a Publisher that declares a parent relationship. The model
supports:

- Imprint has a parent Publisher (0..1, optional — a publisher may be
  independent with no parent)
- Parent Publisher has many child imprints (0..N)
- An imprint may have its own imprints (recursive, unbounded depth)

This is stored as a self-referential relationship on the Publisher
entity. Implementation details are deferred.

## 9. Multi-country Operations

A Publisher may operate in multiple countries. The model supports
per-country metadata without assuming a single headquarters.

### Concepts

| Concept | Description |
|---------|-------------|
| **Regional Office** | A physical or registered office in a specific country. |
| **Country** | A country where the publisher operates. |
| **Region** | A region within a country (e.g., state, province, emirate). |
| **Languages** | The languages in which the publisher operates in that country. |
| **Local Contacts** | Contact points specific to that country. |
| **Local Website** | A country-specific website URL. |
| **Local Currency** | The currency used for transactions in that country. |
| **Tax Jurisdiction** | The tax authority and registration for that country. |
| **Operational Status** | Whether the publisher is actively operating in that country. |

A publisher may have zero or more country records. The primary country
is the one designated as the main operating country. No country record
is required for publishers that operate exclusively online with no
country-specific presence.

## 10. Languages

A Publisher must declare the languages it publishes in. These become
searchable metadata and drive catalog visibility.

Examples: Bangla, English, Arabic, Japanese, Hindi, French, Spanish,
German, Portuguese, Russian, Chinese, Urdu, etc.

- A publisher may declare 1..N languages.
- At least one language is required.
- The language list is extensible and references a standard language
  taxonomy (BCP-47 or equivalent).
- Languages are part of the Public Profile.

## 11. Subject Specialization

A Publisher must support a subject taxonomy that describes the topics
and genres it publishes.

Examples: Medical, Engineering, Law, Children, Poetry, Religion, History,
Science, Fiction, Comics, Education, Reference, Art, Music, Philosophy,
Politics, Travel, Cooking, Sports, Technology, Business, etc.

- The subject taxonomy is **extensible** — not hardcoded.
- A publisher may declare 0..N subjects.
- Subjects are searchable metadata and part of the Public Profile.
- The taxonomy should support hierarchical subjects (e.g., Science →
  Physics → Quantum Mechanics).

## 12. Historical Identity

See Section 7 (Identity) for historical identity records. This section
documents the architectural principles.

- Historical records are **append-only** and **immutable**.
- When a publisher changes its name, slug, logo, or any identity
  attribute, the previous value is preserved as a historical record.
- A publisher may have aliases and trade names that coexist with the
  current identity.
- Historical records carry the effective date range (from, until).
- The audit system records who made the change and when.
- No identity history is ever deleted or overwritten.

## 13. Publishing Formats

A Publisher must declare the formats it publishes in.

| Format | Description |
|--------|-------------|
| **Print** | Physical books (paperback, hardcover). |
| **eBook** | Digital books (EPUB, PDF, Kindle). |
| **Audiobook** | Audio narration formats. |
| **Braille** | Braille editions. |
| **Large Print** | Large-print editions. |
| **Interactive** | Interactive digital publications. |
| **Open Access** | Freely accessible digital works. |
| **Digital First** | Born-digital, may or may not have a print edition. |

- A publisher may declare 0..N formats.
- Formats are part of the Public Profile.
- The format list is extensible.

## 14. Geographic Metadata

In addition to multi-country operations (Section 9), the publisher
profile includes the following geographic metadata:

- **Countries Served** — Countries where the publisher distributes or
  operates.
- **Regions Served** — Sub-national regions.
- **Primary Timezone** — The publisher's primary timezone.
- **Primary Country** — The main country of operation.
- **Operating Regions** — Grouped regions (e.g., "European Union",
  "Southeast Asia").

This metadata does not assume a single office or headquarters.

## 15. Website Model

A Publisher may have **multiple websites**. Each website is a separate
identifier record (see Section 7) with the following metadata:

| Field | Description |
|-------|-------------|
| **URL** | The website URL. |
| **Primary** | Whether this is the main website. |
| **Verified** | Whether ownership has been confirmed. |
| **Ownership Verification** | How ownership was verified (DNS record, meta tag, file upload, etc.). |
| **Verification Method** | The specific method used. |
| **Verification Date** | When verification was last completed. |
| **Expiration** | When verification expires (if applicable). |
| **Last Checked** | When the URL was last checked for availability. |
| **Status** | Active, inactive, pending verification, failed verification. |

Exactly one website may be primary. Multiple websites are allowed.

## 16. Contact Model

Contacts are people or departments associated with the publisher. Each
contact supports a typed role.

### Contact Types

| Type | Description |
|------|-------------|
| **General** | General inquiry contact. |
| **Editorial** | Editorial department contact. |
| **Sales** | Sales and distribution contact. |
| **Rights** | Rights and permissions contact. |
| **Support** | Technical or customer support. |
| **Legal** | Legal department contact. |
| **Accounting** | Billing and accounting contact. |
| **Media** | Press and media relations contact. |
| **Emergency** | Emergency contact person. |

- A publisher may have 0..N contacts per type.
- Contacts are **private data** (see Section 20).
- The Contact framework is deferred to a future RFC. This section
  defines the requirements only.

## 17. Social Media Model

A Publisher may have multiple social media accounts. Each account
supports:

| Field | Description |
|-------|-------------|
| **Platform** | The social media platform (Twitter, Facebook, Instagram, LinkedIn, YouTube, etc.). |
| **URL** | The profile URL on the platform. |
| **Username** | The account username. |
| **Verified** | Whether the account is verified on the platform. |
| **Primary** | Whether this is the primary social account for the publisher. |
| **Visibility** | Public or private (see Public Profile). |
| **Last Checked** | When the account was last checked for availability. |
| **Status** | Active, inactive, suspended, not found. |

- Social media accounts are part of the Public Profile by default.
- The platform list is extensible.

## 18. Relationships

```
Publisher
    │
    ├── 1:N  Books            — works published by this publisher
    ├── N:M  Authors           — authors contracted or published
    ├── N:M  Editors           — editors who curate the publisher's catalog
    ├── 1:N  Printers          — printing partners
    ├── 1:N  Distributors      — distribution channels
    ├── N:M  Bookstores        — retail partners
    ├── N:M  Awards            — awards won or granted
    ├── N:M  Events            — book fairs, launches, signings
    ├── 1:N  Addresses         — physical addresses (HQ, warehouses, etc.)
    ├── 1:N  Contacts          — typed contacts (Editorial, Sales, etc.)
    ├── 1:N  Social Accounts   — social media profiles with metadata
    ├── 1:N  Websites          — multiple websites with verification data
    ├── N:M  Datasets          — data contributions
    ├── N:M  Sources           — upstream data sources
    ├── 1:N  Imprints          — child imprints under this publisher
    ├── 0..1 Parent Publisher  — imprints point to their parent
    ├── N:M  Organizations     — future: legal entities linked to publisher
    ├── 1:N  Country Records   — multi-country operation records
    └── N:M  Languages         — publishing languages
```

Relationships follow the domain contracts pattern: each is modelled as a
separate entity or a value object depending on ownership semantics.

- Owned (1:N) relationships are embedded or referenced via foreign key.
- Shared (N:M) relationships use a separate join entity.

## 19. Public Profile

The following publisher data is visible to all actors, including
**Visitors**:

- Name (current, native, romanized, English)
- Slug
- Tagline, description
- Publisher type(s)
- Founded year
- Operating status (active / inactive)
- Mission statement
- Imprints (list)
- Parent publisher (if any)
- Languages
- Countries served, regions served
- Subject areas
- Logo, cover/banner image
- Publishing formats
- Website URLs (public ones)
- Social media links (public ones)
- Public contact method (configurable)
- Accessibility support statement
- List of published works (Books)
- Current trust level (VERIFIED / ACCREDITED / TRUSTED)
- Awards, events (public ones)
- Certifications
- Public statistics (number of works published, etc.)
- Address (country, city only — full street address is private)
- Active status (whether the publisher is currently publishing)
- Publisher size (small, medium, large, enterprise — self-declared)

## 20. Private Data

The following publisher data is never exposed through public APIs:

- Full street address (street name, building, suite)
- Phone number(s)
- Email address(es)
- BIN, TIN, Registration ID
- ISBN Prefix (internal use only)
- Internal notes and flags
- Verification and accreditation documentation
- Verification evidence (documents, hashes)
- Audit history (who changed what and when)
- Financial or contractual information
- Contact persons (names, roles, contact details)
- Suspension, archival, or deletion reasons
- Historical identity records (past names, slugs — stored but not
  publicly enumerated)
- Country-specific operational details (tax registrations, local
  contacts, local currency)
- Verification confidence scores and review notes

Private data is accessible only to **Administrator**, **Verifier**, and
the **Publisher** account itself (via authenticated endpoints).

## 21. Verification Rules & Metadata

Verification follows a tiered trust model. Each level requires
increasingly stringent evidence.

### Trust Levels

| Level | Requirements | Validated By |
|-------|-------------|-------------|
| **VERIFIED** | Email + Phone confirmed. Official website owned. Registration or BIN submitted and checked. | Verifier (document review) + automated checks |
| **ACCREDITED** | All VERIFIED requirements, plus: TIN, business licence, proof of operational history (>1 year), at least one published work referenced. | Verifier (document review + external cross-check) |
| **TRUSTED** | All ACCREDITED requirements, plus: 3+ years on platform, no compliance incidents, community endorsements from 2 existing TRUSTED publishers. | Verifier panel review |

### Verification Metadata

Each verification event records:

| Field | Description |
|-------|-------------|
| **Verifier** | The actor who performed the verification. |
| **Evidence** | Reference or pointer to the evidence provided. |
| **Evidence Hash** | Cryptographic hash of the evidence document. |
| **Verification Method** | How verification was performed (document review, automated check, external cross-reference, etc.). |
| **Confidence Score** | A score indicating confidence in the verification (0.0 – 1.0). |
| **Expiration Date** | When this verification expires and must be renewed. |
| **Review Date** | When the verification was last reviewed. |
| **Review Notes** | Notes from the verifier. |
| **Status** | Pending, approved, rejected, expired, revoked. |
| **Verification History** | Full history of all verification events for this publisher. |

**Verification history is never overwritten.** Each verification event
is appended as an immutable record.

### Notes

- A publisher enters at VERIFIED level. New publishers cannot skip to
  ACCREDITED or TRUSTED.
- Trust levels can be revoked (SUSPENDED) if a publisher fails to
  maintain requirements.
- Automated checks run periodically to verify website, email, and phone
  status. If any fail, the publisher is flagged for re-verification.

## 22. Merge Strategy

Publisher merge is supported when two publishing identities are
consolidated.

### Concepts

| Concept | Description |
|---------|-------------|
| **Merged Into** | The surviving publisher that absorbs the target. |
| **Merged From** | The publisher that is absorbed and becomes inactive. |

### Rules

- No history is lost. The merged-from publisher's identity, lifecycle
  history, verification history, and relationships are preserved.
- **Identity Preservation** — All identifiers of the merged-from
  publisher are retained as historical records linked to the
  merged-into publisher.
- **Relationship Migration** — Books, authors, editors, and other
  relationships of the merged-from publisher are reassigned to the
  merged-into publisher. The original relationship audit trail is
  preserved.
- **Redirect Strategy** — The merged-from publisher's slug and URLs
  redirect to the merged-into publisher. Redirects are permanent (301).
- **Lifecycle** — The merged-from publisher transitions to a MERGED
  state (a new base lifecycle state). The merged-into publisher's
  lifecycle is unaffected.
- **Reversal** — Merges are not reversible by default. A manual
  Administrator action is required to undo.
- **Audit** — Every merge creates an audit record listing both
  publishers, the actor, the timestamp, and the scope of migration.

## 23. Global Slug Policy

**Decision: Slugs are globally unique.**

A slug identifies a publisher uniquely across the entire platform,
regardless of publisher type. A Commercial publisher and a
Self-publishing entity cannot share the same slug.

### Rationale

- Simpler routing: no type-scoped namespaces.
- Cleaner URL design: `/publishers/{slug}` without type prefix.
- Prevents confusion when a visitor searches by slug.
- Avoids namespace collisions in cross-type references.

### Implementation Notes

- Slug uniqueness is enforced at the domain level.
- Slug generation follows the `SlugOptions` / `SlugValidation` patterns
  from the identity framework.
- Abandoned publishers release their slug after a configurable cool-down
  period (see Security Considerations).
- Slug changes are tracked as historical identity records.

## 24. Internationalization

Publishers operate across languages and scripts. The model must be
Unicode-first and support multiple localized representations.

### Multi-lingual Names

A publisher name may be represented in multiple forms:

- **Native Script** — The name in the publisher's native writing system
  (e.g., Bengali script, Arabic script, Devanagari).
- **Romanized** — Transliteration into Latin script.
- **English** — An English-language version of the name (may differ from
  romanization).
- **Aliases** — Additional names, trade names, or alternative spellings.

### Principles

- All name fields accept full Unicode (UTF-8).
- At least one name is required. Multiple names are allowed.
- A primary name is designated for display purposes.
- The slug is derived from the primary name but may be customised.
- Search indexes all name variants for full-text discovery.
- No script or language is treated as default or preferred at the
  architecture level.

## 25. Search Requirements

Search must support:

- **Full-text search** across name (all variants), tagline, description,
  slug, and imprint names.
- **Filter by publisher type** (one or more types).
- **Filter by trust level** (VERIFIED / ACCREDITED / TRUSTED).
- **Filter by active status** (currently publishing / inactive / all).
- **Filter by country or region.**
- **Filter by language** (one or more publishing languages).
- **Filter by subject** (one or more subject taxonomy terms).
- **Filter by imprint** (publishers with child imprints or specific
  imprint names).
- **Filter by organization** (publishers linked to a specific
  organization).
- **Filter by publisher size** (small, medium, large, enterprise).
- **Filter by publishing format** (print, ebook, audiobook, etc.).
- **Filter by founded year** or year range.
- **Filter by operating status** (active, inactive, all).
- **Sort by name, date added, trust level, number of published works,
  founded year.**
- **Geo-search** (publishers near a location) — optional, future.
- **Faceted counts** for publisher type, trust level, country, language,
  subject, format, and publisher size.
- **Autocomplete** on publisher name and slug.

Search results return the **Public Profile** shape only. Private data is
never indexed or returned.

## 26. Import Requirements

Import supports batch ingestion of publisher records from external
sources.

- **Format**: JSON, CSV, XML.
- **Fields**: All public profile fields plus optional private fields
  (email, phone, address). Private fields are stored but not exposed.
- **Validation**: Each record is validated against the domain schema.
  Invalid records are collected in an error report; valid records are
  imported.
- **Duplicate detection**: Matched on UUID (if provided), slug, ISBN
  Prefix, Registration ID, or BIN. Duplicates are flagged, not imported.
- **Identifier creation**: Missing UUIDs are auto-generated. Missing
  slugs are generated from the name.
- **Trust level**: Imported publishers start at DRAFT, not VERIFIED.
  An explicit verification step is required.
- **Audit trail**: Every import batch creates an audit record with
  source, timestamp, record count, and error report.

## 27. Export Requirements

Export supports full or filtered publisher data for external use.

- **Format**: JSON, CSV, XML.
- **Scope**:
  - Public export — Public Profile only. Available to all.
  - Full export — Includes private data. Available to Administrators
    and the publisher itself.
- **Filtering**: Same filters as Search.
- **Pagination**: Large exports use cursor-based pagination.
- **Rate limiting**: Exports are rate-limited per API Consumer.
- **Consistency**: Exports are point-in-time snapshots. Long-running
  exports may use a consistent snapshot (repeatable read).

## 28. API Resources

The following API resource shapes are defined. Actual endpoints will be
designed in a subsequent implementation RFC.

### Publisher

```jsonc
{
  "id": "uuid",
  "slug": "string",
  "type": "PublisherType | PublisherType[]",
  "name": "string",
  "nativeName": "string?",
  "romanizedName": "string?",
  "englishName": "string?",
  "aliases": ["string"],
  "tagline": "string?",
  "description": "string?",
  "mission": "string?",
  "foundedYear": "number?",
  "publisherSize": "string?",
  "logo": "url?",
  "coverImage": "url?",
  "languages": ["string"],
  "subjects": ["string"],
  "formats": ["PublishingFormat"],
  "countriesServed": ["string"],
  "regionsServed": ["string"],
  "primaryCountry": "string?",
  "primaryTimezone": "string?",
  "parentPublisher": "PublisherSummary?",
  "imprints": ["PublisherSummary"],
  "websites": ["WebsiteMetadata"],
  "socialAccounts": ["SocialAccount"],
  "publicContact": "string?",
  "trustLevel": "VERIFIED | ACCREDITED | TRUSTED",
  "active": "boolean",
  "identifiers": ["GenericIdentifier"],
  "addresses": ["Address (country, city only in public)"],
  "publishedWorks": ["BookSummary"],
  "awards": ["AwardSummary"],
  "events": ["EventSummary"],
  "lifecycle": "WorkflowStatus",
  "audit": "AuditMetadata"
}
```

### PublisherSummary

```jsonc
{
  "id": "uuid",
  "slug": "string",
  "name": "string",
  "type": "PublisherType | PublisherType[]",
  "trustLevel": "VERIFIED | ACCREDITED | TRUSTED",
  "active": "boolean",
  "logo": "url?",
  "languages": ["string"],
  "primaryCountry": "string?"
}
```

### PublisherCreate (input)

```jsonc
{
  "type": "PublisherType | PublisherType[]",
  "name": "string",
  "nativeName": "string?",
  "romanizedName": "string?",
  "englishName": "string?",
  "aliases": ["string?"],
  "tagline": "string?",
  "description": "string?",
  "mission": "string?",
  "foundedYear": "number?",
  "publisherSize": "string?",
  "languages": ["string"],
  "subjects": ["string?"],
  "formats": ["PublishingFormat?"],
  "primaryCountry": "string?",
  "parentPublisherId": "uuid?",
  "websites": ["WebsiteInput"],
  "identifiers": ["IdentifierInput"],
  "addresses": ["AddressInput"],
  "contacts": ["ContactInput"],
  "socialAccounts": ["SocialAccountInput"]
}
```

### IdentifierInput

```jsonc
{
  "type": "EMAIL | PHONE | WEBSITE | REGISTRATION | BIN | TIN | ISBN_PREFIX",
  "value": "string",
  "primary": "boolean?"
}
```

### WebsiteMetadata

```jsonc
{
  "url": "string",
  "primary": "boolean",
  "verified": "boolean",
  "verificationMethod": "string?",
  "verificationDate": "datetime?",
  "status": "string"
}
```

### WebsiteInput

```jsonc
{
  "url": "string",
  "primary": "boolean?"
}
```

### SocialAccount

```jsonc
{
  "platform": "string",
  "url": "string",
  "username": "string?",
  "verified": "boolean",
  "primary": "boolean",
  "visibility": "PUBLIC | PRIVATE",
  "status": "string"
}
```

### SocialAccountInput

```jsonc
{
  "platform": "string",
  "url": "string",
  "username": "string?",
  "primary": "boolean?"
}
```

## 29. Permissions

| Action | Visitor | Contributor | Publisher | Verifier | Administrator |
|--------|---------|-------------|-----------|----------|---------------|
| View public profile | ✅ | ✅ | ✅ | ✅ | ✅ |
| Search publishers | ✅ | ✅ | ✅ | ✅ | ✅ |
| Export public data | ✅ | ✅ | ✅ | ✅ | ✅ |
| View own private data | ❌ | ❌ | ✅ | ✅ | ✅ |
| Create publisher | ❌ | ✅ | ❌ | ❌ | ✅ |
| Update own profile | ❌ | ❌ | ✅ | ❌ | ❌ |
| Update any publisher | ❌ | ❌ | ❌ | ✅ | ✅ |
| Verify publisher | ❌ | ❌ | ❌ | ✅ | ✅ |
| Accredit publisher | ❌ | ❌ | ❌ | ✅ | ✅ |
| Suspend/archive/delete | ❌ | ❌ | ❌ | ❌ | ✅ |
| View audit history | ❌ | ❌ | ✅ (own) | ✅ | ✅ |
| Export full data | ❌ | ❌ | ✅ (own) | ✅ | ✅ |
| Import batch | ❌ | ❌ | ❌ | ❌ | ✅ |
| Merge publishers | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage imprints | ❌ | ❌ | ✅ (own) | ❌ | ✅ |

## 30. Security Considerations

- **Identifier verification** — BIN, TIN, and Registration documents must
  be stored securely and never served through public endpoints. Document
  storage should use encrypted blob storage with access logging.
- **Rate limiting** — All mutation endpoints are rate-limited per
  authenticated actor. Import and export operations have separate, lower
  rate limits.
- **Audit logging** — All state transitions, verification actions,
  permission changes, and merges are logged with actor, timestamp, and
  diff.
- **Data minimisation** — Private data is collected only when necessary
  for verification. The public profile must not leak private data through
  computed fields, error messages, or search indexes.
- **Export control** — Full data exports require explicit authorisation
  and are logged. Bulk export of private data by an Administrator should
  trigger an alert.
- **Slug squatting** — Slug uniqueness is enforced at the domain level.
  Abandoned publishers release their slug after a configurable cool-down
  period (recommended: 180 days).
- **Trust level abuse** — A publisher that loses TRUSTED status cannot
  re-apply for a configurable period. Automated re-verification checks
  run on a schedule to detect stale trust levels.
- **Verification evidence** — Evidence documents and hashes are stored
  immutably. Verification history is append-only.
- **Merge safety** — Merges are audited and require Administrator
  privileges. Reversal requires manual intervention.

## 31. Future Extensions

### Marketplace

A publisher marketplace where publishers can offer services (printing,
distribution, editing) to other publishers. Would require a new
service-catalog entity and discovery endpoints.

### Analytics

Publisher-facing dashboards showing readership, sales, geographic
distribution, and trend data. Private to the publisher.

### Reviews

Community and professional reviews of publishers. Would introduce a
Review entity linked to Publisher, with moderation and verification
rules.

### Claims

A structured claims workflow allowing publishers or their representatives
to claim ownership of a publisher profile.

Workflow:
1. **Claim** — A user submits a claim with evidence of affiliation or
   ownership (email domain, document upload, existing relationship).
2. **Evidence** — Supporting evidence is collected and stored immutably.
3. **Verification** — A Verifier reviews the evidence.
4. **Approval** — On approval, the claimant is granted Publisher-level
   access. The claim event is recorded in the publisher's audit history.
5. **Ownership Transfer** — If the claim involves transferring ownership
   from one actor to another, the previous owner is notified and given a
   dispute window.
6. **Audit** — Every step is logged.

Would introduce a Claim entity using the lifecycle framework, linked to
Publisher.

### Publishing Services

A service layer for publishers to request value-added services:
copyediting, typesetting, cover design, ISBN registration, etc. Would
introduce a ServiceRequest entity.

### Address Framework

A reusable Address entity (future RFC) supporting international address
formats, geocoding, and privacy controls. Referenced by Publisher and
all future domain modules.

### Contact Framework

A reusable Contact entity (future RFC) supporting typed contacts with
privacy controls, used by Publisher and all future domain modules.

## 32. Future RFC Dependencies

The following future RFCs are expected to depend on or extend the
Publisher module architecture defined here:

| RFC | Description |
|-----|-------------|
| **Organization Model** | Legal entity model that Publisher may reference. |
| **Address Framework** | Reusable international address entity. |
| **Contact Framework** | Reusable typed contact entity. |
| **Verification Framework** | Generic verification and evidence system. |
| **Relationship Framework** | Reusable entity relationship system. |
| **Search Framework** | Generic search, filter, and faceting system. |
| **Media Assets** | Image, document, and file management for logos, evidence, etc. |
| **Import Pipeline** | Generic batch import and validation pipeline. |
| **Internationalization** | Multi-lingual content and translation support. |
| **Claims** | Ownership claim and dispute resolution workflow. |
| **Marketplace** | Publisher service marketplace. |
| **Analytics** | Publisher-facing analytics and dashboards. |
| **Audit** | Centralised audit log and event sourcing. |
| **Identity Extensions** | Additional identifier types and verification methods. |

## 33. Open Questions

1. Should a publisher be able to have multiple trust levels simultaneously
   (e.g., VERIFIED in one country, ACCREDITED in another)? If so, how does
   the lifecycle model accommodate this?

2. How are publisher accounts linked to human user accounts? Is a Publisher
   a separate account type, or does every Publisher require a User as its
   agent?

3. Should import support incremental (delta) updates, or are imports always
   batch-replace operations?

4. What is the cool-down period for slug release after a publisher is
   archived? (Recommended: 180 days, but needs confirmation.)

5. Should the ISO publisher identifier (ISNI / GRID) be a standard
   identifier type alongside BIN and TIN?

6. How do we model publisher groups that are not simple parent-child
   hierarchies (e.g., a cooperative or consortium of independent
   publishers)?

7. What is the maximum depth of the imprint hierarchy before performance
   concerns arise?

8. Should subject taxonomy be flat or hierarchical? If hierarchical, what
   is the maximum depth?

## 34. Acceptance Criteria

- [ ] PublisherVision, Goals, and Non-Goals are documented and reviewed.
- [ ] All 6 **Actors** are defined with clear role descriptions.
- [ ] All 17 **Publisher Types** are listed and described.
- [ ] Publisher **lifecycle** reuses the existing Lifecycle Framework with
      VERIFIED → ACCREDITED → TRUSTED as custom states.
- [ ] Publisher **identity** reuses `GenericIdentifier` with the required
      9 identifier types, including support for 0..N ISBN prefixes with
      verification metadata.
- [ ] **Publisher is separated from Organization** — the document
      establishes that Publisher is a publishing identity, not a legal
      entity, and references Organization as a future domain.
- [ ] **Imprint Architecture** defines Parent Publisher, Child Publisher,
      Imprint, Publishing Label, and Series Imprint with hierarchy
      examples.
- [ ] **Multi-country Operations** defines Regional Office, Country,
      Region, Languages, Local Contacts, Local Website, Local Currency,
      Tax Jurisdiction, and Operational Status.
- [ ] **Languages** and **Subject Specialization** are declared as
      publisher metadata with extensible taxonomies.
- [ ] **Historical Identity** documents immutable, append-only identity
      history including former names, slugs, logos, and aliases.
- [ ] **Publishing Formats** lists 8 formats (Print, eBook, Audiobook,
      Braille, Large Print, Interactive, Open Access, Digital First).
- [ ] **Geographic Metadata** covers Countries Served, Regions Served,
      Primary Timezone, Primary Country, and Operating Regions.
- [ ] **Website Model** supports multiple websites with verification
      metadata (verified, method, date, expiration, status).
- [ ] **Contact Model** defines 9 typed contact roles.
- [ ] **Social Media Model** defines platform, URL, username, verified,
      primary, visibility, last checked, and status.
- [ ] All **relationships** (20+ relationship types) are listed with
      cardinality.
- [ ] **Public Profile** and **Private Data** boundaries are clearly
      separated with expanded fields.
- [ ] **Verification Rules & Metadata** define three trust levels with
      requirements, validation methods, verification metadata
      (verifier, evidence, evidence hash, method, confidence score,
      expiration, review, notes, status, history).
- [ ] **Merge Strategy** documents Merged Into, Merged From, Redirect
      Strategy, Identity Preservation, Historical Preservation, and
      Relationship Migration.
- [ ] **Global Slug Policy** resolves slug uniqueness (globally unique,
      per-publisher-type rejected), with rationale.
- [ ] **Internationalization** supports Native Script, Romanized,
      English, and Aliases with Unicode-first principles.
- [ ] **Search**, **Import**, and **Export** requirements are specified
      with expanded searchable fields (languages, subjects, country,
      region, imprint, organization, publisher size, publishing formats,
      trust level, operating status, founded year).
- [ ] **API Resources** define Publisher, PublisherSummary,
      PublisherCreate, IdentifierInput, WebsiteMetadata, WebsiteInput,
      SocialAccount, and SocialAccountInput shapes with updated fields.
- [ ] **Permissions** are defined for all 6 actors across 15 actions.
- [ ] **Security Considerations** address identifier storage, rate
      limiting, audit logging, data minimisation, export control, slug
      squatting, trust level abuse, verification evidence, and merge
      safety.
- [ ] **Future Extensions** (Marketplace, Analytics, Reviews, Claims,
      Publishing Services, Address Framework, Contact Framework) are
      identified.
- [ ] **Future RFC Dependencies** lists 14 dependent RFCs.
- [ ] **Open Questions** are documented and awaiting resolution before
      implementation begins. Previous questions 2 (merges) and 3 (slug
      scope) are resolved and removed.
