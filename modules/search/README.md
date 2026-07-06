# Search Module

## Purpose

Provides full-text search and discovery across all tProkash entities — publishers, books, authors, bookstores, datasets, and beyond. Abstracts the search engine implementation from the rest of the system.

## Responsibilities

- Full-text indexing of entities from all modules
- Search query parsing, ranking, and result formatting
- Faceted search and filtering
- Autocomplete and suggestion service
- Search index management (rebuild, update, optimize)
- Cross-entity search (unified results across types)

## Owned Data

- `search_index` — Search index entries (denormalized for search)
- Search configuration, synonyms, stop words

## Dependencies

- `core` — Base types, ID generation
- All domain modules — Consumes entity data for indexing

## Public Interfaces

- Search: `search(query, filters, page)` / `autocomplete(prefix)`
- Index management: `indexEntity(entityType, entityId)` / `reindexAll` / `clearIndex`
- Suggestions: `getSuggestions(query)` / `getPopular`

## Future Features

- Advanced query syntax (boolean, proximity, field-specific)
- Spelling correction and fuzzy search
- Personalized search results
- Search analytics and trending
- Vector search for semantic similarity

## Out of Scope

- Entity CRUD operations
- Dataset packaging and release (see `datasets` module)
- API request routing (see `api` module)
- User interface components
