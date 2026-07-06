# Data Verification Standard

## Purpose

Define how data is classified by verification status and confidence level, ensuring that consumers of tProkash data can make informed decisions about the reliability of any given fact. This standard establishes a consistent framework for moving data through the verification lifecycle and assigning quantitative confidence scores.

## Scope

This standard applies to all entity records in the tProkash database, including publishers, books, authors, editions, series, and any supplementary entities. It governs the verification status workflow and the confidence level calculation for every fact stored in the system.

## Definitions

- **Verification Status**: An enumerated label indicating the current stage of the verification lifecycle for a record.
- **Confidence Level**: A numeric score (0-100) representing the system's calculated confidence in the accuracy of a fact or record.
- **Verifier**: An authorized user or automated process that can change the verification status of a record.
- **Evidence**: Any source, document, or data point used to support or refute a fact's accuracy.

### Verification Statuses

| Status | Description |
|---|---|
| `draft` | Unreviewed entry, not yet ready for publication. Visible only to the creator and supervisors. |
| `pending` | Submitted for review, awaiting verification action. Visible to verifiers. |
| `verified` | Confirmed accurate by an authorized verifier. Visible to all users. |
| `partially_verified` | Some facts confirmed, others still pending or conflicting. Visible to all users with caveats. |
| `rejected` | Determined to be inaccurate or unreliable. Not displayed in public-facing outputs. |
| `archived` | Previously verified data that is now historical (e.g., out-of-print edition, renamed publisher). Retained for reference. |

### Confidence Levels

| Range | Classification | Description |
|---|---|---|
| 0-20 | Unverified | Community submitted without evidence, or hearsay. |
| 21-40 | Low | Single source, unverified. One source of any type with no verification action taken. |
| 41-60 | Moderate | Single source, verified. One source that has been checked by a verifier. |
| 61-80 | High | Multiple sources, consistent. Two or more independent sources reporting the same fact. |
| 81-95 | Very High | Multiple independent authoritative sources. At least two primary sources (official website, government registry, ISBN agency) in agreement. |
| 96-100 | Authoritative | Government registry or official ISBN agency confirmation. Highest attainable confidence. |

## Rules

### Verification Status Transitions

The following transitions are permitted:

```
draft ──submit──> pending ──verify──> verified
                      │                   │
                      ├──reject──> rejected  ├──partial──> partially_verified
                      │                   │
                      └──archive─> archived  └──archive──> archived

verified ──new_conflict──> partially_verified
partially_verified ──resolve──> verified
rejected ──reconsider──> pending
archived ──restore──> verified
```

1. A `draft` record can be submitted to `pending` by its creator.
2. A `pending` record can be moved to `verified`, `rejected`, or `archived` by an authorized verifier.
3. A `verified` record can be downgraded to `partially_verified` if new contradictory evidence appears.
4. A `partially_verified` record can be upgraded to `verified` once all conflicts are resolved.
5. A `rejected` record can be reconsidered and moved back to `pending` upon presentation of new evidence.
6. `archived` records can be restored to `verified` if they become relevant again.

### Confidence Score Calculation

Confidence is calculated automatically based on the following weighted formula:

```
base_score = 0
for each unique primary source:
    base_score += 25 (max 75)
for each unique secondary source:
    base_score += 10 (max 50)
if verifier_confirmed:
    base_score += 15
if evidence_contradicts:
    base_score -= 30
clamp(base_score, 0, 100)
```

A verified record can be downgraded to `partially_verified` if new contradictory evidence appears, regardless of its confidence score.

## Examples

### New Publisher Verification Flow

1. Operator creates publisher "Prokashoni" — status: `draft`, confidence: 0
2. Operator submits for review — status: `pending`, confidence: 0
3. Verifier checks official website (primary source) and confirms name — status: `verified`, confidence: 40
4. Verifier calls publisher for phone confirmation (second primary source) — confidence: 65
5. Verifier finds government registry listing (third primary source) — confidence: 90

### Confidence Score Calculation Example

Record: Publisher "Bangla Boi Ghar"
- Source 1: official_website (primary source, confirmed) → +25
- Source 2: social_media (secondary source) → +10
- Verifier confirmed → +15
- No contradictory evidence → -0
- Total: 25 + 10 + 15 = 50 → confidence: 50 (Moderate, single source verified)

If a second primary source (government_registry) is added:
- +25 for new primary source
- New total: 50 + 25 = 75 → confidence: 75 (High, multiple sources consistent)

### Downgrade on Contradictory Evidence

A previously verified publisher (confidence 90) receives a community submission claiming a different official name. The verifier marks this as new contradictory evidence. Status changes to `partially_verified`, confidence recalculates: 90 - 30 = 60.

## Future Considerations

- **Automated verification via API**: Integrate with government registries, ISBN agency APIs, and publisher systems to automatically verify facts without manual intervention.
- **Machine learning confidence scoring**: Train ML models on historical verification patterns to predict confidence scores and flag potentially inaccurate data before human review.
- **Crowd-sourced verification**: Allow trusted community members to contribute to the verification process, with their actions weighted by reputation.
- **Time-decay confidence**: Automatically reduce confidence scores for data that has not been re-verified after a configurable period, prompting re-verification workflows.
