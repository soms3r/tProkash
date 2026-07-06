# Datasets

## What belongs here

Versioned, packaged data releases. Each dataset is a complete snapshot of a subset of the tProkash database at a specific version. Datasets are organized by type and version number.

## Dataset format

Each dataset directory contains:

- `dataset.json` — metadata describing the dataset
- `data/` — the actual data files (JSON or CSV)
- `schema/` — schemas describing the data structure
- `CHANGELOG.md` — version history for the dataset

## Dataset types

- `publishers-v1/` — publisher directory
- `authors-v1/` — author registry
- `books-v1/` — book catalog
- `combined-v1/` — cross-referenced multi-entity dataset

## Naming

```
{entity}-v{major}.{minor}.{patch}/
```

## Dependencies

- Dataset metadata schema defined in `dataset-metadata-schema.md`
- JSON schemas in `specifications/`
- Templates in `data/templates/`

## Notes

TODO: Populate with initial dataset releases.
