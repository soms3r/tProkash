# Search Specification — v0.2

## Overview

The v0.2 search provides full-text discovery across three entity types: **publishers**, **books**, and **authors**. Results are grouped by entity type and displayed in a merged, ranked list.

## Searchable Fields

### Publishers
| Field | Weight | Type |
|-------|--------|------|
| name_en | High | Full-text |
| name_bn | High | Full-text |
| alternative_names | Medium | Full-text |
| slug | Medium | Exact match |
| registration_number | Low | Exact match |
| services[] | Medium | Full-text |
| imprint_names[] | Medium | Full-text |
| city | Low | Full-text |
| website | Low | Full-text |

### Books
| Field | Weight | Type |
|-------|--------|------|
| title_en | High | Full-text |
| title_bn | High | Full-text |
| alternative_titles | Medium | Full-text |
| isbn | High | Exact match |
| authors[].name_en | High | Full-text |
| authors[].name_bn | High | Full-text |
| publisher_name | Medium | Full-text |
| description | Low | Full-text |
| category | Medium | Exact / Full-text |
| series_name | Low | Full-text |

### Authors / Persons
| Field | Weight | Type |
|-------|--------|------|
| name_en | High | Full-text |
| name_bn | High | Full-text |
| pseudonyms[] | Medium | Full-text |
| biography | Low | Full-text |
| book_titles[] | Medium | Full-text |

## Search Behavior

### Query Processing
1. Trim whitespace, collapse multiple spaces
2. Truncate to 200 characters with warning if exceeded
3. Sanitize special characters that may affect search syntax
4. If query appears to be an ISBN (10 or 13 digit pattern), prioritize exact ISBN match
5. If query is in Bengali script, boost `_bn` field scores; if Latin, boost `_en` field scores

### Ranking
1. Exact matches score highest
2. Prefix matches score next
3. Substring matches score next
4. Fuzzy matches (edit distance ≤ 2) score lowest
5. Entity-specific boosts:
   - Publishers: verified > unverified
   - Books: with ISBN > without ISBN
   - Authors: with books > without books
6. Results sorted by relevance score descending

### Filtering
- **Entity type**: publisher, book, author (multi-select; default: all)
- **Category**: book categories, publisher specialties
- **Language**: Bengali, English, bilingual
- **Verification status**: verified, partially_verified, community_verified, needs_review
- **Publisher status**: active, inactive, defunct, suspended (applies to publisher results only)

### Pagination
- 20 results per page
- Cursor-based pagination for API, offset-based for UI
- Show total result count

### Autocomplete
- Triggers after 3 characters typed
- Returns top 10 suggestions across all entity types
- Suggestions show: name (bn/en), entity type, verification badge
- Debounce: 300ms
- Max 5 suggestions from each entity type

## Result Display

### Result Card Structure
```
┌─────────────────────────────────────┐
│ [Type Badge] [Verification Badge]   │
│ Name (en)                           │
│ নাম (bn)                            │
│ Brief excerpt / subtitle            │
│ Additional fields (entity-specific) │
└─────────────────────────────────────┘
```

### Grouping
Results are grouped by entity type with section headers:
```
Publishers (12)    Books (45)    Authors (8)
```

Each group shows up to 5 results initially with "Show all X results" link.

## Empty / Edge Cases

| Scenario | Behavior |
|----------|----------|
| Empty query | Show search tips and popular searches |
| No results | "No results found" with suggestions, search tips, and links to browse |
| Very long query (200+ chars) | Truncate to 200, show warning |
| Special characters | Sanitize; preserve Bengali and Arabic script |
| Network error | "Search unavailable" with retry button |
| Slow response (3s+) | Show loading state with "Still searching..." message |
| Zero results after filter change | Show "No results match your filters" with clear filter button |
