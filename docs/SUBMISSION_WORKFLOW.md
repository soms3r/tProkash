# Submission Workflow

## Purpose

Define how new publisher, author, book, and other entity records enter the tProkash system. This document governs the intake process across all submission channels, ensuring data quality, consistency, and traceability from the moment a submission is initiated.

## Scope

All entity types within the tProkash ecosystem — publishers, authors, books, editions, series, and imprints — are covered by this workflow. It applies to every submission channel: manual web form, bulk CSV/JSON import, REST API, and community email submissions.

## Workflow / Process

### Submission Lifecycle

1. **Submission Initiation** — The user begins a submission through one of the available channels.
2. **Data Entry** — Record fields are populated manually, uploaded via file, or sent as a structured payload.
3. **Validation** — The system performs schema validation, required-field checks, bilingual name verification, and source requirement enforcement.
4. **Auto-Rejection** — Submissions failing critical checks are immediately rejected with a clear reason.
5. **Duplicate Check** — The submission is compared against existing records (see Duplicate Detection).
6. **Source Attachment** — The contributor attaches supporting sources (URLs, document uploads, citation references).
7. **Submission Confirmation** — A unique submission ID is generated and the contributor receives a confirmation with expected SLA.
8. **Queue for Review** — The submission enters the review queue, prioritized by contributor level.

### Submission Channels

| Channel | Description | Rate Limit |
|---|---|---|
| Web Form | Manual entry through the tProkash UI | Per-role daily limit |
| Bulk Import | CSV or JSON file upload | 10,000 records per file |
| API | Programmatic submission via REST endpoints | Token-based rate limiting |
| Email | Community submissions forwarded to ingest | 5 per day (unverified) |

### Validation Rules

- **Schema Validation**: All fields must match the expected data type, format, and length.
- **Required Fields**: Legal name, country, at least one contact method, source URL.
- **Bilingual Check**: For supported locales, both `_en` and `_local` name fields must be provided.
- **Source Requirement**: Every submission must cite at least one verifiable source.
- **ID Format**: Entity IDs must follow the pattern `pub-{uuid}`, `aut-{uuid}`, `bok-{uuid}`.

## Decision Rules

### Auto-Rejection Criteria

A submission is automatically rejected if any of the following conditions are met:

- Missing one or more required fields after submission.
- Duplicate detected via exact match (same `legal_name_en`, `website_url`, `email`, `phone`, and `registration_number`).
- Invalid entity ID format.
- No verifiable source provided.
- Contains prohibited content (see Moderation Policy).

### Submission Limits by Role

| Role | Daily Limit |
|---|---|
| Guest | 0 (no submission rights) |
| Contributor | 10 |
| Verified Contributor | 50 |
| Reviewer | Unlimited |
| Editor | Unlimited |
| Administrator | Unlimited |

## Examples

**Example 1: Web form submission by a Contributor.** A Contributor navigates to the "Add Publisher" page, fills in the required fields (legal name, country, website, email), attaches a source URL, and submits. The system validates, passes duplicate check, and assigns submission ID `SUB-2026-07-00042`. The contributor receives a confirmation email with an estimated 48-hour review SLA.

**Example 2: Bulk import by a Verified Contributor.** A Verified Contributor uploads a CSV containing 50 publisher records. The system validates each row, flags 2 rows with missing required fields, and accepts 48 records into the queue. The contributor receives a summary report showing 48 accepted, 2 rejected with reasons.

## Future Improvements

- API-based submission from partner distribution systems with automatic mapping.
- Webhook notifications for submission status changes.
- Pre-submission data enrichment via external authority databases (e.g., ISNI, VIAF, Wikidata).
- Real-time collaborative editing for complex submissions.
- Machine-assisted validation that suggests corrections before submission.
