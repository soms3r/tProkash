# Datasets Module

## Purpose

Manages versioned, packaged data releases — the export and publication of tProkash data as downloadable open datasets for public use.

## Responsibilities

- Dataset creation, versioning, and release management
- Dataset metadata management
- Dataset verification and quality checks
- Dataset export in multiple formats (JSON, CSV)
- Dataset distribution (download URLs, file hosting)
- Dataset deprecation and archival

## Owned Data

- `dataset` — Dataset metadata and release records
- Dataset files (JSON/CSV data + schemas + changelogs)
- Dataset verification status records

## Dependencies

- `core` — Base types, ID generation
- `directory` — Publisher data for dataset inclusion
- `catalog` — Book/author data for dataset inclusion
- `distribution`, `printing`, `bookstores` — Data for combined datasets
- `search` — Dataset discoverability

## Public Interfaces

- Dataset management: `createDataset` / `publishDataset` / `deprecateDataset`
- Dataset retrieval: `getDataset(datasetId, version)` / `listDatasets`
- Dataset download: `getDownloadUrl(datasetId, format)`
- Dataset search: `searchDatasets(query, filters)`

## Future Features

- Automated dataset generation on schedule
- Differential dataset updates
- Dataset subscription/notification
- Dataset citation generation
- Dataset usage analytics

## Out of Scope

- Real-time API access to data (see `api` module)
- Individual entity CRUD operations
- Data collection and import (see individual domain modules)
- Search engine functionality (see `search` module)
