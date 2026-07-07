---
title: Search Framework
status: Draft
number: RFC-0011
version: 0.1
authors:
  - tbd
created: 2026-07-06
---

# RFC-0011: Search Framework

## 1. Vision

**Search** inside tProkash is the universal discovery layer that spans
every module, every entity type, every language, and every taxonomy. It
answers questions like:

- "Find all books about quantum physics in Bengali, published after 2020,
  available as eBook."
- "Show me publishers in Bangladesh that are TRUSTED and specialise in
  Children's literature."
- "Autocomplete the name of a distributor that starts with 'Rokomari'."
- "Find all events within 50 kilometres of Dhaka in the next 3 months."
- "Show me similar books to this one, based on subject, genre, and
  audience."

The Search Framework defines the universal abstraction for indexing,
querying, and ranking across all tProkash data. It is:

- **Engine-agnostic** — The same framework works with PostgreSQL
  full-text search, OpenSearch, Elasticsearch, Meilisearch, Typesense,
  or any future engine.
- **Multilingual** — Full Unicode support with language-aware stemming,
  tokenisation, and ranking for every language in the platform.
- **Unified** — A single Search API that spans all entity types. A query
  can search across Publishers, Books, Authors, Events, and
  Organisations in one request.
- **Real-time by default** — Changes to entities are reflected in search
  results within seconds.
- **Taxonomy-aware** — Queries understand hierarchy: searching for
  "Science" also matches "Physics", "Chemistry", and "Biology".
- **Privacy-aware** — Search results respect entity visibility and
  verification levels. Private and Internal data is never indexed or
  returned.

## 2. Goals

- Define a universal, implementation-neutral Search abstraction that
  every domain module uses.
- Support **8 query types**: full-text, exact, prefix, autocomplete,
  fuzzy, phonetic, faceted, and geographic search.
- Support **multilingual search** with language-aware analysis for all
  languages used in the platform.
- Support **taxonomy-aware search** with hierarchical term expansion
  (searching a parent term also finds children).
- Define a **ranking and scoring model** that balances relevance,
  freshness, verification level, and popularity.
- Define **cursor and offset pagination** for flexible result browsing.
- Support **search suggestions** (related queries, "did you mean?") and
  **saved searches** (user bookmarks).
- Define **search analytics** for tracking query volume, popular terms,
  and zero-result queries.
- Define **re-indexing and incremental indexing** strategies that keep
  search up to date without downtime.
- Separate the **index model** (what is stored) from the **storage
  model** (what is in the database).

## 3. Non-Goals

- Implement search engine configuration, deployment, or cluster
  management.
- Define specific search engine mappings, analyzers, or tokenizers
  (these are engine-specific and deployment-specific).
- Build UI components (search bars, result lists, faceted filters).
- Implement query autocomplete endpoints or typeahead services.
- Define specific ranking algorithm implementations.
- Implement a recommendation engine (Search provides the primitives;
  recommendations are a future extension).
- Implement a full query parser or DSL (the framework defines query
  shapes; parsing is implementation-specific).
- Define search result caching strategies.
- Implement spellcheck or "did you mean?" generation (defined as a
  future extension with the interface specified).

## 4. Search Philosophy

The framework is built on six principles:

### 4.1 Index is Separate from Storage

The search index is derived from the primary storage (database) but
independent of it. The index is optimised for query speed and relevance;
the database is optimised for consistency and relationships. Indexing is
asynchronous by default. Index inconsistencies are tolerated for short
periods (near-real-time, not real-time).

### 4.2 One Unified Index

All entity types share a single search abstraction. A single query can
search across Publishers, Books, Authors, and Events simultaneously
with consistent ranking, filtering, and faceting. Entity-specific
fields are stored in a structured `attributes` map.

### 4.3 Language-aware

Every document in the index declares its language. The search engine
uses language-specific analyzers for stemming, tokenisation, and stop
words. Queries are analysed in the same language as the target
documents. Cross-language search is supported through transliteration
and synonym expansion.

### 4.4 Taxonomy-expanded

When a query filters by a taxonomy term, the framework automatically
expands the filter to include all child terms. Searching for "Science"
also matches documents tagged with "Physics", "Chemistry", "Biology",
and their children. This expansion is configurable (exact match only,
immediate children only, full subtree).

### 4.5 Privacy-filtered

Search results are filtered by the actor's permissions at query time.
The index stores the visibility level (PUBLIC, PRIVATE, INTERNAL) and
the owning entity ID. Results that the actor is not authorised to view
are excluded from the result set.

### 4.6 Relevance over Recall

The framework prioritises relevant results over complete results.
Ranking and scoring ensure that the most useful results appear first.
Zero-result queries are captured for analytics to identify gaps in the
data or the index.

## 5. Search Object Model

### SearchQuery

```jsonc
{
  "q": "quantum physics",
  "language": "en",
  "entityTypes": ["BOOK", "PUBLISHER"],
  "filters": [
    { "field": "subject", "op": "IN", "values": ["SCI-PHYS"] },
    { "field": "language", "op": "EQ", "value": "bn" },
    { "field": "publishedYear", "op": "GTE", "value": 2020 },
    { "field": "format", "op": "EQ", "value": "EBOOK" }
  ],
  "facets": ["subject", "language", "format", "publisherType"],
  "sort": { "field": "relevance", "order": "DESC" },
  "pagination": {
    "type": "CURSOR | OFFSET",
    "cursor": "string?",
    "offset": 0,
    "limit": 20
  },
  "searchAfter": "string?",
  "minScore": 0.1,
  "explain": false
}
```

### SearchResult

```jsonc
{
  "total": 142,
  "page": {
    "limit": 20,
    "offset": 0,
    "totalPages": 8
  },
  "cursor": {
    "next": "cursor_string_for_next_page",
    "previous": "cursor_string_for_previous_page"
  },
  "results": [
    {
      "score": 0.95,
      "rank": 1,
      "entityType": "BOOK",
      "entityId": "uuid",
      "summary": {
        "title": "Quantum Physics for Beginners",
        "subtitle": "string?",
        "description": "A comprehensive introduction...",
        "imageUrl": "https://cdn.tprokash.com/...",
        "language": "en",
        "year": 2024
      },
      "highlights": {
        "title": ["<em>Quantum</em> <em>Physics</em> for Beginners"],
        "description": ["A comprehensive introduction to <em>quantum</em> <em>physics</em>"]
      },
      "attributes": {
        "subject": ["SCI-PHYS"],
        "format": "EBOOK",
        "publisherId": "uuid",
        "publisherName": "Academic Press"
      }
    }
  ],
  "facets": {
    "subject": [
      { "value": "SCI-PHYS", "label": "Physics", "count": 85 },
      { "value": "SCI-CHEM", "label": "Chemistry", "count": 42 }
    ],
    "language": [
      { "value": "en", "label": "English", "count": 98 },
      { "value": "bn", "label": "Bengali", "count": 28 }
    ]
  },
  "suggestions": ["quantum mechanics", "quantum computing", "particle physics"],
  "queryTimeMs": 12
}
```

### SearchDocument (what gets indexed)

```jsonc
{
  "id": "uuid",
  "entityType": "BOOK",
  "entityId": "uuid",
  "language": "en",
  "visibility": "PUBLIC | PRIVATE | INTERNAL",
  "ownerId": "uuid",
  "verificationLevel": "BASIC | STANDARD | ENHANCED | ACCREDITED | TRUSTED",
  "searchable": {
    "title": "Quantum Physics for Beginners",
    "subtitle": "A Gentle Introduction",
    "description": "A comprehensive introduction to quantum physics...",
    "content": "Full text content if available (e.g., book description, author bio)...",
    "keywords": ["quantum", "physics", "mechanics", "beginner"],
    "alternativeTitles": ["Quantum Mechanics for Beginners"],
    "identifiers": ["978-0-123456-78-9", "QUANTUM-2024"]
  },
  "attributes": {
    "subject": ["SCI-PHYS", "SCI-MECH"],
    "genre": ["NON_FICTION", "EDUCATIONAL"],
    "audience": ["ADULT", "ACADEMIC"],
    "format": "EBOOK",
    "language": "en",
    "publishedYear": 2024,
    "publisherId": "uuid",
    "publisherName": "Academic Press",
    "country": "US",
    "price": 29.99,
    "pageCount": 350
  },
  "timestamps": {
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "publishedAt": "datetime"
  },
  "taxonomyTerms": {
    "subject": ["SCI-PHYS", "SCI-MECH"],
    "genre": ["NON_FICTION"],
    "audience": ["ADULT"]
  },
  "coordinates": {
    "latitude": 23.8103,
    "longitude": 90.4125
  }
}
```

## 6. Searchable Entity Model

Every domain entity that wants to be searchable provides a
`SearchDocument` to the index.

### Registration

An entity declares itself searchable by:

1. Implementing a document mapper (entity → `SearchDocument`).
2. Registering the mapper with the search framework.
3. Specifying the index schema for the entity type (which fields are
   searchable, which are filterable, which are facetable, which are
   sortable).

### Entity Index Schema

```jsonc
{
  "entityType": "BOOK",
  "searchableFields": [
    { "field": "title", "type": "TEXT", "boost": 3.0 },
    { "field": "subtitle", "type": "TEXT", "boost": 2.0 },
    { "field": "description", "type": "TEXT", "boost": 1.5 },
    { "field": "content", "type": "TEXT", "boost": 1.0 },
    { "field": "keywords", "type": "TEXT", "boost": 2.5 },
    { "field": "identifiers", "type": "TEXT", "boost": 2.0 }
  ],
  "filterableFields": [
    "subject", "genre", "audience", "format", "language",
    "publishedYear", "publisherId", "country"
  ],
  "facetableFields": [
    "subject", "genre", "audience", "format", "language",
    "publishedYear", "country"
  ],
  "sortableFields": [
    "publishedYear", "createdAt", "title", "score"
  ],
  "geospatial": false,
  "languageField": "language"
}
```

## 7. Index Abstraction

The index is abstracted behind a uniform interface that any search
engine can implement.

### Index Interface (Conceptual)

```typescript
interface SearchIndex {
  // Document management
  index(document: SearchDocument): Promise<void>;
  bulkIndex(documents: SearchDocument[]): Promise<void>;
  update(document: SearchDocument): Promise<void>;
  delete(entityType: string, entityId: uuid): Promise<void>;

  // Query
  search(query: SearchQuery): Promise<SearchResult>;

  // Index management
  createIndex(entityType: string, schema: IndexSchema): Promise<void>;
  deleteIndex(entityType: string): Promise<void>;
  refresh(): Promise<void>;

  // Maintenance
  health(): Promise<IndexHealth>;
  stats(): Promise<IndexStats>;
}
```

### Supported Engine Adapters (Illustrative)

| Engine | Adapter | Use Case |
|--------|---------|----------|
| PostgreSQL Full-Text Search | `postgresql` | Small deployments, simple queries. No additional infrastructure. |
| OpenSearch / Elasticsearch | `opensearch` | Large deployments, advanced queries, faceted search, geospatial. |
| Meilisearch | `meilisearch` | Typo-tolerant search, instant autocomplete, developer experience. |
| Typesense | `typesense` | Low-latency typo-tolerant search, geolocation, faceting. |
| Algolia (Cloud) | `algolia` | Managed search service, high reliability, global CDN. |

### Engine Selection

- The engine is selected at deployment time through configuration.
- The framework's abstraction ensures that switching engines does not
  require changes to domain code.
- The same deployment may use different engines for different entity
  types or query patterns (e.g., PostgreSQL for simple entity search,
  Meilisearch for autocomplete, OpenSearch for full-text analytics).

## 8. Full-Text Search

Full-text search is the primary query type. It searches across all
text fields declared as `searchable` in the entity schema.

### Behaviour

- Query text is analysed: tokenised, lowercased, stemmed, and filtered
  for stop words.
- Search is across multiple fields with field-specific boosting.
- Results are ranked by relevance score (see Section 20).
- By default, all terms in the query must match (AND logic). OR logic
  may be configured.
- Phrase queries (exact match of a sequence of terms) are supported
  with double quotes: `"quantum entanglement"`.

### Language Handling

- The query language is detected or explicitly specified.
- Language-specific analyzers are applied to both the query and the
  documents.
- If the query language does not match the document language, a
  cross-language search fallback is applied (see Section 16).

## 9. Exact Search

Exact search matches a field value exactly, without analysis.

### Use Cases

- Find a book by ISBN: `isbn = "978-0-123456-78-9"`
- Find a publisher by slug: `slug = "penguin-random-house"`
- Find an entity by UUID: `id = "550e8400-e29b-... "`

### Behaviour

- No tokenisation, stemming, or stop word removal.
- Case-insensitive by default (configurable).
- Supports prefix matching for partial exact values.

## 10. Prefix Search

Prefix search matches the beginning of a field value.

### Use Cases

- Autocomplete: "rok" → "Rokomari", "Roktim"
- Partial identifier lookup: "978-0" → all ISBNs starting with "978-0"

### Behaviour

- Matches documents where the field value starts with the query prefix.
- Case-insensitive.
- May be combined with full-text search for "search as you type".

## 11. Autocomplete

Autocomplete provides real-time suggestions as the user types.

### Behaviour

- Queries are sent on every keystroke (debounced client-side).
- Results are returned in milliseconds.
- Suggestions are drawn from indexed fields (title, name, slug) and
  from a dedicated suggestions index (popular past queries).
- Autocomplete respects visibility and permissions.
- Results are typically limited to 5–10 suggestions.

### Autocomplete-Specific Index

```jsonc
{
  "id": "uuid",
  "entityType": "PUBLISHER",
  "entityId": "uuid",
  "suggestions": {
    "inputs": ["Penguin", "Penguin Random", "Penguin Books"],
    "output": "Penguin Random House",
    "weight": 1.0
  }
}
```

## 12. Fuzzy Search

Fuzzy search matches terms that are similar but not identical to the
query.

### Use Cases

- Typo tolerance: "quamtum" → matches "quantum"
- Spelling variations: "colour" → matches "color"

### Behaviour

- Uses Levenshtein distance or similar edit distance algorithm.
- Configurable maximum edit distance (typically 1 or 2 characters).
- Fuzzy search is applied per term, not to the entire query.
- Higher edit distances impact performance and may reduce relevance.

## 13. Phonetic Search

Phonetic search matches terms that sound similar.

### Use Cases

- Names with variant spellings: "Mohammad", "Mohammed", "Muhammad"
- Transliteration variations: "Dhaka", "Dacca"

### Behaviour

- Phonetic encodings (Soundex, Metaphone, Double Metaphone) are
  generated at index time and stored alongside the original text.
- Queries are phonetically encoded at query time and matched against
  the stored encodings.
- Phonetic search is typically applied to name fields (publisher name,
  author name, city name).

## 14. Faceted Search

Faceted search returns counts for each value of a specified field,
allowing users to narrow results interactively.

### Behaviour

- Facets are requested in the query (`facets: ["subject", "language"]`).
- The response includes counts for each facet value.
- Multiple facet values may be selected within the same field (OR
  logic).
- Facets across different fields are combined with AND logic.
- Facet counts are computed on the filtered result set, not the total
  index.

### Pagination-Aware Faceting

By default, facet counts are computed across the entire matching result
set, not just the current page. This ensures consistent facet counts
regardless of pagination.

## 15. Geographic Search

Geospatial search finds entities within a geographic area.

### Query Types

- **Radius search**: Find entities within a given distance of a point.
- **Bounding box search**: Find entities within a rectangular area.
- **Polygon search**: Find entities within an arbitrary boundary.

### Example: Radius Search

```jsonc
{
  "filters": [
    {
      "field": "_geo",
      "op": "WITHIN_RADIUS",
      "latitude": 23.8103,
      "longitude": 90.4125,
      "radius": "50km"
    }
  ]
}
```

### Index Requirements

- Entities with geospatial data store `coordinates` in their
  `SearchDocument`.
- The index must support geospatial queries (not all engines do).
- Geospatial search respects visibility (PRIVATE addresses are not
  indexed).

## 16. Multilingual Search

Multilingual search ensures that users can find content regardless of
the language they search in.

### Language Detection

- Query language may be explicitly specified or auto-detected.
- Auto-detection uses character set analysis and common word detection.
- Language detection is a hint, not a hard filter. Users may search
  across languages.

### Language-Specific Analysis

Each language requires:

- Character normalization (Unicode normalization forms).
- Tokenization rules (whitespace for most languages, CJK segmentation
  for Chinese/Japanese/Korean, compound splitting for German).
- Stemming or lemmatization (English, French, Arabic, Bengali, etc.).
- Stop word removal (language-specific lists).
- Transliteration for cross-language matching.

### Cross-Language Search

When a query in language A does not find sufficient results, the
framework may:

1. Transliterate the query into other scripts.
2. Expand using synonym mappings across languages.
3. Fall back to unanalyzed (verbatim) matching.

Cross-language search is opt-in and configurable per query.

## 17. Taxonomy-Aware Search

When a query filters by a taxonomy term, the framework automatically
expands the filter to include child terms.

### Expansion Behaviour

- **EXACT**: Only the specified term (no expansion).
- **IMMEDIATE_CHILDREN**: The term and its direct children.
- **SUBTREE**: The term and all descendants (unlimited depth).

### Example

Query: Filter by subject "SCIENCE" with SUBTREE expansion.

Matches documents tagged with:
- SCIENCE
- SCIENCE > PHYSICS
- SCIENCE > PHYSICS > QUANTUM_MECHANICS
- SCIENCE > CHEMISTRY
- SCIENCE > BIOLOGY
- ... (all descendants)

### Implementation

- The taxonomy framework provides the term hierarchy.
- The search framework calls the taxonomy framework to resolve term
  expansion at query time.
- Expanded term IDs are added to the filter as a list of values (OR
  logic).
- Facet counts for the parent term include counts from all children.

## 18. Synonym Expansion

Synonyms expand the query to include alternative terms.

### Synonym Sources

- **Taxonomy synonyms**: Defined in the Taxonomy Framework (see
  RFC-0010, Section 17).
- **Global synonyms**: Deployment-wide synonym pairs or groups.
- **Query-time synonyms**: Specified per query.

### Behaviour

- The query is expanded with synonyms before analysis.
- Expanded terms are OR'd with the original terms.
- Synonym expansion is configurable per query (enabled/disabled).

### Example

Query: "car"
Synonyms: ["automobile", "vehicle", "auto"]
Effective query: "car" OR "automobile" OR "vehicle" OR "auto"

## 19. Ranking Model

Ranking determines the order of search results.

### Primary Rank Factors

| Factor | Weight | Description |
|--------|--------|-------------|
| **Text relevance** | 60% | How well the query matches the document's text fields (with field-specific boosting). |
| **Verification level** | 15% | Higher verification level = higher rank. TRUSTED entities rank above UNVERIFIED. |
| **Recency** | 10% | More recently published/updated entities rank higher. |
| **Popularity** | 10% | Entities with higher engagement (views, sales, references) rank higher. |
| **Proximity** | 5% | Geospatial proximity (if geo-query). |

### Custom Ranking

- Each entity type may define custom ranking factors (e.g., Books may
  rank by sales rank; Events may rank by date proximity).
- Custom factors are declared in the entity's index schema.

## 20. Scoring Model

Scoring assigns a numeric score to each result.

### Score Components

```
score = textRelevance * 0.6
      + verificationScore * 0.15
      + recencyScore * 0.10
      + popularityScore * 0.10
      + proximityScore * 0.05
```

### Score Normalization

- All component scores are normalized to 0.0 – 1.0.
- The final score is also 0.0 – 1.0.
- Scores are relative within the result set, not absolute across
  queries.

### Text Relevance Scoring (BM25)

The text relevance component uses BM25 or a similar term-frequency /
inverse-document-frequency algorithm:

- Term frequency (TF): How often the query term appears in the
  document.
- Inverse document frequency (IDF): How rare the term is across all
  documents.
- Field length normalization: Shorter fields are weighted more
  heavily.
- Field boosting: title > subtitle > description > content.

### Explain API

When `explain: true` is set on the query, each result includes a
breakdown of its score components.

## 21. Filters

Filters narrow the result set by structured field values.

### Filter Operators

| Operator | Description |
|----------|-------------|
| `EQ` | Equals (exact match). |
| `NEQ` | Not equals. |
| `IN` | In a list of values. |
| `NIN` | Not in a list of values. |
| `GT` | Greater than. |
| `GTE` | Greater than or equal. |
| `LT` | Less than. |
| `LTE` | Less than or equal. |
| `EXISTS` | Field has any value. |
| `NOT_EXISTS` | Field has no value. |
| `PREFIX` | Field value starts with prefix. |
| `WITHIN_RADIUS` | Geospatial radius filter. |

### Filter Application

- Filters are applied **after** the full-text query.
- Filters do not affect the relevance score (they are not ranking
  factors).
- Multiple filters are combined with AND logic.
- Multiple values within the same filter are combined with OR logic.

## 22. Sorting

Sorting determines the display order of results.

### Sort Fields

- **Relevance (default)**: Sort by the computed relevance score.
- **Field-based**: Sort by any declared `sortableField`.
- **Multiple sort fields**: Primary sort, secondary sort, etc.

### Sort Configuration

```jsonc
{
  "sort": [
    { "field": "relevance", "order": "DESC" },
    { "field": "publishedYear", "order": "DESC" },
    { "field": "title", "order": "ASC" }
  ]
}
```

### Sort vs. Rank

- **Rank**: The order determined by the ranking model (relevance +
  factors). Used when `sort = relevance`.
- **Sort**: A user-specified override. Overrides the ranking model for
  the primary sort field.

## 23. Pagination (Cursor and Offset)

### Offset Pagination

Traditional offset/limit pagination.

```jsonc
{
  "pagination": {
    "type": "OFFSET",
    "offset": 40,
    "limit": 20
  }
}
```

- Simple to implement.
- Performance degrades at high offsets (skip 10,000 rows).

### Cursor Pagination

Cursor-based pagination using a stable pointer.

```jsonc
{
  "pagination": {
    "type": "CURSOR",
    "cursor": "eyJzb3J0IjpbMTUwMDAwMDAwMCwiYWJjMTIzIl19",
    "limit": 20
  }
}
```

- Stable across result set changes (inserts/deletes do not shift
  pages).
- Consistent performance regardless of depth.
- The cursor encodes the sort values and the last document ID.
- Cursors are opaque strings to the client.

### Recommendation

- Use cursor pagination for deep pagination and stable result sets.
- Use offset pagination for shallow pagination (first few pages) and
  jump-to-page navigation.

## 24. Search Suggestions

Search suggestions help users refine their queries.

### Types

- **Query suggestions**: "Did you mean?" corrections for misspelled
  queries.
- **Related queries**: Queries that other users made after searching
  for the same term.
- **Completion suggestions**: "Search as you type" autocomplete (see
  Section 11).

### Query Suggestion Model

```jsonc
{
  "originalQuery": "quantam physics",
  "suggestions": [
    { "text": "quantum physics", "type": "CORRECTION", "score": 0.95 },
    { "text": "quantum mechanics", "type": "RELATED", "score": 0.80 },
    { "text": "particle physics", "type": "RELATED", "score": 0.60 }
  ]
}
```

### Implementation

- Query suggestions are generated from the search index (term
  frequency analysis) and from query analytics (popular past queries).
- Corrections use edit distance and phonetic encoding.
- Related queries use co-occurrence analysis.

## 25. Saved Searches

Saved searches allow users to bookmark frequently used search queries.

### Saved Search Model

```jsonc
{
  "id": "uuid",
  "userId": "uuid",
  "label": "Bengali physics books",
  "query": { /* SearchQuery */ },
  "notifyOnNew": true,
  "notifyFrequency": "DAILY | WEEKLY | INSTANT",
  "lastRunAt": "datetime",
  "lastResultCount": 142,
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Features

- Save any search query with all filters and options.
- Optionally receive notifications when new results match the saved
  query.
- Saved searches are private to the user.
- Administrators may view saved search analytics (aggregated, not
  per-user).

## 26. Search Analytics

Search analytics capture query patterns for optimisation.

### Collected Data

| Metric | Description |
|--------|-------------|
| Query text | The raw query string (hashed for privacy after analysis). |
| Query language | Detected or specified language. |
| Entity types | Which entity types were searched. |
| Filters applied | Which filters were used. |
| Result count | Number of results returned (0 for zero-result queries). |
| Clicked results | Which results the user clicked (rank and entity). |
| Session ID | Anonymous session identifier for session analysis. |
| Timestamp | When the query was executed. |
| Query time | How long the search took (milliseconds). |

### Reports

- **Popular queries**: Most frequent query terms and phrases.
- **Zero-result queries**: Queries that returned no results (identifies
  gaps in data or index).
- **Filter usage**: Which filters are most frequently used.
- **Click-through rate**: Which results are most frequently clicked at
  each rank position.
- **Query abandonment**: Queries where the user did not click any
  result.

### Privacy

- Search analytics are aggregated. Individual user query histories are
  not exposed.
- Query text may be hashed or anonymized after a retention period.
- Analytics data retention is configurable (default: 12 months).

## 27. Re-indexing Strategy

Re-indexing rebuilds the search index from the primary database.

### Full Re-index

- Reads all entities from the database and indexes them.
- May be performed without downtime by indexing into a new index alias
  and then swapping.
- Triggered on: initial deployment, schema changes, index corruption
  recovery.

### Partial Re-index

- Re-indexes a subset of entities (e.g., all entities of a specific
  type, or entities updated since a specific timestamp).
- Used for recovery of specific entity types.

### Re-index Schedule

- Full re-index: Manual trigger or scheduled (e.g., monthly).
- Incremental indexing: Continuous (see Section 28).

## 28. Incremental Indexing

Incremental indexing keeps the search index up to date with database
changes.

### Strategy: Change Data Capture (CDC)

1. Entity changes (create, update, delete) produce domain events.
2. A search indexing subscriber consumes these events.
3. The subscriber updates the search index for the affected entities.
4. Changes are batched for efficiency (default: 100ms batch window).

### Indexing Latency

| Tier | Latency | Description |
|------|---------|-------------|
| **Near-real-time** | < 1 second | Default. Changes visible in search within seconds. |
| **Batched** | < 60 seconds | High-volume changes batched for efficiency. |
| **Scheduled** | Configurable | For non-critical entity types (e.g., audit logs). |

### Error Handling

- Indexing failures are retried with exponential backoff.
- After 5 consecutive failures, the entity is flagged for manual
  review.
- Indexing failures do not affect the primary database or API
  availability.

## 29. Import/Export Considerations

### Import

- Import batches trigger bulk indexing operations.
- Each imported entity is indexed after successful import validation.
- Large imports may be indexed asynchronously after the import
  completes.
- Import logs record indexing success/failure per entity.

### Export

- Search results are exported as a flattened result set.
- Export inherits visibility and permission filters (private data is
  not exported).
- Export respects pagination limits. Large results are exported in
  batches.

## 30. Permissions and Visibility

Search results are filtered by the actor's permissions at query time.

### Visibility Filtering

| Index Visibility | Visitor | Entity Owner | Verifier | Administrator |
|------------------|---------|--------------|----------|---------------|
| PUBLIC | ✅ | ✅ | ✅ | ✅ |
| PRIVATE | ❌ | ✅ | ✅ | ✅ |
| INTERNAL | ❌ | ❌ | ❌ | ✅ |

### Entity Owner Resolution

- The index stores `ownerId` for each document.
- For entity owners, PRIVATE documents are included in results.
- For unauthenticated actors (Visitors), only PUBLIC documents are
  returned.

### Verification Level Filtering

- Actors may filter by minimum verification level (e.g., "Only show
  TRUSTED publishers").
- The filter is independent of the actor's own verification level.

## 31. Security Considerations

- **Indexed data minimisation** — Only data that is necessary for
  search is indexed. Private fields (full addresses, phone numbers,
  internal notes) are never indexed.
- **Query injection** — Query text is sanitised and parameterised.
  Raw query strings are never executed directly.
- **Index access control** — The search index is not directly
  accessible from outside the application. All search queries go
  through the API layer, which enforces permissions.
- **Rate limiting** — Search queries are rate-limited per actor to
  prevent abuse and scraping.
- **Analytics privacy** — Search analytics are aggregated. Individual
  query histories are not exposed. Query text is hashed after analysis.
- **Index encryption** — The search index is encrypted at rest (engine
  dependent).
- **Cross-entity data leakage** — The search abstraction ensures that
  querying across entity types does not leak data that the actor should
  not see. Each result is individually permission-checked.
- **Facet leakage prevention** — Facet counts are computed on the
  filtered, permission-scoped result set, not on the total index.

## 32. Future Extensions

### AI Semantic Search

Vector embeddings for semantic search. Queries are converted to
embeddings and matched against document embeddings by cosine
similarity. Enables "concept" search beyond keyword matching.

### Personalised Search

Search results are personalised based on the user's past behaviour,
preferences, and entity relationships. Personalisation factors are
applied as additional ranking signals.

### Visual Search

Search by image: upload a book cover to find the book or similar books.

### Voice Search

Speech-to-text query input with natural language query parsing.

### Hybrid Search

Combination of keyword search (BM25) and vector search (embeddings) in
a single query with configurable weighting.

### Search Federation

A single query that searches across tProkash and external data sources
(library catalogues, publisher APIs, open databases) with unified
ranking.

### Natural Language Query Parsing

Parse natural language queries like "physics books published by
Academic Press after 2020" into structured SearchQuery objects.

### Trending Search Terms

Real-time trending queries dashboard for Administrators.

## 33. Open Questions

1. Should the search framework support a single unified index (all
   entity types in one index) or per-entity-type indexes? Unified
   simplifies cross-entity search; per-type allows engine-specific
   optimisation.

2. How is the "popularity" ranking factor computed? Should it be based
   on page views, sales, references, or a composite?

3. Should the framework support search result deduplication across
   entity types (e.g., the same ISBN appearing as both a Book and an
   Edition)?

4. What is the maximum acceptable indexing latency for near-real-time
   indexing?

5. Should saved searches support sharing (e.g., a Librarian sharing a
   saved search with colleagues)?

6. How should the framework handle index schema migrations when entity
   fields are added, removed, or renamed?

7. Should the framework support multi-tenant search indexes, or is a
   single global index with tenant-based filtering sufficient?

8. What is the strategy for handling stop words across all supported
   languages? Should stop word lists be configurable?

9. Should the framework support search result grouping (e.g., group
   results by publisher, with counts per group)?

10. How are search analytics integrated with the broader platform
    analytics system?

## 34. Acceptance Criteria

- [ ] Search **Vision**, **Goals**, and **Non-Goals** are documented
      and reviewed.
- [ ] **Search Philosophy** documents six principles: Index Separate
      from Storage, One Unified Index, Language-aware,
      Taxonomy-expanded, Privacy-filtered, Relevance over Recall.
- [ ] **Search Object Model** defines SearchQuery (with q, language,
      entityTypes, filters, facets, sort, pagination, searchAfter,
      minScore, explain), SearchResult (with total, page, cursor,
      results, facets, suggestions, queryTimeMs), and SearchDocument
      (with searchable text fields, structured attributes, taxonomy
      terms, coordinates, visibility, timestamps).
- [ ] **Searchable Entity Model** defines entity registration, index
      schema (searchableFields with per-field boost, filterableFields,
      facetableFields, sortableFields, geospatial, languageField).
- [ ] **Index Abstraction** defines a conceptual interface (index,
      bulkIndex, update, delete, search, createIndex, deleteIndex,
      refresh, health, stats) and lists 5 supported engines.
- [ ] **Full-Text Search** documents tokenisation, stemming, stop
      words, field boosting, AND/OR logic, and phrase queries.
- [ ] **Exact Search** documents case-insensitive, no-analysis
      matching for identifiers and slugs.
- [ ] **Prefix Search** documents field value prefix matching for
      partial lookups.
- [ ] **Autocomplete** documents millisecond-level suggestions from
      indexed fields and a dedicated suggestions index with inputs,
      output, and weight.
- [ ] **Fuzzy Search** documents Levenshtein distance, configurable
      edit distance (1 or 2), and per-term application.
- [ ] **Phonetic Search** documents Soundex/Metaphone encoding at
      index and query time for name matching.
- [ ] **Faceted Search** documents per-field value counts,
      multi-value selection (OR within field, AND across fields), and
      pagination-aware faceting.
- [ ] **Geographic Search** documents radius, bounding box, and
      polygon query types with coordinate indexing.
- [ ] **Multilingual Search** documents language detection,
      language-specific analysis (normalization, tokenization,
      stemming, stop words), and cross-language fallback via
      transliteration and synonym expansion.
- [ ] **Taxonomy-Aware Search** documents EXACT, IMMEDIATE_CHILDREN,
      and SUBTREE expansion behaviours with facet count inheritance.
- [ ] **Synonym Expansion** documents taxonomy synonyms, global
      synonyms, and query-time synonyms with OR expansion.
- [ ] **Ranking Model** defines 5 factors (Text Relevance 60%,
      Verification Level 15%, Recency 10%, Popularity 10%, Proximity
      5%) with custom entity-type factors.
- [ ] **Scoring Model** defines BM25-based text relevance with
      field-specific boosting, component score normalisation, and an
      Explain API.
- [ ] **Filters** defines 11 operators (EQ, NEQ, IN, NIN, GT, GTE,
      LT, LTE, EXISTS, NOT_EXISTS, PREFIX, WITHIN_RADIUS) with AND/OR
      logic.
- [ ] **Sorting** defines multi-field sort (relevance + field-based)
      and distinguishes sort from rank.
- [ ] **Pagination** defines both OFFSET (offset/limit) and CURSOR
      (opaque cursor string) pagination with usage recommendations.
- [ ] **Search Suggestions** defines query corrections ("did you
      mean?"), related queries, and completion suggestions with a
      suggestion model.
- [ ] **Saved Searches** defines user bookmarks with query
      persistence, notification options, and frequency configuration.
- [ ] **Search Analytics** defines collected metrics (query, filters,
      result count, clicks, session, timing), reports (popular,
      zero-result, filter usage, CTR, abandonment), and privacy
      (aggregated, hashed, configurable retention).
- [ ] **Re-indexing Strategy** defines full re-index (alias swap for
      zero-downtime), partial re-index, and scheduling.
- [ ] **Incremental Indexing** defines CDC-based event consumption,
      batching (100ms window), latency tiers (near-real-time < 1s,
      batched < 60s, scheduled), and error handling with retry and
      backoff.
- [ ] **Import/Export Considerations** document bulk indexing after
      import and permission-filtered export.
- [ ] **Permissions and Visibility** documents 3-tier visibility
      (PUBLIC, PRIVATE, INTERNAL) with per-actor filtering at query
      time.
- [ ] **Security Considerations** address indexed data minimisation,
      query injection, index access control, rate limiting, analytics
      privacy, index encryption, cross-entity leakage prevention, and
      facet leakage prevention.
- [ ] **Future Extensions** (AI Semantic Search, Personalised Search,
      Visual Search, Voice Search, Hybrid Search, Search Federation,
      Natural Language Query, Trending Terms) are identified.
- [ ] **Open Questions** are documented (10 questions) and awaiting
      resolution.
