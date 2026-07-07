---
title: Organization Framework
status: Draft
number: RFC-0005
version: 0.1
authors:
  - tbd
created: 2026-07-06
---

# RFC-0005: Organization Framework

## 1. Vision

An **Organization** inside tProkash is any legally recognised or
operationally distinct entity that participates in the publishing
ecosystem. Organizations are the legal and institutional backbone of the
platform: they own assets, enter contracts, employ people, hold
licences, and bear legal responsibility.

Organization is **not** Publisher. A Publisher is a publishing identity.
An Organization is a business, legal, or institutional entity. The two
are separate domains that reference each other.

Every entity that has a legal dimension — Publisher, Printer,
Distributor, Bookstore, Library, University, Government Agency, NGO —
references Organization rather than embedding legal fields directly.

This RFC defines the Organization framework as a shared, reusable
foundation. All future domain modules inherit from it.

## 2. Goals

- Define the Organization domain model as a reusable framework, not a
  module tied to any single business entity.
- Separate legal identity (Organization) from publishing identity
  (Publisher) and all other domain identities.
- Support the full range of organization types found in the publishing
  ecosystem without special-casing any of them.
- Provide a reusable identity, lifecycle, verification, and
  relationship foundation that every future module can reference.
- Define organization hierarchy (parent/subsidiary/branch) with
  unlimited depth and graph-based relationships.
- Support multi-jurisdiction legal registration, tax identifiers, and
  compliance metadata.
- Establish public/private data boundaries consistent with RFC-0004.
- Define merge, archival, dissolution, and restoration strategies.

## 3. Non-Goals

- Implement controllers, services, repositories, or database schema.
- Define REST endpoints or GraphQL resolvers.
- Create validation logic, migration files, or seed data.
- Build UI components or admin panels.
- Implement authentication or authorization guards.
- Define event handlers or integration with external systems.
- Implement the Address Framework (deferred to a future RFC).
- Implement the Contact Framework (deferred to a future RFC).
- Implement the Verification Framework (deferred to a future RFC).
- Define specific database indexes or query optimization strategies.
- Support real-time synchronization with external registries.

## 4. Organization Definition

An Organization is a legally recognised or operationally distinct entity
with the following characteristics:

- It has a legal existence or operational identity independent of the
  individuals who manage it.
- It can own assets, enter contracts, hold licences, and bear legal
  responsibility.
- It has a lifecycle independent of any single domain module (a
  Publisher may come and go; the Organization behind it persists).
- It may be referenced by multiple domain entities (e.g., a single
  University Organization may be linked to a University Press Publisher,
  a Library, and a Research Institute).

An Organization may or may not have employees, physical premises, or
registration in any particular jurisdiction. The model accommodates
informal organisations, community groups, and sole traders alongside
multinational corporations.

### Organization vs. Other Entities

| Entity | Relationship to Organization |
|--------|------------------------------|
| **Publisher** | A Publisher may belong to, be operated by, or be owned by an Organization. A Publisher is not an Organization. |
| **Printer** | A Printer references an Organization for its legal identity. |
| **Distributor** | A Distributor references an Organization for its legal identity. |
| **Bookstore** | A Bookstore references an Organization for its legal identity. |
| **Library** | A Library references an Organization for its legal identity. |
| **Author** | An Author may be an Organization (e.g., a writing collective) or a Person. |
| **Editor** | An Editor may be an Organization or a Person. |

## 5. Organization Types

| Type | Description |
|------|-------------|
| **Commercial Company** | For-profit business entity (LLC, corporation, partnership). |
| **Non Profit** | Non-profit organisation, charity, or foundation. |
| **Government** | Government agency, ministry, or department. |
| **University** | Higher education institution. |
| **School** | Primary or secondary education institution. |
| **Library** | Public, academic, or special library. |
| **Foundation** | Charitable or philanthropic foundation. |
| **Association** | Professional or trade association. |
| **Publisher Group** | Holding company or group that owns multiple publishers. |
| **Printing Company** | Commercial printing and manufacturing company. |
| **Distributor** | Wholesale or distribution company. |
| **Bookstore Chain** | Retail bookstore chain. |
| **Research Institute** | Research organisation (may or may not be part of a university). |
| **Media Company** | Broadcast, film, or digital media company. |
| **International Organization** | Intergovernmental or supranational organisation. |
| **Community Organization** | Local community group or cooperative. |
| **Religious Organization** | Faith-based organisation, church, mosque, temple. |
| **Other** | Any type not covered by the above list. |

Organization types are represented as an extensible string union. A
single organization may declare multiple types (e.g., a University that
also operates a Press). Types inform verification requirements and
search filters but do not drive separate tables or service classes.

## 6. Organization Identity

Organizations reuse `GenericIdentifier` from the identity framework.
Each identifier is an instance of `GenericIdentifier` with an
`IdentifierType`, `VerificationStatus`, and optional `Ownership` and
`AuditMetadata`.

### Supported Identifier Types

| Identifier | Type | Purpose | Verification |
|------------|------|---------|-------------|
| **UUID** | `UUID` | Internal system identifier. Auto-generated. | Always verified (system). Primary. |
| **Registration** | `REGISTRATION` | Official business or organisation registration number. | Requires document check. |
| **Tax ID** | `TAX_ID` | Tax registration number (country-specific). | Requires document check. |
| **BIN** | `BIN` | Business Identification Number. | Requires document check. |
| **TIN** | `TIN` | Taxpayer Identification Number. | Requires document check. |
| **Website** | `WEBSITE` | Official organisation website URL. | Verified via domain ownership check. |
| **Email** | `EMAIL` | Official organisation email domain. | Verified via email confirmation or DNS check. |
| **Phone** | `PHONE` | Official organisation phone number. | Verified via call-back. |
| **ISNI** | `ISNI` | International Standard Name Identifier. | Requires external registry check. |
| **GRID** | `GRID` | Global Research Identifier Database ID. | Requires external registry check. |
| **ROR** | `ROR` | Research Organization Registry ID. | Requires external registry check. |
| **DUNS** | `DUNS` | Dun & Bradstreet D-U-N-S Number. | Requires external registry check. |
| **LEI** | `LEI` | Legal Entity Identifier. | Requires external registry check. |
| **Custom** | `CUSTOM` | Extensible custom identifier type. | Configurable. |

### Identity Principles

- Multiple identifiers of the same type are allowed (e.g., multiple tax
  IDs for different jurisdictions).
- Exactly one identifier is primary (the UUID).
- Each identifier supports verification status, ownership metadata, and
  audit history.
- Custom identifier types are supported for jurisdiction-specific or
  industry-specific identifiers not covered by the standard types.
- Historical identifiers are immutable and append-only (see Section 12
  of RFC-0004 for the same pattern).

## 7. Organization Lifecycle

The Organization lifecycle reuses the **Lifecycle Framework** from
`@tprokash/types/src/lifecycle/`.

### Base States

```
DRAFT → IMPORTED → PENDING_REVIEW → PENDING_VERIFICATION → VERIFIED
    → ACTIVE → SUSPENDED → ARCHIVED → DISSOLVED → DELETED
```

### Organization-Specific States

- **ACTIVE** — The organisation is fully operational and verified.
- **DISSOLVED** — The organisation has been legally dissolved. No further
  operations are possible. Relationships are preserved for historical
  reference.
- **RESTORED** — A dissolved organisation has been legally reinstated.
  This is a transitional state that moves back to ACTIVE.

### Transition Map

```
 DRAFT ───────────────────────────────────┐
   │                                       │
   ▼                                       │
 IMPORTED ──► PENDING_REVIEW               │
   │                                       │
   ▼                                       │
 PENDING_VERIFICATION                      │
   │                                       │
   ▼                                       │
 VERIFIED ──► ACTIVE ◄─────────────────────┘
   │            │
   │            ├──► SUSPENDED ──► ACTIVE  (re-entry after remediation)
   │            ├──► ARCHIVED
   │            └──► DISSOLVED ──► RESTORED ──► ACTIVE
   │
   └──► DELETED (from DRAFT only)
```

### Archival

Archival is a soft-deactivation. An archived organization retains all
identifiers, relationships, and history. It is excluded from active
search results but can be reactivated. Archival is reversible.

### Dissolution

Dissolution is a legal termination. The organization's legal existence
has ended. Relationships are frozen (not deleted). Dissolution is
reversible only through a legal reinstatement (RESTORED → ACTIVE).

### Restoration

Restoration moves a DISSOLVED organization back to ACTIVE. All
identifiers and relationships are restored to their pre-dissolution
state. A restoration audit record is created.

### Transition Reasons

In addition to the framework's standard reasons:

- `DISSOLUTION_FILED`
- `DISSOLUTION_COMPLETED`
- `RESTORATION_GRANTED`
- `ARCHIVAL_REQUESTED`
- `ARCHIVAL_EXPIRED`
- `SUSPENSION_ISSUED`
- `SUSPENSION_LIFTED`

## 8. Organization Relationships

An Organization may have relationships with other Organizations and with
domain entities. The relationship model is graph-based, not tree-based,
supporting unlimited depth and complex structures.

### Relationship Types

| Type | Description | Cardinality |
|------|-------------|-------------|
| **Parent Organization** | The direct parent in an ownership or control hierarchy. | 0..1 per org |
| **Subsidiary** | A child organisation controlled by this org. | 0..N |
| **Division** | A semi-autonomous division within the org. | 0..N |
| **Department** | A department or unit within the org. | 0..N |
| **Branch** | A geographic or operational branch. | 0..N |
| **Office** | A registered or physical office location. | 0..N |
| **Affiliate** | A related organisation without direct ownership. | 0..N |
| **Partner** | A formal partnership organisation. | 0..N |
| **Member** | An organisation that is a member of this org (for associations, cooperatives). | 0..N |
| **Owner** | The organisation that owns this org. | 0..N |
| **Operator** | The organisation that operates this org on behalf of the owner. | 0..1 |
| **Sponsor** | A sponsoring organisation. | 0..N |
| **Funder** | A funding organisation. | 0..N |

### Design Principles

- Relationships are directional (from → to) with a relationship type.
- A relationship may have metadata: effective date, expiration date,
  status, and audit trail.
- Cycles are allowed (e.g., two organisations may be mutual affiliates).
- The model supports graph traversal: get all subsidiaries (recursive),
  get the ultimate parent, find all related organisations of a given
  type.
- No assumption is made about hierarchy depth or structure.

## 9. Organization Hierarchy

Organizations form hierarchies that are graphs, not trees. A subsidiary
may have multiple parents (e.g., a joint venture). A parent may have
multiple subsidiaries at arbitrary depth.

### Principles

- **Unlimited Depth** — No hard limit on the number of levels in a
  hierarchy.
- **Graph Relationships** — An organisation may have multiple parents,
  and a parent may appear at multiple levels through different paths.
- **No Tree Assumptions** — The model does not assume a single root or
  a strict parent-child chain.
- **Recursive Queries** — The implementation must support recursive
  traversal for operations like "find all descendants" or "find all
  ancestors."
- **Relationship Metadata** — Each hierarchy link carries type, status,
  effective dates, and audit metadata.

### Example

```
Penguin Random House (Parent)
    ├── Penguin Publishing (Subsidiary)
    │   ├── Penguin Books (Division)
    │   └── Puffin Books (Subsidiary)
    ├── Random House (Subsidiary)
    │   ├── Crown Publishing (Division)
    │   └── Ballantine Books (Division)
    └── Penguin Random House Canada (Branch)
```

This is a simple tree; the architecture also supports structures like
joint ventures (two parents) and consortiums (N:N relationships).

## 10. Addresses

Addresses reference a future **Address Framework** RFC. This section
defines the requirements only.

### Address Types

| Type | Description |
|------|-------------|
| **Head Office** | Primary registered office. |
| **Regional Office** | Office in a specific region or country. |
| **Warehouse** | Physical warehouse or distribution centre. |
| **Billing** | Billing and invoicing address. |
| **Shipping** | Shipping and receiving address. |
| **Legal** | Address for legal service of process. |
| **Virtual Office** | Virtual or co-working space address. |

### Requirements

- An Organization may have 0..N addresses of any type.
- Addresses are private data by default (see Section 16).
- Each address carries type, status, effective dates, and audit
  metadata.
- The Address Framework will define the full address schema,
  internationalisation, geocoding, and privacy controls.

## 11. Contacts

Contacts reference a future **Contact Framework** RFC. This section
defines the requirements only.

### Contact Types

| Type | Description |
|------|-------------|
| **General** | General inquiry contact. |
| **Legal** | Legal department or legal representative. |
| **Accounting** | Billing, finance, and accounting contact. |
| **Management** | Executive or senior management contact. |
| **Operations** | Operational contact (facilities, IT, HR). |
| **Media** | Press and media relations contact. |
| **Compliance** | Regulatory and compliance contact. |
| **Emergency** | Emergency contact person. |

### Requirements

- An Organization may have 0..N contacts of any type.
- Contacts are private data (see Section 16).
- Each contact has name, role, contact information, and audit metadata.
- The Contact Framework will define the full contact schema and privacy
  controls.

## 12. Branding

An Organization may have branding assets that form part of its identity.

| Asset | Description |
|-------|-------------|
| **Logo** | Current primary logo. |
| **Historical Logo** | Previous logos (immutable, append-only). |
| **Brand Colors** | Primary and secondary brand colour palette. |
| **Mission** | Mission statement. |
| **Vision** | Vision statement. |
| **Tagline** | Short tagline or motto. |
| **Brand Assets** | Additional brand assets (brand guidelines, templates). |

- Branding assets are part of the Public Profile.
- Historical logos are preserved as immutable records.
- Brand assets are stored as media references (deferred to a future
  Media Assets RFC).

## 13. Legal Information

An Organization carries legal metadata that is essential for compliance,
contracting, and verification.

| Field | Description | Visibility |
|-------|-------------|------------|
| **Registration Number** | Official registration number in the jurisdiction of incorporation. | Private |
| **Jurisdiction** | The country or state where the org is registered. | Public |
| **Registration Date** | Date of original registration. | Public |
| **Tax Registrations** | List of tax registration numbers by jurisdiction. | Private |
| **Licences** | Business licences and permits. | Private |
| **Certificates** | Industry certifications (ISO, etc.). | Public (certificate names) / Private (documents) |
| **Compliance Status** | Current compliance status (compliant, under review, non-compliant). | Private |
| **Legal Form** | Legal form of the organisation (LLC, corporation, charitable trust, etc.). | Public |

- Legal information is collected during verification.
- Supporting documents are stored as encrypted evidence (see Section 14).

## 14. Verification

Verification reuses the future **Verification Framework** RFC. This
section defines the requirements.

### Verification Scope

Organizations may be verified at multiple levels:

| Level | Requirements |
|-------|-------------|
| **BASIC** | Email domain confirmed. Website ownership verified. |
| **REGISTERED** | Registration number verified against official registry. |
| **VETTED** | Full due diligence: legal documents, tax registration,
licences, and compliance check completed. |

### Verification Metadata

Each verification event records:

| Field | Description |
|-------|-------------|
| **Verifier** | The actor or system that performed the verification. |
| **Evidence** | Reference or pointer to the evidence provided. |
| **Evidence Hash** | Cryptographic hash of the evidence document. |
| **Method** | How verification was performed (registry lookup, document
review, automated check, external API). |
| **Confidence Score** | A score indicating confidence (0.0 – 1.0). |
| **Expiration Date** | When this verification expires. |
| **Review Date** | When the verification was last reviewed. |
| **Review Notes** | Notes from the verifier. |
| **Status** | Pending, approved, rejected, expired, revoked. |
| **History** | Full immutable history of all verification events. |

### Principles

- Verification history is never overwritten. Each event is appended.
- Automated checks run periodically. Failures flag the organisation for
  re-verification.
- Verification evidence is private and stored securely.

## 15. Public Profile

The following Organization data is visible to all actors, including
**Visitors**:

- Name (current, native, romanized, English aliases)
- Slug
- Organization type(s)
- Tagline, mission, vision
- Logo, brand colours
- Jurisdiction (country of registration)
- Registration date
- Legal form
- Certifications (names only)
- Website URLs (public ones)
- Social media links
- Public contact information (configurable)
- Verification level (BASIC / REGISTERED / VETTED)
- Active status
- Parent organization name and slug
- Subsidiaries and divisions (names only)
- Affiliated organizations (public ones)
- Founded year

## 16. Private Information

The following Organization data is never exposed through public APIs:

- Full street addresses (street name, building, suite)
- Phone number(s)
- Email address(es)
- Registration number
- Tax registrations and tax IDs
- BIN, TIN, DUNS, LEI, and similar identifiers
- Business licences and permit documents
- Compliance status and compliance documents
- Verification evidence, evidence hashes, and confidence scores
- Review notes and internal flags
- Audit history
- Financial information
- Contact persons (names, roles, contact details)
- Relationship metadata (contract terms, effective dates)
- Internal branding assets (unpublished brand guidelines)

Private data is accessible only to **Administrator**, **Verifier**, and
the **Organization's authorized representatives**.

## 17. Search Requirements

Search must support:

- **Full-text search** across name (all variants), tagline, mission,
  vision, description, slug, and organization type.
- **Filter by organization type** (one or more types).
- **Filter by verification level** (BASIC / REGISTERED / VETTED).
- **Filter by active status** (active, archived, dissolved, all).
- **Filter by jurisdiction** (country of registration).
- **Filter by legal form.**
- **Filter by founded year or year range.**
- **Filter by parent organization** (organizations with a specific
  parent).
- **Filter by relationship type** (find all subsidiaries of an org).
- **Sort by name, date added, verification level, founded year.**
- **Geo-search** (organizations near a location) — optional, future.
- **Faceted counts** for organization type, verification level,
  jurisdiction, legal form.
- **Autocomplete** on organization name and slug.

Search results return the **Public Profile** shape only. Private data is
never indexed or returned.

## 18. Import Requirements

Import supports batch ingestion of organization records from external
sources.

- **Format**: JSON, CSV, XML.
- **Fields**: All public profile fields plus optional private fields.
- **Validation**: Each record is validated against the domain schema.
  Invalid records are collected in an error report.
- **Duplicate detection**: Matched on UUID (if provided), slug,
  Registration Number, BIN, TIN, DUNS, LEI, or ROR. Duplicates are
  flagged, not imported.
- **Identifier creation**: Missing UUIDs are auto-generated. Missing
  slugs are generated from the name.
- **Verification level**: Imported organizations start at DRAFT.
  Verification must be completed after import.
- **Relationship import**: Parent/subsidiary and other relationships
  may be included in the import. Orphan references are flagged.
- **Audit trail**: Every import batch creates an audit record.

## 19. Export Requirements

Export supports full or filtered organization data for external use.

- **Format**: JSON, CSV, XML.
- **Scope**:
  - Public export — Public Profile only.
  - Full export — Includes private data. Restricted to Administrators
    and the organization's authorized representatives.
- **Filtering**: Same filters as Search.
- **Pagination**: Cursor-based pagination for large exports.
- **Rate limiting**: Exports are rate-limited per API Consumer.
- **Consistency**: Point-in-time snapshots using repeatable read.

## 20. Permissions

| Action | Visitor | Contributor | Organization Rep | Verifier | Administrator |
|--------|---------|-------------|-----------------|----------|---------------|
| View public profile | ✅ | ✅ | ✅ | ✅ | ✅ |
| Search organizations | ✅ | ✅ | ✅ | ✅ | ✅ |
| Export public data | ✅ | ✅ | ✅ | ✅ | ✅ |
| View own private data | ❌ | ❌ | ✅ | ✅ | ✅ |
| Create organization | ❌ | ✅ | ❌ | ❌ | ✅ |
| Update own profile | ❌ | ❌ | ✅ | ❌ | ❌ |
| Update any org | ❌ | ❌ | ❌ | ✅ | ✅ |
| Verify organization | ❌ | ❌ | ❌ | ✅ | ✅ |
| Suspend/archive/dissolve | ❌ | ❌ | ❌ | ❌ | ✅ |
| Restore organization | ❌ | ❌ | ❌ | ❌ | ✅ |
| View audit history | ❌ | ❌ | ✅ (own) | ✅ | ✅ |
| Export full data | ❌ | ❌ | ✅ (own) | ✅ | ✅ |
| Import batch | ❌ | ❌ | ❌ | ❌ | ✅ |
| Merge organizations | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage relationships | ❌ | ❌ | ✅ (own) | ❌ | ✅ |
| Manage legal info | ❌ | ❌ | ✅ (own) | ✅ | ✅ |

## 21. Security

- **Identifier verification** — Registration numbers, tax IDs, DUNS,
  LEI, and similar identifiers are stored securely. Supporting documents
  use encrypted blob storage with access logging.
- **Evidence storage** — Verification evidence is stored immutably with
  cryptographic hashes. Evidence is never served through public
  endpoints.
- **Rate limiting** — All mutation endpoints are rate-limited per
  authenticated actor. Import and export have lower, separate limits.
- **Audit logging** — All state transitions, verification actions,
  permission changes, merges, and relationship changes are logged with
  actor, timestamp, and diff.
- **Data minimisation** — Private data is collected only when necessary.
  The public profile must not leak private data through computed fields,
  error messages, or search indexes.
- **Export control** — Full data exports require explicit authorization
  and are logged. Bulk export of private data by an Administrator
  triggers an alert.
- **Slug squatting** — Global slug uniqueness (same policy as RFC-0004
  Section 23). Abandoned organizations release their slug after a
  configurable cool-down period.
- **Merge safety** — Merges are audited and require Administrator
  privileges. Reversal requires manual intervention.
- **Relationship integrity** — Removing a relationship must not
  orphan dependent entities or leave dangling references.

## 22. Merge Strategy

Organization merge follows the same strategy defined in RFC-0004
Section 22 (Merge Strategy) with organization-specific additions.

### Concepts

| Concept | Description |
|---------|-------------|
| **Merged Into** | The surviving organization. |
| **Merged From** | The organization that is absorbed. |

### Rules

- No history is lost. The merged-from organization's identifiers,
  lifecycle history, verification history, relationships, legal
  information, and branding are preserved as historical records.
- **Identity Preservation** — All identifiers of the merged-from
  organization are retained and linked to the merged-into organization.
- **Relationship Migration** — All domain entities referencing the
  merged-from organization are reassigned to the merged-into
  organization. The original relationship audit trail is preserved.
- **Subsidiary Migration** — If the merged-from organization had
  subsidiaries, they become subsidiaries of the merged-into
  organization.
- **Redirect Strategy** — Slugs and URLs from the merged-from
  organization redirect permanently (301) to the merged-into
  organization.
- **Lifecycle** — The merged-from organization transitions to MERGED
  state. The merged-into organization's lifecycle is unaffected.
- **Reversal** — Not reversible by default. Manual Administrator action
  required.
- **Audit** — Every merge creates an audit record listing both
  organizations, the actor, the timestamp, and the scope of migration.

## 23. Internationalization

Organizations operate across languages, scripts, and jurisdictions.
Follow the same internationalization principles defined in RFC-0004
Section 24.

### Multi-lingual Names

An organization name may be represented in multiple forms:

- **Native Script** — The name in the organization's native writing
  system.
- **Romanized** — Transliteration into Latin script.
- **English** — An English-language version of the name.
- **Aliases** — Additional names, trade names, or alternative spellings.

### Principles

- All name fields accept full Unicode (UTF-8).
- At least one name is required. Multiple names are allowed.
- A primary name is designated for display purposes.
- The slug is derived from the primary name but may be customised.
- Search indexes all name variants.
- No script or language is treated as default.

### Jurisdiction-specific Data

- Legal names may differ by jurisdiction. The model supports
  jurisdiction-specific registration names.
- Tax registrations are jurisdiction-scoped.

## 24. Future Extensions

### Organization Marketplace

A marketplace for organization-to-organization services: contract
printing, distribution agreements, co-publishing partnerships.

### Organization Analytics

Dashboards showing organization footprint, relationship graphs,
verification status, and compliance calendar.

### Organization Compliance Calendar

Automated tracking of verification expirations, licence renewals, and
compliance deadlines.

### Organization Risk Scoring

Risk assessment based on verification level, compliance history,
jurisdiction stability, and relationship network.

### Organization Directory

A public directory of verified organizations searchable by type,
jurisdiction, and verification level.

## 25. Open Questions

1. Should verification level be global or jurisdiction-specific? Can an
   organization be VETTED in one country and BASIC in another?

2. How are organization representatives authenticated and authorized?
   Is there a separate Organization Representative role type, or does it
   reuse the existing Contributor/Publisher actor types?

3. Should the organization graph support edge weights or typed
   relationship strengths (e.g., percentage ownership)?

4. What is the maximum practical depth of an organization hierarchy
   before query performance requires materialized paths or nested sets?

5. Should tax registrations be modelled as identifiers (extending the
   identity framework) or as a separate legal metadata structure?

6. How are organizations linked to user accounts? Can a user represent
   multiple organizations?

7. Should the organization model support historical jurisdictions (e.g.,
   an organization that moved its registration from one country to
   another)?

8. What is the cool-down period for slug release after an organization
   is dissolved?

9. Should organization verification confidence scores be exposed in the
   public profile (as a single aggregate score) or kept entirely private?

## 26. Acceptance Criteria

- [ ] Organization **Vision**, **Goals**, and **Non-Goals** are
      documented and reviewed.
- [ ] **Organization Definition** clearly separates Organization (legal
      entity) from Publisher (publishing identity) and all other domain
      entities.
- [ ] All **Organization Types** (18 types) are listed and described as
      an extensible string union.
- [ ] Organization **identity** reuses `GenericIdentifier` with 14
      identifier types (UUID, Registration, Tax ID, BIN, TIN, Website,
      Email, Phone, ISNI, GRID, ROR, DUNS, LEI, Custom), supporting
      multiple identifiers, verification, and history.
- [ ] Organization **lifecycle** reuses the Lifecycle Framework with
      ACTIVE, DISSOLVED, and RESTORED as custom states, plus archival
      and dissolution transitions.
- [ ] **Organization Relationships** defines 13 relationship types
      (Parent, Subsidiary, Division, Department, Branch, Office,
      Affiliate, Partner, Member, Owner, Operator, Sponsor, Funder)
      with cardinality.
- [ ] **Organization Hierarchy** documents unlimited depth, graph-based
      relationships, and no tree assumptions.
- [ ] **Addresses** references the future Address Framework with 7
      address types defined.
- [ ] **Contacts** references the future Contact Framework with 8
      contact types defined.
- [ ] **Branding** covers Logo, Historical Logo, Brand Colors, Mission,
      Vision, Tagline, and Brand Assets.
- [ ] **Legal Information** covers Registration, Tax, Licences,
      Certificates, Compliance, and Jurisdiction with public/private
      visibility.
- [ ] **Verification** defines three levels (BASIC, REGISTERED, VETTED)
      with full verification metadata (verifier, evidence, evidence
      hash, method, confidence score, expiration, review, status,
      history) and append-only immutability.
- [ ] **Public Profile** and **Private Information** boundaries are
      clearly separated.
- [ ] **Search**, **Import**, and **Export** requirements are specified.
- [ ] **Permissions** are defined for all 6 actors across 16 actions.
- [ ] **Security** addresses identifier storage, evidence storage, rate
      limiting, audit logging, data minimisation, export control, slug
      squatting, merge safety, and relationship integrity.
- [ ] **Merge Strategy** documents Merged Into, Merged From, Identity
      Preservation, Relationship Migration, Subsidiary Migration,
      Redirect Strategy, and Audit.
- [ ] **Internationalization** supports Native Script, Romanized,
      English, and Aliases with Unicode-first principles and
      jurisdiction-specific legal names.
- [ ] **Future Extensions** (Organization Marketplace, Analytics,
      Compliance Calendar, Risk Scoring, Directory) are identified.
- [ ] **Open Questions** are documented and awaiting resolution.
