# Source Entity Model

## Purpose

The Source entity represents the origin of a piece of data within the tProkash ecosystem. Every fact stored about a publisher, book, author, or any other entity must be traceable back to a Source. This provides auditability, trust scoring, and the foundation for the verification workflow. Sources are immutable records of provenance — they capture *where* information came from, enabling downstream consumers to assess reliability.

---

## Table: `source`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `source_id` | `VARCHAR(15)` | `PK` | Unique identifier (e.g., `SRC000000000001`). Auto-generated via sequence. |
| `source_type` | `VARCHAR(255)` | `NOT NULL` | One of 12 enumerated source types (see below). |
| `title` | `TEXT` | — | Human-readable label for the source (e.g., `"Bangladesh National Library ISBN Database"`, `"Phone call with Ruhul Amin on 2026-03-15"`). |
| `url` | `TEXT` | — | Direct link to the source material where applicable. May be `NULL` for offline sources (phone, document). |
| `reference_number` | `VARCHAR(255)` | — | External identifier within the source system (e.g., ISBN registry ID, gazette notification number, library accession number). |
| `published_date` | `DATE` | — | The date the source material was published or issued. Not to be confused with `created_at`. |
| `author_name` | `VARCHAR(255)` | — | The person or organization that produced the source (e.g., `"Bangladesh National Library"`, `"Ruhul Amin"`). |
| `is_verified` | `BOOLEAN` | `DEFAULT FALSE` | Quick flag indicating whether the source itself has been verified as authentic. Derived from `verification_status`. |
| `confidence_score` | `INTEGER` | `0–100` | Baseline trustworthiness score for this source (see rubric below). |
| `verification_status` | `VARCHAR(50)` | `DEFAULT 'draft'` | Lifecycle state of the source record (see transitions below). |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Row creation timestamp. |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Row last-update timestamp. Updated automatically via trigger. |
| `deleted_at` | `TIMESTAMP` | `DEFAULT NULL` | Soft-delete timestamp. A non-NULL value means the record is logically deleted. |

---

## Source Types

The `source_type` column is restricted to one of 12 values. Each type has distinct trust characteristics and validation rules.

| # | Type | Description |
|---|---|---|
| 1 | `official_website` | The publisher's or author's own official website. Considered high trust if domain ownership can be verified. |
| 2 | `government_registry` | A government-maintained registry (e.g., ISBN agency, national library, copyright office, trade license database, NGO affairs bureau). Highest baseline trust. |
| 3 | `publisher_email` | Information obtained directly via email correspondence with the publisher. Requires sender domain verification. |
| 4 | `phone_confirmation` | Information confirmed through a phone conversation with a verified representative. Requires call notes and representative identity. |
| 5 | `isbn_agency` | Records from an ISBN registration agency (e.g., Bangladesh ISBN Agency, Nielsen UK). Trusted but may lag behind actual publication dates. |
| 6 | `book_fair_catalog` | Printed or digital catalog from a book fair (e.g., Ekushey Boi Mela, Dhaka Lit Fest). Useful for pre-publication data. |
| 7 | `publisher_document` | Physical or scanned documents provided by the publisher (e.g., letterhead, signed declaration, book sample imprint page). |
| 8 | `social_media` | Information posted on social media platforms (Facebook page, LinkedIn, Twitter/X). Lower baseline trust; requires corroboration. |
| 9 | `news_article` | Information extracted from a news or media article. Trust depends on publication reputation and author credibility. |
| 10 | `manual_entry` | Data entered manually by an internal operator without a known external source. Used for legacy data migration. Lowest baseline trust. |
| 11 | `community_submission` | Data submitted by a community member (reader, author, bookseller) through a public submission form. Requires verification before use. |
| 12 | `other` | Catch-all for source types not yet enumerated. Requires additional notes justifying the classification. |

---

## `confidence_score` — Definition & Calculation

The `confidence_score` is an integer 0–100 reflecting the **baseline trustworthiness of the source itself**, independent of the specific data it provides. This score is assigned at source creation and may be adjusted as more information about the source becomes available.

### Rubric

| Score Range | Category | Criteria |
|---|---|---|
| 90–100 | **Authoritative** | Government registry, ISBN agency with verified API access, or official website with confirmed domain ownership and HTTPS. |
| 70–89 | **Trusted** | Verified publisher email on record, phone confirmation with documented call log, publisher document on official letterhead. Book fair catalog from a known organizer. |
| 40–69 | **Moderate** | News article from a reputable publication, social media from an official verified account, manual entry with operator notes. |
| 10–39 | **Low** | Community submission from an unverified user, news article from an unknown source, social media from an unverified account. |
| 0–9 | **Unverifiable** | Anonymous submission, source with no identifiable author or organization, source that contradicts established facts. |

### Calculation Rules

1. **Initial assignment** is based on `source_type` using the default range midpoint (e.g., `government_registry` → 95, `community_submission` → 25).
2. **Adjustment factors** may shift the score up or down:
   - `+5` if `url` is present and resolves to a valid, HTTPS-enabled domain.
   - `+10` if `reference_number` is present and passes format validation for the given source type.
   - `-10` if the source is the sole source for a data point that contradicts other trusted sources.
   - `-20` if the source URL or contact information has been found invalid during a re-check.
3. The score must remain within 0–100 after all adjustments.

---

## `verification_status` — State Machine

Sources follow a simple lifecycle independent of the entity data they support.

```
                    ┌─────────────────────────────┐
                    │          draft               │
                    └──────────┬──────────────────┘
                               │ submit
                               ▼
                    ┌─────────────────────────────┐
                    │          pending             │
                    └──────────┬──────────────────┘
                               │ review
                               ▼
          ┌──────────────────────────────────────────┐
          │                                          │
          ▼                                          ▼
┌─────────────────────┐                  ┌─────────────────────┐
│     verified        │                  │     rejected        │
│  (is_verified=TRUE) │                  │  (is_verified=FALSE)│
└──────────┬──────────┘                  └─────────────────────┘
           │ re-check                    │
           ▼                             │
┌─────────────────────┐                  │
│   archived          │◄─────────────────┘
└─────────────────────┘
```

| Status | Meaning | Allowed Next States |
|---|---|---|
| `draft` | Source record created but not yet submitted for review. The data gatherer may still be collecting metadata. | `pending`, `archived` |
| `pending` | Source submitted for verification. A reviewer has been assigned. | `verified`, `rejected`, `draft` (return for revision) |
| `verified` | Source has been checked and confirmed authentic. `is_verified` is set to `TRUE`. Entity data linked to this source can use the source's confidence score. | `archived` |
| `rejected` | Source could not be verified or was found to be invalid. `is_verified` remains `FALSE`. | `archived` |
| `archived` | Terminal state. The source is no longer active. Used when a source is superseded by a more reliable one or is no longer relevant. | — |

---

## Entity-Source Junction: `entity_source`

The `entity_source` table provides polymorphic many-to-many linking between any entity in the system and its sources.

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│   source     │───────│  entity_source   │───────│   (entity)   │
└──────────────┘       └──────────────────┘       └──────────────┘
                         │           │
                     entity_type  entity_id
                     (VARCHAR)    (VARCHAR)
```

### Polymorphic Linking Explained

Because tProkash has multiple entity types (`publisher`, `book`, `author`, `series`, `edition`), and each can have multiple sources, a standard foreign key cannot span all entity tables. Instead, `entity_source` stores:

- `entity_type` — a string naming the entity table (e.g., `'publisher'`, `'book'`).
- `entity_id` — the primary key value from that entity table (e.g., a `publisher_id` or `book_id`).
- `source_id` — foreign key to the `source` table.

The combination `(entity_type, entity_id, source_id)` is unique, meaning the same source cannot be linked twice to the same entity.

### Application-Level Enforcement

Polymorphic associations cannot be enforced at the database constraint level. The application layer must:

1. Validate that the `entity_type` string corresponds to a known entity table.
2. Validate that `entity_id` exists in the referenced table.
3. Maintain a registry of valid `entity_type` values (e.g., `['publisher', 'book', 'author', 'series', 'edition']`).

---

## Examples

### Example 1: Publisher → Official Website

A data entry operator records the official website of "Somoy Prokash" from their verified domain `https://somoyprokash.com`.

**Source row:**
| Column | Value |
|---|---|
| `source_id` | `SRC000000000042` |
| `source_type` | `official_website` |
| `title` | `Somoy Prokash Official Website` |
| `url` | `https://somoyprokash.com` |
| `reference_number` | `NULL` |
| `published_date` | `NULL` |
| `author_name` | `Somoy Prokash` |
| `is_verified` | `TRUE` |
| `confidence_score` | `85` |
| `verification_status` | `verified` |

**Junction row(s):**
| entity_type | entity_id | source_id |
|---|---|---|
| `publisher` | `PUB000000000123` | `SRC000000000042` |

### Example 2: Book → ISBN Agency

An editor adds a new book "কালো তালিকা" by importing data from the Bangladesh ISBN Agency.

**Source row:**
| Column | Value |
|---|---|
| `source_id` | `SRC000000000089` |
| `source_type` | `isbn_agency` |
| `title` | `Bangladesh ISBN Agency — ISBN 978-984-93509-3-8` |
| `url` | `https://isbn.bangladesh.gov.bd/details/9789849350938` |
| `reference_number` | `978-984-93509-3-8` |
| `published_date` | `2026-01-15` |
| `author_name` | `Bangladesh ISBN Agency` |
| `is_verified` | `TRUE` |
| `confidence_score` | `95` |
| `verification_status` | `verified` |

**Junction rows:**
| entity_type | entity_id | source_id |
|---|---|---|
| `book` | `BOK000000000456` | `SRC000000000089` |

---

## Future Considerations

### Blockchain Source Verification

Sources could be anchored to a blockchain (e.g., a public permissioned ledger) by storing a content hash of the source metadata in a smart contract. A new column `blockchain_tx_hash` would store the transaction ID, enabling independent verification that the source existed at a point in time. This is particularly valuable for `government_registry` and `official_website` sources where tamper-evident timestamps are desirable.

### API-Trusted Sources

Certain source types (e.g., `isbn_agency`, `government_registry`) may expose APIs that allow automated data fetching. For these, the source record could store:

- `api_endpoint` — the base URL of the API.
- `api_key_reference` — a reference to a securely stored API key (never stored in plaintext).
- `last_sync_at` — timestamp of the last successful data pull.

A trusted source registry could automatically assign a higher `confidence_score` baseline when the API is confirmed working and returning valid data, and could trigger re-verification workflows when the API becomes unreachable.

### Source Reputation Network

Over time, sources that consistently provide accurate data (measured by low correction rates on their linked entities) could accumulate a *reputation score* that feeds back into `confidence_score`, allowing the system to dynamically adjust trust beyond the static rubric.
