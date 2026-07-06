# Core Module

## Purpose

Foundation module providing shared types, constants, identifiers, base validators, and utilities used by all other modules. Establishes the common language and structural primitives for the entire tProkash system.

## Responsibilities

- Prefixed ID generation and validation (PUB-, BOK-, PER-, etc.)
- Base entity interfaces and abstract types
- Shared value objects (bilingual name, address, contact method)
- Common validation rules and reusable validators
- Date/time handling and formatting
- Error types and standardized error responses
- Common constants (statuses, verification levels, languages)

## Owned Data

- Shared lookup tables shared across modules (language, country, city, tag, keyword)
- Base enums and type definitions

## Dependencies

- None (foundation module, all other modules depend on it)

## Public Interfaces

- ID service: `generate(prefix)` / `validate(id)` / `parse(id)`
- Entity base class/interface
- Shared validators (email, URL, phone, ISBN format)
- Common constants and enumerations

## Future Features

- Bilingual string utilities and transliteration helpers
- Audit trail base types
- Feature flag registry
- Event base types for cross-module events

## Out of Scope

- Business logic for any specific domain entity
- Database migrations or schema definitions for domain tables
- API request/response models (see `api` module)
- External service integrations
