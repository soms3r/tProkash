---
title: Taxonomy Framework
status: Draft
number: RFC-0010
version: 0.1
authors:
  - tbd
created: 2026-07-06
---

# RFC-0010: Taxonomy Framework

## 1. Vision

A **Taxonomy** inside tProkash is a structured vocabulary used to
classify, organise, and discover entities across the platform.
Taxonomies are the backbone of every search filter, faceted browse,
recommendation engine, and analytics report. They answer questions like:

- What subject is this book?
- What genre does this publisher specialise in?
- What audience is this edition intended for?
- What format is this work available in?
- What language is this publication in?

The Taxonomy Framework provides a universal system for defining,
maintaining, versioning, and consuming taxonomies. It supports both
hierarchical taxonomies (unlimited depth) and flat lists, multilingual
labels, synonyms, historical terms, and standards-based mappings
(BISAC, BIC, Thema, etc.).

Taxonomies are:

- **Reusable** — Every module references the same taxonomy system.
  Subject terms are shared across Books, Publishers, and Authors.
- **Multilingual** — Every term has labels and descriptions in any
  number of languages.
- **Versioned** — Taxonomy changes are tracked over time. Historical
  terms remain usable for legacy data.
- **Standards-compatible** — Industry standards (BISAC, BIC, Thema) are
  first-class citizens alongside custom terms.
- **Governed** — Term creation, deprecation, merge, and split follow a
  defined governance workflow.

## 2. Goals

- Define a universal Taxonomy model that any domain entity can
  reference.
- Support **both hierarchical and flat taxonomies** with a single
  unified model.
- Support **unlimited depth** for hierarchical taxonomies.
- Support **multilingual labels and descriptions** for every term.
- Support **synonyms, aliases, and historical terms** for search and
  legacy data compatibility.
- Define a **versioning strategy** that tracks taxonomy changes over
  time without breaking existing references.
- Define a **deprecation strategy** that allows terms to be phased out
  while preserving historical data.
- Support **merge and split operations** on taxonomy terms without
  losing history.
- Support **industry standards** (BISAC, BIC, Thema) as importable and
  mappable taxonomies.
- Define a **governance model** for who can create, approve, deprecate,
  and retire taxonomy terms.

## 3. Non-Goals

- Implement database schema, migrations, or repositories.
- Define REST endpoints or GraphQL resolvers.
- Create UI components (term pickers, tree browsers, autocomplete).
- Implement full-text search indexing of taxonomy-labelled content.
- Define specific industry taxonomy mappings (those are data, not
  framework).
- Implement AI-powered term suggestion or auto-classification.
- Define a recommendation engine that uses taxonomies.
- Implement real-time taxonomy synchronisation with external standards.
- Define the specific taxonomy values for any domain (subjects, genres,
  etc. are defined in domain-specific RFCs referencing this framework).

## 4. Taxonomy Model

### Taxonomy Definition

A **Taxonomy** is a named collection of terms that share a common
purpose.

```jsonc
{
  "id": "uuid",
  "code": "subject",
  "name": "Subject Taxonomy",
  "description": "Hierarchical subject classification for books and publications.",
  "type": "HIERARCHICAL | FLAT",
  "standards": ["BISAC", "THEMA"],
  "version": 7,
  "status": "ACTIVE | DEPRECATED | RETIRED",
  "termCount": 1200,
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "audit": "AuditMetadata"
}
```

| Field | Description |
|-------|-------------|
| `code` | Machine-readable short code for the taxonomy. Globally unique. |
| `standards` | Industry standards that this taxonomy maps to (optional). |
| `version` | Current version number. Incremented on structural changes. |

### Taxonomy Term

A **Term** is a single node within a taxonomy.

```jsonc
{
  "id": "uuid",
  "taxonomyId": "uuid",
  "code": "SCI-PHYS",
  "parentId": "uuid?",
  "level": 1,
  "path": "SCIENCE > PHYSICS",
  "sortOrder": 100,
  "labels": {
    "en": "Physics",
    "bn": "পদার্থবিজ্ঞান",
    "ar": "الفيزياء",
    "fr": "Physique",
    "default": "Physics"
  },
  "descriptions": {
    "en": "Works concerning the study of matter, energy, and their interactions.",
    "bn": "পদার্থ, শক্তি এবং তাদের মিথস্ক্রিয়া সম্পর্কিত研究工作।"
  },
  "synonyms": ["Natural Philosophy"],
  "aliases": ["PHY", "PHYS"],
  "standardCodes": {
    "BISAC": "SCI055000",
    "THEMA": "PH"
  },
  "status": "ACTIVE | DEPRECATED | RETIRED",
  "deprecatedAt": "datetime?",
  "deprecationReason": "string?",
  "supersededBy": "uuid?",
  "mergedInto": "uuid?",
  "splitInto": ["uuid"],
  "version": 7,
  "effectiveFrom": "datetime",
  "effectiveUntil": "datetime?",
  "audit": "AuditMetadata"
}
```

| Field | Description |
|-------|-------------|
| `code` | Machine-readable short code for this term. Unique within the taxonomy. |
| `parentId` | Parent term ID (null for root-level terms). |
| `level` | Depth level (0 = root, 1 = child, etc.). |
| `path` | Human-readable path from root to this term. Denormalised for display. |
| `labels` | Multilingual labels. At minimum, `default` is required. |
| `descriptions` | Multilingual descriptions. Optional. |
| `synonyms` | Alternative terms that mean the same thing. |
| `aliases` | Short codes or abbreviations. |
| `standardCodes` | Mappings to industry standard taxonomies. |
| `status` | Current lifecycle state. |
| `supersededBy` | Term that replaced this one (on rename or reorganisation). |
| `mergedInto` | Term that absorbed this one (on merge). |
| `splitInto` | Terms that this term was split into (on split). |

## 5. Taxonomy Types

| Type | Code | Structure | Description |
|------|------|-----------|-------------|
| **Subject** | `subject` | Hierarchical | Subject classification (e.g., Science → Physics → Quantum Mechanics). |
| **Genre** | `genre` | Hierarchical or Flat | Literary or creative genre (e.g., Fiction → Mystery → Cozy Mystery). |
| **Audience** | `audience` | Flat | Target audience (e.g., Children, Young Adult, Adult, Academic). |
| **Education Level** | `education_level` | Hierarchical | Education level (e.g., Primary → Secondary → Undergraduate → Postgraduate). |
| **Language** | `language` | Flat | Publishing language (reference to BCP-47, may be extended). |
| **Format** | `format` | Flat | Publishing format (e.g., Print, eBook, Audiobook, Braille). |
| **Publisher Specialization** | `publisher_specialization` | Hierarchical | Publisher subject specialisation (may reference Subject taxonomy). |
| **Award Category** | `award_category` | Hierarchical | Category within an award (e.g., Fiction → Novel → Debut Novel). |
| **Event Type** | `event_type` | Flat | Type of event (e.g., Book Fair, Launch, Signing, Conference). |
| **Binding** | `binding` | Flat | Physical binding type (e.g., Hardcover, Paperback, Spiral, Saddle-stitched). |
| **Reading Level** | `reading_level` | Hierarchical | Reading or grade level (e.g., Grade 1, Grade 2, Lexile 800L). |
| **Age Range** | `age_range` | Flat | Recommended age range (e.g., 0-2, 3-5, 6-8, 9-12, 13-17, 18+). |
| **Content Warning** | `content_warning` | Flat | Content advisory labels (e.g., Explicit Language, Violence, Sensitive Topics). |
| **Custom** | `custom` | Hierarchical or Flat | Extensible custom taxonomy for deployment-specific needs. |

Taxonomy types are represented as an extensible string union. Any
module may define new taxonomy types.

## 6. Hierarchical Taxonomies

Hierarchical taxonomies organise terms in a parent-child tree with
unlimited depth.

### Structure

```
SCIENCE (level 0)
    ├── PHYSICS (level 1)
    │   ├── QUANTUM_MECHANICS (level 2)
    │   ├── THERMODYNAMICS (level 2)
    │   └── ELECTROMAGNETISM (level 2)
    ├── CHEMISTRY (level 1)
    │   ├── ORGANIC_CHEMISTRY (level 2)
    │   └── INORGANIC_CHEMISTRY (level 2)
    └── BIOLOGY (level 1)
        ├── MOLECULAR_BIOLOGY (level 2)
        ├── ECOLOGY (level 2)
        └── ZOOLOGY (level 2)
```

### Properties

- **Unlimited depth**: No hard limit on the number of levels.
- **Single parent**: Each term has exactly one parent (except root
  terms).
- **Multiple root terms**: A taxonomy may have multiple top-level
  terms.
- **Full path**: Each term stores its denormalised path for efficient
  display and search (e.g., "SCIENCE > PHYSICS > QUANTUM_MECHANICS").
- **Term at multiple levels**: A term may appear at any level. The same
  term cannot appear in multiple branches.

### Operations

- **Add child**: Create a new term under a parent.
- **Reparent**: Move a term (and its subtree) to a new parent.
- **Promote**: Move a term up one level.
- **Demote**: Move a term down one level.
- **Reorder**: Change the sort order of sibling terms.

## 7. Flat Taxonomies

Flat taxonomies are simple lists of terms with no hierarchical
structure.

### Examples

| Term | Sort Order |
|------|------------|
| Print | 10 |
| eBook | 20 |
| Audiobook | 30 |
| Braille | 40 |
| Large Print | 50 |

### Properties

- **No parent-child relationships**: All terms are at the same level.
- **Sort order**: Terms have a numeric sort order for display.
- **Simple**: Flat taxonomies are a subset of the hierarchical model
  (they use none of the hierarchy fields).

## 8. Subject Taxonomy

The Subject taxonomy is the primary hierarchical taxonomy used by Books,
Publishers, and Authors.

### Standards Mapping

| Standard | Description |
|----------|-------------|
| **BISAC** | Book Industry Standards and Communications (US). Approximately 5,000 subjects in a 3-level hierarchy. |
| **BIC** | Book Industry Communication (UK). Approximately 2,500 subjects in a 4-level hierarchy. |
| **Thema** | International subject category standard. Approximately 3,000 subjects in a 4-level hierarchy. Jointly maintained by BISG and BIC. |
| **Custom** | tProkash-specific subjects not covered by any standard. |

### Mapping Strategy

- The Subject taxonomy may be initially seeded from BISAC, BIC, or
  Thema.
- Each term carries its standard codes in the `standardCodes` field.
- Multiple standards may be mapped to the same term (e.g., a term may
  have both BISAC and Thema codes).
- Custom terms (not in any standard) are identified by the absence of
  `standardCodes`.
- Import of new versions of standards is supported (see Section 20,
  Deprecation Strategy).

## 9. Genre Taxonomy

The Genre taxonomy classifies creative and literary genres.

### Sample Hierarchy

```
FICTION
    ├── HISTORICAL_FICTION
    ├── MYSTERY
    │   ├── COZY_MYSTERY
    │   ├── HARD_BOILED
    │   └── POLICE_PROCEDURAL
    ├── SCIENCE_FICTION
    │   ├── HARD_SF
    │   ├── SOFT_SF
    │   └── CYBERPUNK
    ├── FANTASY
    │   ├── HIGH_FANTASY
    │   ├── URBAN_FANTASY
    │   └── DARK_FANTASY
    ├── ROMANCE
    │   ├── CONTEMPORARY_ROMANCE
    │   ├── HISTORICAL_ROMANCE
    │   └── PARANORMAL_ROMANCE
    └── THRILLER
        ├── PSYCHOLOGICAL_THRILLER
        ├── POLITICAL_THRILLER
        └── LEGAL_THRILLER

NON_FICTION
    ├── BIOGRAPHY
    ├── HISTORY
    ├── SCIENCE
    ├── SELF_HELP
    └── TRAVEL
```

### Relationship to Subject

- Genre and Subject are separate taxonomies.
- A work may have one or more genres and one or more subjects.
- Genre is more about the narrative or creative style; Subject is about
  the topic.
- Some terms may overlap across taxonomies (e.g., "Science" appears in
  both Genre and Subject). They are distinct terms in their respective
  taxonomies.

## 10. Audience Taxonomy

The Audience taxonomy classifies the intended readership.

| Term | Description |
|------|-------------|
| Children | Ages 0–12 |
| Young Adult | Ages 13–17 |
| Adult | Ages 18+ |
| Academic | Higher education and research |
| Professional | Industry and professional practice |
| General | General readership, all ages |

Flat list, not hierarchical. Multiple audience terms may apply to a
single work (e.g., "Young Adult" and "Adult" for crossover titles).

## 11. Education-Level Taxonomy

The Education-Level taxonomy classifies works by educational stage.

### Sample Hierarchy

```
EARLY_CHILDHOOD (ages 3-5)
PRIMARY (ages 5-11)
    ├── KEY_STAGE_1 (ages 5-7)
    └── KEY_STAGE_2 (ages 7-11)
SECONDARY (ages 11-16)
    ├── KEY_STAGE_3 (ages 11-14)
    └── KEY_STAGE_4 (ages 14-16)
HIGHER_SECONDARY (ages 16-18)
UNDERGRADUATE
POSTGRADUATE
    ├── MASTERS
    └── DOCTORATE
CONTINUING_EDUCATION
VOCATIONAL
```

### Use

- Primarily used by Educational Publishers and Libraries.
- May be regionalised (e.g., "KEY_STAGE" is UK-specific; "GRADE" is
  US-specific).

## 12. Language Taxonomy

The Language taxonomy lists languages in which works are published.

- Reference standard: BCP-47 (ISO 639-1 + ISO 3166-1 alpha-2
  sub-tags).
- Flat list, not hierarchical.
- Terms may represent languages (`en`, `bn`, `ar`) or
  language-region combinations (`en-US`, `en-GB`, `bn-BD`).
- The taxonomy is seeded from the BCP-47 registry and may be extended
  with custom entries.
- Each term maps to its BCP-47 code in `standardCodes`.

## 13. Format Taxonomy

The Format taxonomy lists the physical or digital format of a work.

| Term | Description |
|------|-------------|
| Print | Physical book (hardcover, paperback). |
| eBook | Digital book (EPUB, PDF, Kindle). |
| Audiobook | Audio narration. |
| Braille | Braille edition. |
| Large Print | Large-print edition. |
| Interactive | Interactive digital publication. |
| Open Access | Freely accessible digital work. |
| Digital First | Born-digital publication. |
| Multimedia | Combines text, audio, video. |

Flat list. A work may have multiple formats.

## 14. Publisher-Specialization Taxonomy

This taxonomy describes the subject areas a publisher specialises in.

- May be a subset of the Subject taxonomy, or a separate flat list.
- A publisher selects terms from this taxonomy to declare their
  specialisation.
- Searchable: users can find publishers by specialisation.

## 15. Tagging Model

Tags are lightweight, informal terms that can be applied to any entity.
Unlike taxonomy terms, tags are not governed by a formal taxonomy
structure.

### Tag Model

```jsonc
{
  "id": "uuid",
  "label": "bestseller",
  "locale": "en",
  "entityType": "BOOK",
  "entityId": "uuid",
  "createdBy": "uuid",
  "createdAt": "datetime"
}
```

### Properties

- Tags are flat (no hierarchy).
- Tags are user-generated or system-generated.
- Tags are not governed (any authorised user may create them).
- Tags may be promoted to taxonomy terms if they gain sufficient usage.
- Tags are searchable.
- Tag labels are not globally unique (the same label may be used across
  different entity types).

## 16. Keyword Model

Keywords are search terms associated with an entity for SEO and
discovery.

### Keyword Model

```jsonc
{
  "id": "uuid",
  "value": "quantum physics for beginners",
  "locale": "en",
  "entityType": "BOOK",
  "entityId": "uuid",
  "source": "PUBLISHER | SYSTEM | AI_EXTRACTED",
  "weight": 0.8,
  "createdAt": "datetime"
}
```

### Properties

- Keywords are strings, not taxonomy terms.
- Keywords may be extracted from metadata (title, description) or
  provided by the publisher.
- Keywords carry a weight (0.0 – 1.0) for search relevance.
- Keywords are searchable and contribute to full-text search ranking.

## 17. Synonyms and Aliases

### Synonyms

Synonyms are alternative terms that mean the same thing as a taxonomy
term. They are used for search expansion and cross-referencing.

| Field | Description |
|-------|-------------|
| `termId` | The canonical term. |
| `synonym` | The alternative term. |
| `locale` | Language of the synonym. |
| `type` | `EXACT` (identical meaning) or `RELATED` (broader/narrower). |

**Example**: Term "Physics" has synonyms "Natural Philosophy"
(historical), "Physical Science" (related).

### Aliases

Aliases are short codes or abbreviations for a term.

| Field | Description |
|-------|-------------|
| `termId` | The canonical term. |
| `alias` | The short code. |
| `scope` | `INTERNAL` (system use) or `EXTERNAL` (user-facing). |

**Example**: Term "Quantum Mechanics" has aliases "QM" (internal),
"Quantum Physics" (external).

### Historical Terms

When a term is renamed or deprecated, the old label is preserved as a
historical synonym. This ensures that legacy data referencing the old
term remains discoverable.

## 18. Localization and Translations

Every taxonomy term supports multilingual labels and descriptions.

### Label Localization

```jsonc
{
  "labels": {
    "default": "Physics",
    "en": "Physics",
    "bn": "পদার্থবিজ্ঞান",
    "ar": "الفيزياء",
    "fr": "Physique",
    "de": "Physik",
    "es": "Física",
    "zh": "物理学",
    "ja": "物理学",
    "hi": "भौतिक विज्ञान"
  }
}
```

### Principles

- The `default` label is required. It is used when no localized version
  exists for the user's preferred language.
- The `default` label is typically in English but may be set to any
  language depending on the deployment.
- Localized labels are optional beyond `default`.
- Descriptions follow the same pattern as labels.
- Synonyms may also be localized.

## 19. Versioning Strategy

Taxonomy versions track changes to the term set and structure.

### Version Scope

- Versioning is per-taxonomy, not global.
- A version is incremented when terms are added, deprecated, merged,
  split, re-parented, renamed, or reordered.
- A version snapshot captures the complete term set at a point in time.

### Version Record

```jsonc
{
  "id": "uuid",
  "taxonomyId": "uuid",
  "version": 7,
  "reason": "BISAC_2026_UPDATE",
  "changeLog": "Added 45 new terms, deprecated 12 terms, merged 3 terms.",
  "createdAt": "datetime",
  "createdBy": "uuid"
}
```

### Entity References

- Entities reference taxonomy terms by term ID, not by label.
- A term ID is stable across versions. Renaming a term does not change
  its ID.
- When a term is deprecated or retired, entities that reference it
  continue to work. The term's historical data is preserved.
- When a term is merged, the merged-into term ID is recorded on the
  original term. Entities referencing the original term may be
  automatically or manually reassigned.

## 20. Deprecation Strategy

Terms are deprecated before they are retired, giving consuming modules
time to migrate.

### Process

```
ACTIVE → DEPRECATED → RETIRED
```

| State | Description |
|-------|-------------|
| **ACTIVE** | Term is available for use. |
| **DEPRECATED** | Term is still usable but should not be used for new classifications. Existing references remain valid. A deprecation notice and suggested replacement (supersededBy) are recorded. |
| **RETIRED** | Term is no longer usable. Entities that still reference it are flagged. Retired terms are excluded from search and browse. |

### Timeline

1. Term is marked DEPRECATED with a deprecation reason and suggested
   replacement.
2. Consuming modules are notified (governance workflow).
3. After a configurable migration period (default: 6 months), the term
   is automatically transitioned to RETIRED.
4. Entities still referencing a RETIRED term are flagged for
   administrative review.

### Impact on References

- DEPRECATED: All references continue to work. No immediate action
  required.
- RETIRED: References continue to resolve (term metadata is retained),
  but the term is excluded from active use (cannot be applied to new
  entities, excluded from browse/search).

## 21. Merge and Split Operations

### Merge

When two taxonomy terms are determined to be the same concept, they may
be merged.

```
Term A: "Quantum Physics"     merge    Term B: "Quantum Mechanics"
         └── mergedInto ─────────────► (surviving term)
```

- The surviving term absorbs all references from the merged term.
- The merged term's `mergedInto` field is set to the surviving term ID.
- The merged term transitions to DEPRECATED, then RETIRED.
- Merge history is preserved (both terms retain their full history).

### Split

When a taxonomy term represents multiple distinct concepts, it may be
split.

```
Term A: "Physical Sciences"
         ├── splitInto ──► Term B: "Physics"
         └── splitInto ──► Term C: "Chemistry"
```

- The original term's `splitInto` field lists the new terms.
- References to the original term are not automatically reassigned.
  An administrative review determines which new term(s) apply.
- The original term may be deprecated or retained depending on the
  split.

### History Preservation

- Original terms and their history are never deleted.
- Merge and split events are recorded in the term's audit trail.
- The relationship between original and resulting terms is traversable
  for search and reporting.

## 22. Relationships

Taxonomy terms are referenced by domain entities through relationship
records.

### Entity-to-Term Relationship

```jsonc
{
  "id": "uuid",
  "entityType": "BOOK",
  "entityId": "uuid",
  "taxonomyId": "uuid",
  "termId": "uuid",
  "primary": true,
  "weight": 1.0,
  "assignedBy": "PUBLISHER | SYSTEM | AI",
  "assignedAt": "datetime"
}
```

### Relationship Types (Illustrative)

```
Term (Subject: Science)
    ├── N:M  Books             — subject of book
    ├── N:M  Publishers        — publisher specialisation
    ├── N:M  Authors           — author's subject area
    ├── N:M  Series            — series subject
    ├── N:M  Awards            — award category subject
    └── N:M  Events            — event subject focus

Term (Genre: Mystery)
    ├── N:M  Books             — genre of book
    └── N:M  Authors           — author's genre
```

### Entity Classification

An entity may have:

- Multiple terms from the same taxonomy (e.g., a book may have multiple
  subjects).
- Terms from multiple taxonomies (e.g., a book has a subject, genre,
  audience, format, and language).
- A primary term per taxonomy (e.g., primary subject, primary genre).

## 23. Search Requirements

Taxonomy search must support:

### Term Search

- **Full-text search** across labels (all languages), descriptions,
  synonyms, aliases, and code.
- **Filter by taxonomy** (subject, genre, audience, etc.).
- **Filter by status** (ACTIVE, DEPRECATED, RETIRED).
- **Filter by level** (root terms only, leaf terms only, any level).
- **Filter by parent** (find all children of a given term).
- **Filter by standard code** (BISAC, BIC, Thema, BCP-47).
- **Sort by sort order, label, code, or level.**
- **Autocomplete** on term label and code.
- **Find related terms** (synonyms, aliases, standard code mappings).
- **Find deprecated terms** that have been superseded.
- **Find terms by language** (terms with labels in a specific locale).

### Entity-by-Term Search (Cross-module)

- **Find entities by taxonomy term**: "Find all books with subject
  'Physics'".
- **Find entities by multiple terms**: "Find all books with subject
  'Physics' AND audience 'Academic'".
- **Find entities by term hierarchy**: "Find all books under subject
  'Science' (including children 'Physics', 'Chemistry', 'Biology')".
- **Faceted counts** by term and taxonomy for browse interfaces.

## 24. Import/Export Requirements

### Import

- **Format**: JSON, CSV, XML.
- **Standard taxonomy import**: BISAC, BIC, and Thema taxonomies may be
  imported from their official distribution formats.
- **Custom taxonomy import**: Custom taxonomies in the framework's
  interchange format.
- **Validation**: Each term is validated for uniqueness (code within
  taxonomy), parent existence, and required field presence.
- **Duplicate detection**: Matched on code within the taxonomy. Updates
  are applied as version changes (new version of existing terms, new
  terms added).
- **Merge detection**: During import, if an existing term's code maps
  to a new term in the standard, the import may trigger a merge or
  deprecation workflow.
- **Audit**: Every import creates a version record with change log.

### Export

- **Format**: JSON, CSV, XML.
- **Scope**:
  - Full export — All terms, all languages, all metadata.
  - Standard mapping export — Only terms with standard codes, in the
    format required by the standard body.
  - Minimal export — Term ID, code, default label, and status.
- **Filtering**: Same filters as Search.
- **Version selection**: Export may target a specific taxonomy version.

## 25. API Resource Shapes

The following shapes describe Taxonomy resources. Actual endpoints are
deferred to implementation RFCs.

### Taxonomy

```jsonc
{
  "id": "uuid",
  "code": "subject",
  "name": "Subject Taxonomy",
  "description": "string?",
  "type": "HIERARCHICAL | FLAT",
  "standards": ["BISAC"],
  "version": 7,
  "status": "ACTIVE | DEPRECATED | RETIRED",
  "termCount": 1200,
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "audit": "AuditMetadata"
}
```

### Term

```jsonc
{
  "id": "uuid",
  "taxonomyId": "uuid",
  "code": "SCI-PHYS",
  "parentId": "uuid?",
  "parentCode": "SCIENCE?",
  "level": 1,
  "path": "SCIENCE > PHYSICS",
  "sortOrder": 100,
  "labels": {
    "default": "Physics",
    "en": "Physics",
    "bn": "পদার্থবিজ্ঞান"
  },
  "descriptions": {
    "en": "Description text."
  },
  "synonyms": ["Natural Philosophy"],
  "aliases": ["PHY"],
  "standardCodes": {
    "BISAC": "SCI055000",
    "THEMA": "PH"
  },
  "children": ["TermSummary"],
  "childCount": 5,
  "status": "ACTIVE | DEPRECATED | RETIRED",
  "supersededBy": "uuid?",
  "mergedInto": "uuid?",
  "splitInto": ["uuid"],
  "effectiveFrom": "datetime",
  "effectiveUntil": "datetime?",
  "audit": "AuditMetadata"
}
```

### TermSummary

```jsonc
{
  "id": "uuid",
  "code": "SCI-PHYS",
  "labels": {
    "default": "Physics"
  },
  "level": 1,
  "path": "SCIENCE > PHYSICS",
  "status": "ACTIVE | DEPRECATED | RETIRED"
}
```

### TermInput (create/update)

```jsonc
{
  "code": "SCI-PHYS",
  "parentCode": "SCIENCE?",
  "sortOrder": 100,
  "labels": {
    "default": "Physics",
    "bn": "পদার্থবিজ্ঞান"
  },
  "descriptions": {
    "en": "Description text."
  },
  "synonyms": ["Natural Philosophy"],
  "aliases": ["PHY"],
  "standardCodes": {
    "BISAC": "SCI055000"
  }
}
```

### EntityTermReference

```jsonc
{
  "entityType": "BOOK",
  "entityId": "uuid",
  "taxonomyCode": "subject",
  "termId": "uuid",
  "termCode": "SCI-PHYS",
  "primary": true,
  "weight": 1.0,
  "assignedBy": "PUBLISHER | SYSTEM | AI"
}
```

## 26. Permissions

| Action | Visitor | Contributor | Taxonomy Manager | Administrator |
|--------|---------|-------------|-----------------|---------------|
| View taxonomy list | ✅ | ✅ | ✅ | ✅ |
| View term details | ✅ | ✅ | ✅ | ✅ |
| Search terms | ✅ | ✅ | ✅ | ✅ |
| Apply term to entity | ❌ | ✅ | ✅ | ✅ |
| Suggest new term | ❌ | ✅ | ✅ | ✅ |
| Create term (direct) | ❌ | ❌ | ✅ | ✅ |
| Update term label/description | ❌ | ❌ | ✅ | ✅ |
| Reparent term | ❌ | ❌ | ✅ | ✅ |
| Deprecate term | ❌ | ❌ | ✅ | ✅ |
| Retire term | ❌ | ❌ | ❌ | ✅ |
| Merge terms | ❌ | ❌ | ✅ | ✅ |
| Split term | ❌ | ❌ | ✅ | ✅ |
| Import taxonomy | ❌ | ❌ | ❌ | ✅ |
| Export taxonomy | ✅ | ✅ | ✅ | ✅ |
| Create new taxonomy | ❌ | ❌ | ❌ | ✅ |
| Deprecate/retire taxonomy | ❌ | ❌ | ❌ | ✅ |
| Configure taxonomy governance | ❌ | ❌ | ❌ | ✅ |

## 27. Governance Model

Taxonomy changes follow a defined governance workflow.

### Roles

| Role | Description |
|------|-------------|
| **Contributor** | May suggest new terms and apply existing terms to entities. |
| **Taxonomy Manager** | May create, update, deprecate, merge, and split terms. |
| **Standards Owner** | May import new versions of industry standards and manage standard mappings. |
| **Administrator** | May create/deprecate entire taxonomies, configure governance rules. |

### Workflow for Term Changes

```
SUGGESTED → IN_REVIEW → APPROVED → ACTIVE
                  └──→ REJECTED
```

| Stage | Description |
|-------|-------------|
| **SUGGESTED** | A new term has been suggested by a Contributor or system process. |
| **IN_REVIEW** | A Taxonomy Manager is reviewing the suggestion. |
| **APPROVED** | The term is approved and transitions to ACTIVE. |
| **REJECTED** | The suggestion is rejected with a reason recorded. |

### Governance Rules

- New term suggestions require at least one Taxonomy Manager approval.
- Deprecation requires Taxonomy Manager action.
- Merge and split operations require Taxonomy Manager action with
  documented rationale.
- Retiring a term requires Administrator action.
- Importing a new version of an industry standard creates an automatic
  version diff. Changes are reviewed before being applied.

## 28. Security Considerations

- **Term squatting** — A proposed term that is never approved may be
  purged after a configurable period. Approved terms cannot be
  "reserved" without use.
- **Standard mapping integrity** — Standard codes (BISAC, BIC, Thema)
  are cross-checked against the official standard to prevent spoofed
  mappings.
- **Governance bypass** — Direct term creation (bypassing the suggestion
  workflow) is restricted to Taxonomy Managers and logged.
- **Historical preservation** — Deprecated and retired terms are
  immutable. They cannot be modified after retirement.
- **Merge/split audit** — Merge and split operations are logged with
  rationale and before/after state for full traceability.
- **Export control** — Taxonomy export does not include entity
  references. It is taxonomy data only.
- **Term injection** — Term labels and descriptions are sanitised
  against injection attacks (XSS, SQLi) on input.

## 29. Future Extensions

### AI-assisted Term Suggestion

Machine learning models analyse usage patterns and suggest new terms or
term mappings. Suggested terms enter the governance workflow.

### Automatic Standard Synchronisation

A service that periodically checks for updates to BISAC, BIC, Thema,
and other standards, imports changes, and generates a diff report for
review.

### Term Popularity Analytics

Track how often each term is used across entities. Analytics inform
governance decisions (merge rarely-used terms, split overused terms).

### Federated Taxonomy Sharing

Share taxonomy terms between tProkash instances or with partner
platforms through a standard interchange format.

### Entity-specific Term Overrides

Allow a specific entity to define a custom child term under a standard
term without modifying the global taxonomy (e.g., a publisher's
proprietary subcategory).

### Term Lifecycle Automation

Automated deprecation of terms that have had zero usage for a
configurable period, with notification to Taxonomy Managers.

## 30. Open Questions

1. Should taxonomy terms support multiple parents (DAG structure), or
   is single-parent hierarchy sufficient? Multiple parents enable
   cross-classification but add complexity.

2. Should the framework support taxonomy namespacing (e.g., each
   publisher can define their own local terms under a global namespace)?

3. How are standard taxonomy updates (e.g., BISAC 2026 → BISAC 2027)
   handled when terms are removed from the standard? Automatic
   deprecation or manual review?

4. What is the maximum practical depth of a hierarchical taxonomy?
   Should the framework enforce a limit?

5. Should the framework support taxonomy term versioning independently
   of the overall taxonomy version (e.g., individual term change
   history)?

6. How should the framework handle term label conflicts across
   languages? If the same term has different labels in different
   languages, which one is canonical?

7. Should there be a distinction between "internal" taxonomies (for
   system use) and "external" taxonomies (for user-facing
   classification)?

8. How are term references handled when a taxonomy itself is
   deprecated? Do entity-term relationships need to be migrated?

9. Should the taxonomy framework support rule-based term assignment
   (e.g., "if a book has subject PHYSICS, automatically assign subject
   SCIENCE")?

10. What is the maximum number of terms recommended for a single
    taxonomy before performance optimisation is needed?

## 31. Acceptance Criteria

- [ ] Taxonomy **Vision**, **Goals**, and **Non-Goals** are
      documented and reviewed.
- [ ] The **Taxonomy Model** defines the Taxonomy container (code,
      name, description, type, standards, version, status) and the
      Term node (taxonomyId, code, parentId, level, path, sortOrder,
      labels, descriptions, synonyms, aliases, standardCodes, status,
      supersededBy, mergedInto, splitInto, effectiveFrom, effectiveUntil,
      audit).
- [ ] **Taxonomy Types** (14 types: Subject, Genre, Audience,
      Education Level, Language, Format, Publisher Specialization,
      Award Category, Event Type, Binding, Reading Level, Age Range,
      Content Warning, Custom) are defined as an extensible string
      union.
- [ ] **Hierarchical Taxonomies** document unlimited depth, single
      parent, multiple roots, denormalised path, and operations (add
      child, reparent, promote, demote, reorder).
- [ ] **Flat Taxonomies** document simple list structure with sort
      order as a subset of the hierarchical model.
- [ ] **Subject Taxonomy** documents BISAC, BIC, and Thema standard
      mapping strategy with the `standardCodes` field.
- [ ] **Genre Taxonomy** provides a sample hierarchy (FICTION →
      Mystery → Cozy Mystery) and documents the relationship to
      Subject taxonomy as separate.
- [ ] **Audience Taxonomy** (6 terms: Children, Young Adult, Adult,
      Academic, Professional, General) is defined as a flat list.
- [ ] **Education-Level Taxonomy** provides a sample hierarchy (Early
      Childhood → Primary → Key Stage 1-2 → Secondary → Key Stage 3-4
      → Higher Secondary → Undergraduate → Postgraduate).
- [ ] **Language Taxonomy** references BCP-47 as the standard, flat
      list, with language-region combinations.
- [ ] **Format Taxonomy** (9 terms: Print, eBook, Audiobook, Braille,
      Large Print, Interactive, Open Access, Digital First, Multimedia)
      is defined as a flat list.
- [ ] **Publisher-Specialization Taxonomy** is documented as a subset
      of Subject or a separate flat list.
- [ ] **Tagging Model** defines lightweight, informal, user-generated
      tags (flat, no hierarchy, not governed, promotable to taxonomy
      terms).
- [ ] **Keyword Model** defines weighted search keywords with source
      (PUBLISHER, SYSTEM, AI_EXTRACTED).
- [ ] **Synonyms and Aliases** define EXACT/RELATED synonym types,
      INTERNAL/EXTERNAL alias scopes, and historical term preservation.
- [ ] **Localization and Translations** define the `labels` and
      `descriptions` multilingual maps with `default` required field
      and per-language overrides.
- [ ] **Versioning Strategy** defines per-taxonomy version
      increments on structural changes, version records with change
      logs, and stable term IDs across renames.
- [ ] **Deprecation Strategy** defines ACTIVE → DEPRECATED → RETIRED
      states, default 6-month migration window, and reference impact
      for each state.
- [ ] **Merge and Split Operations** define `mergedInto` and
      `splitInto` fields, history preservation, and reference
      reassignment policies.
- [ ] **Relationships** define the EntityTermReference model
      (entityType, entityId, taxonomyId, termId, primary, weight,
      assignedBy) with multiple term and multiple taxonomy references
      per entity.
- [ ] **Search Requirements** document term search (10 dimensions),
      entity-by-term search (hierarchical expansion, faceted counts),
      and autocomplete.
- [ ] **Import/Export Requirements** document standard taxonomy import
      (BISAC, BIC, Thema), custom import, validation, duplicate
      detection, merge detection, and versioned export.
- [ ] **API Resource Shapes** define Taxonomy, Term (full),
      TermSummary, TermInput, and EntityTermReference.
- [ ] **Permissions** are defined for all 4 actor classes across 17
      actions.
- [ ] **Governance Model** defines 4 roles (Contributor, Taxonomy
      Manager, Standards Owner, Administrator) and a 4-stage workflow
      (SUGGESTED → IN_REVIEW → APPROVED → ACTIVE with REJECTED).
- [ ] **Security Considerations** address term squatting, standard
      mapping integrity, governance bypass logging, historical
      preservation, merge/split audit, export control, and term
      injection.
- [ ] **Future Extensions** (AI-assisted Suggestion, Automatic Standard
      Sync, Term Popularity Analytics, Federated Sharing, Entity-
      specific Overrides, Lifecycle Automation) are identified.
- [ ] **Open Questions** are documented (10 questions) and awaiting
      resolution.
