# AI Module

## Purpose

Provides AI-powered features for the tProkash ecosystem — automation assistance, data enrichment, natural language search, and intelligent recommendations.

## Responsibilities

- Automated data enrichment (entity extraction from text, classification)
- Natural language query processing
- Recommendation engine (books, publishers, authors)
- Duplicate detection and fuzzy matching
- Content summarization and description generation
- ML model management (training, deployment, versioning)

## Owned Data

- ML model metadata and versions
- Embedding vectors (if applicable)
- Training datasets references
- Inference results and confidence scores

## Dependencies

- `core` — Base types, ID generation
- `catalog` — Book/author data for enrichment and recommendations
- `directory` — Publisher data for enrichment
- `search` — Integration with search suggestions and ranking
- `community` — Review data for recommendation signals
- `analytics` — Usage patterns for personalization

## Public Interfaces

- Enrichment: `suggestFields(entityType, partialData)` / `classifyEntity(entityId)`
- Recommendations: `getRecommendations(userId, context)` / `getSimilar(bookId)`
- NLP: `queryToSearch(naturalLanguageQuery)` / `summarize(text)`
- Dedup: `findDuplicates(entityType, candidateId)` / `mergeSuggestions`
- Model: `getModelInfo(modelId)` / `invokeModel(modelId, input)`

## Future Features

- Automated data quality scoring
- Intelligent form auto-completion for data entry
- Semantic book search
- Publisher and author disambiguation
- AI-powered moderation assistant

## Out of Scope

- Core search indexing and retrieval (see `search` module)
- Dataset generation (see `datasets` module)
- User authentication (see `identity` module)
- General-purpose AI infrastructure
