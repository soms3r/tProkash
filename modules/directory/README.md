# Directory Module

## Purpose

Manages the core publisher directory — the primary knowledge base of verified Bangladeshi publishers, their imprints, contact information, and operational status. This is the flagship module of tProkash.

## Responsibilities

- Publisher entity CRUD and lifecycle management
- Imprint management (trade names under a publisher)
- Publisher status tracking (active, inactive, defunct, suspended)
- Publisher verification workflow
- Publisher services catalog
- Publisher identifier management (registration number, BIN, TIN, ISBN prefix)

## Owned Data

- `publisher` — Publisher entities
- `imprint` — Imprints belonging to publishers
- `publisher_address`, `publisher_contact` — Contact details
- Entity sources and verification records for publishers

## Dependencies

- `core` — Base types, ID generation, validators
- `identity` — User/role management for workflow actions

## Public Interfaces

- Publisher CRUD: `createPublisher` / `updatePublisher` / `getPublisher` / `listPublishers`
- Publisher search: `searchPublishers(query, filters)`
- Imprint management: `addImprint` / `updateImprint` / `listImprints`
- Verification: `submitForVerification` / `approvePublisher` / `rejectPublisher`
- Status transitions: `changePublisherStatus(publisherId, newStatus)`

## Future Features

- Publisher merge/deduplication
- Bulk publisher import with validation
- Publisher relationship graph
- Historical status change tracking
- Publisher claim and verification portal

## Out of Scope

- Book catalog management (see `catalog` module)
- Printing relationships (see `printing` module)
- Distribution relationships (see `distribution` module)
- Publisher data collection UI
