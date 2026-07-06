# Verification Entity Model

## Purpose

The Verification entity records the outcome of a human or automated review process applied to a specific data point within the tProkash ecosystem. While a Source represents *where* data came from, a Verification represents *what was concluded* about that data's accuracy. Verifications are the mechanism by which raw data transitions into trusted, publishable information. Each verification links a reviewer, a source, and an entity record, capturing the judgment, confidence, and any notes produced during review.

---

## Table: `verification`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `verification_id` | `VARCHAR(15)` | `PK` | Unique identifier (e.g., `VRF000000000001`). Auto-generated via sequence. |
| `entity_type` | `VARCHAR(255)` | — | Polymorphic entity type (e.g., `publisher`, `book`, `author`). |
| `entity_id` | `VARCHAR(255)` | — | Primary key value of the entity being verified. |
| `verification_status` | `VARCHAR(50)` | `NOT NULL` | Current state in the verification lifecycle (one of 6 values). |
| `confidence_score` | `INTEGER` | `0–100`, `DEFAULT 0` | The reviewer's assessed confidence in the data's correctness (see rubric). |
| `verified_by` | `VARCHAR(15)` | `NOT NULL` | Foreign key to the `user` table identifying who performed the verification. |
| `source_id` | `VARCHAR(15)` | — | Foreign key to the `source` table identifying the source material used for verification. May be `NULL` when verification is based on reviewer expertise alone. |
| `notes` | `TEXT` | — | Free-text notes from the reviewer explaining their decision, citing evidence, or noting discrepancies. |
| `verified_date` | `DATE` | `DEFAULT CURRENT_DATE` | The date the verification decision was made. |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Row creation timestamp. |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Row last-update timestamp. Updated automatically via trigger. |
| `deleted_at` | `TIMESTAMP` | `DEFAULT NULL` | Soft-delete timestamp. |

### Constraints

- `(entity_type, entity_id)` is NOT unique — the same entity can have multiple verification records over time (re-verifications) or from different reviewers.
- `verified_by` references `user(user_id)`.
- `source_id` references `source(source_id)`.

---

## Verification Statuses

There are six verification statuses governing the lifecycle of a verification record.

### State Machine

```
                    ┌─────────────────────────────────────────────┐
                    │                   draft                     │
                    └──────────┬──────────────────────────────────┘
                               │ submit
                               ▼
                    ┌─────────────────────────────────────────────┐
                    │                  pending                    │
                    └──────────┬──────────────────────────────────┘
                               │ review
                               ▼
          ┌──────────────────────────────────────────────────────────────┐
          │                                                              │
          ▼                                                              ▼
┌─────────────────────────────────┐                  ┌─────────────────────────────┐
│          verified               │                  │         rejected            │
│  (fully confirmed)              │                  │  (determined inaccurate)    │
└────────────────┬────────────────┘                  └─────────────────────────────┘
                 │ partial                                              │
                 ▼                                                      │
┌─────────────────────────────────┐                                      │
│    partially_verified           │                                      │
│  (confirmed with reservations)  │                                      │
└────────────────┬────────────────┘                                      │
                 │ re-check or full confirmation                         │
                 ▼                                                       │
┌─────────────────────────────────┐                                       │
│          verified                │                                       │
└─────────────────────────────────┘                                       │
                                                                          │
                    ┌──────────────────────────────────────────────────────┘
                    │
                    ▼
          ┌──────────────────────────────────────────────────────────────┐
          │                         archived                              │
          │  (superseded by a newer verification, or no longer relevant)  │
          └──────────────────────────────────────────────────────────────┘
```

### Status Definitions

| Status | Definition | Allowed Transitions To |
|---|---|---|
| `draft` | Initial state. Verification record created but review not yet begun. The reviewer may be gathering materials. | `pending`, `archived` |
| `pending` | Verification submitted and queued for review. An automated or manual review process has been initiated. | `verified`, `partially_verified`, `rejected`, `draft` (returned for more info) |
| `verified` | Data has been fully confirmed as accurate. The reviewer asserts the data matches the source and is correct. This is the highest confidence state for end-data consumers. | `pending` (if new contradictory evidence emerges), `archived` |
| `partially_verified` | Some aspects of the data are confirmed, others are not. Example: a publisher's name and address are correct, but the phone number could not be confirmed. Reviewers must document what is and is not verified in `notes`. | `verified`, `rejected`, `pending` |
| `rejected` | The data has been determined to be inaccurate, fraudulent, or unverifiable. The entity record should be flagged or historical data preserved with the rejection rationale in `notes`. | `pending` (if new evidence surfaces), `archived` |
| `archived` | Terminal state. The verification is no longer active, typically because a newer verification supersedes it. The record is retained for audit purposes. | — |

---

## `confidence_score` — Rubric

The `confidence_score` is an integer 0–100 assigned by the reviewer (or calculated by an automated system) reflecting the degree of certainty that the verified data is correct.

### Detailed Rubric

| Score | Label | Criteria |
|---|---|---|
| 100 | **Certain** | Data confirmed against two or more independent, authoritative sources (e.g., government registry + official website). No ambiguity. |
| 90–99 | **Near-Certain** | Data confirmed against one authoritative source with no contradictions. All fields match exactly. |
| 75–89 | **High Confidence** | Data confirmed against a trusted source (e.g., publisher email). Minor discrepancies in non-critical fields (e.g., formatting of address) are acceptable. |
| 50–74 | **Moderate Confidence** | Data confirmed against a single source of moderate trust (e.g., book fair catalog, news article). Core fields (name, ISBN) match; secondary fields may be unverified. |
| 25–49 | **Low Confidence** | Data is plausible but confirmed against a low-trust source (e.g., community submission). Reviewer notes specific doubts or missing corroboration. |
| 1–24 | **Very Low Confidence** | Data is suspected to be correct but cannot be adequately confirmed. Source is unreliable or outdated. |
| 0 | **No Confidence** | Data was reviewed and found to have no reliable support. Typically assigned when a verification results in `rejected` status but the score is recorded for audit. |

### Assignment Rules

- **Human reviewers** assign the score based on the rubric above. The system may suggest a default based on `source.confidence_score` of the linked source.
- **Automated verifications** calculate the score algorithmically (e.g., cross-referencing multiple sources and computing a weighted average of source confidence scores).
- A verification's `confidence_score` should generally not exceed the linked source's `confidence_score` unless multiple corroborating sources are used.

---

## Relationship to Other Entities

### Polymorphic Entity Linking

Like `entity_source`, the verification table uses `entity_type` + `entity_id` to link to any entity in the system.

```
┌──────────────┐       ┌──────────────────────┐       ┌──────────────┐
│    user      │───────│    verification       │       │   source     │
│  (verified_by)       │                      │───────│  (source_id) │
└──────────────┘       └──────────────────────┘       └──────────────┘
                         │           │
                     entity_type  entity_id
                         │           │
                         ▼           ▼
                    ┌──────────────────────┐
                    │   (target entity)    │
                    │  publisher / book /  │
                    │  author / etc.       │
                    └──────────────────────┘
```

### User Relationship

`verified_by` references the `user` table. The user must have the `verifier` role or higher. The system records the user's identity so that:

- Verification decisions are accountable.
- A user's verification history contributes to their *verifier reputation* (a future feature).
- Conflicts between verifiers can be escalated by identifying the participants.

### Source Relationship

`source_id` is optional. When present, it links the verification to the specific source that was used to confirm the data. This creates a chain:

```
Source (provenance) → Verification (judgment) → Entity (fact)
```

When `source_id` is `NULL`, the verification is based on the reviewer's expert knowledge or implicit institutional knowledge that is not captured as a discrete source record.

---

## Verification Workflow

### Who Can Verify

| Role | Can Verify | Can Override | Can Archive |
|---|---|---|---|
| `data_entry` | No (can only create sources and entity records) | No | No |
| `verifier` | Yes | No (cannot override another verifier's verification) | No |
| `senior_verifier` | Yes | Yes (can override any verification) | Yes |
| `admin` | Yes | Yes | Yes |
| `system` (automated) | Yes | Configurable per entity type | No |

### Escalation Path for Conflicts

1. **First verification** — Assigned to any available `verifier`.
2. **Contradictory verification** — If a second verifier reviews the same entity and reaches a different conclusion, a flag is raised.
3. **Senior review** — A `senior_verifier` reviews both verification records and all linked sources, then issues a final determination.
4. **Override** — The senior verifier creates a new verification record (or updates the status of one) with their decision. The conflicting records are set to `archived`.
5. **Appeal** — The original verifier may appeal the senior decision to an `admin`, who reviews the entire case history.

---

## Re-Verification Policy

### Triggers for Re-Verification

| Trigger | Description | Action |
|---|---|---|
| **Time-based expiry** | Certain entity types have a maximum verification age. For example, phone numbers and addresses are re-verified every 12 months. | System creates a new `pending` verification and assigns it to a verifier. |
| **Source invalidation** | A source previously marked `verified` is later found to be invalid (e.g., website goes offline, email bounces). | All entities linked to that source via `entity_source` are flagged for re-verification. |
| **Data conflict** | Two or more sources provide contradictory data for the same field of the same entity. | A new verification is created with `pending` status, flagged as a conflict resolution task. |
| **Bulk import** | After a bulk data import or migration, all imported records are queued for initial verification. | Verifications are created with status `draft`, assigned in batches to verifiers. |
| **User report** | A community member or staff reports inaccurate data. | A new verification is created referencing the existing entity, with the report details in `notes`. |

### Re-Verification Process

1. The existing verification(s) for the entity are set to `archived`.
2. A new verification record is created with status `pending`.
3. The reviewer examines the entity data against the available sources.
4. If the data is still correct, the new verification is set to `verified` (effectively a renewal).
5. If the data has changed, the entity record is updated first (creating a `change_history` entry), then verified.

---

## Examples

### Example 1: Verifying a Publisher via Phone Confirmation

A verifier calls Somoy Prokash at the phone number on file and confirms their registered address.

**Verification row:**
| Column | Value |
|---|---|
| `verification_id` | `VRF000000000512` |
| `entity_type` | `publisher` |
| `entity_id` | `PUB000000000123` |
| `verification_status` | `verified` |
| `confidence_score` | `85` |
| `verified_by` | `USR000000000042` |
| `source_id` | `SRC000000000201` (the `phone_confirmation` source record) |
| `notes` | `Spoke with Mr. Ruhul Amin (Manager) at +880-2-1234567. Confirmed registered address: 38/2 Banglabazar, Dhaka-1100. Name matches trade license.` |
| `verified_date` | `2026-06-15` |

### Example 2: Rejecting a Community Submission

A community member submits a new publisher "ABC Publishers" claiming it is based in Dhaka. The verifier cannot find any matching trade license or website.

**Verification row:**
| Column | Value |
|---|---|
| `verification_id` | `VRF000000000513` |
| `entity_type` | `publisher` |
| `entity_id` | `PUB000000000789` |
| `verification_status` | `rejected` |
| `confidence_score` | `0` |
| `verified_by` | `USR000000000042` |
| `source_id` | `NULL` |
| `notes` | `Searched RJSC (Registrar of Joint Stock Companies) database — no match for "ABC Publishers". Searched Bangladesh National Library catalog — no ISBNs registered under this name. No website found. Submission appears fraudulent.` |
| `verified_date` | `2026-06-16` |

---

## Future Considerations

### Automated Verification

Certain verification tasks can be fully automated:

- **Domain verification**: Check DNS records to confirm the domain in a publisher's `official_website` source matches the organization name in a government registry.
- **ISBN validation**: Cross-reference ISBNs against the ISBN agency API automatically; if the API returns matching data, auto-verify.
- **Format validation**: Verify that phone numbers, postal codes, and email addresses conform to known formats for the declared country.

Automated verifications would have `verified_by` set to a special system user (e.g., `USR_SYSTEM`) and would typically achieve `confidence_score` values in the 60–80 range, requiring human review for higher scores.

### Reputation-Based Verification

Each verifier could accumulate a *verifier reputation score* based on:

- Number of verifications performed.
- Accuracy rate (how often their verifications are later overridden or contradicted).
- Senior verifier ratings of their work.

This reputation score could be used to:

- Weight a verifier's `confidence_score` contributions.
- Automatically escalate verifications from low-reputation verifiers to senior review.
- Grant auto-verification privileges to high-reputation verifiers (their `verified` status is accepted without additional review).

### Crowdsourced Verification

For low-risk data (e.g., book descriptions, author biographies), multiple community members could contribute verifications. A consensus algorithm (e.g., majority vote weighted by reputation) would determine the final `verification_status` and `confidence_score`.
