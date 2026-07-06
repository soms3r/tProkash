# Duplicate Detection

## Purpose

Define the strategy, methods, and procedures for detecting and resolving duplicate records within the tProkash ecosystem. Preventing and managing duplicates is essential to maintaining data integrity and trust in the platform.

## Scope

All entity types — publishers, authors, books, editions, series, and imprints — are subject to duplicate detection. The policy applies at the point of submission, during bulk imports, and through periodic background deduplication sweeps.

## Workflow / Process

### Detection Methods

| # | Method | Condition | Action |
|---|---|---|---|
| 1 | Exact match | Same `legal_name_en`, `website_url`, `email`, `phone`, and `registration_number` | Auto-flag as duplicate |
| 2 | Fuzzy name match | Levenshtein distance < 20% of the longer string on `legal_name_en` | Flag for review |
| 3 | Registration number | Same `registration_number` in the same country | Auto-flag as duplicate |
| 4 | Website | Same `website_url` (normalized) | Auto-flag as duplicate |
| 5 | Email | Same `primary_email` | Auto-flag as duplicate |
| 6 | Phone | Same `primary_phone` (normalized) | Auto-flag as duplicate |
| 7 | ISBN prefix | Same `isbn_prefix` | Flag for review |
| 8 | Name + City | Same `legal_name_en` AND same city | Flag for review |

### Match Scoring System

Each detection method contributes a score. The total score determines the action:

| Score Range | Confidence | Action |
|---|---|---|
| 90–100 | Very High | Auto-reject submission, notify submitter |
| 70–89 | High | Flag for Editor review, block auto-approval |
| 40–69 | Medium | Flag for Editor review, allow conditional submission |
| 0–39 | Low | No action (likely distinct record) |

### Match Resolution Workflow

1. **Detection** — A potential duplicate is identified via one or more methods.
2. **Notification** — The submission is flagged, and an Editor is notified.
3. **Review** — The Editor examines both records side by side.
4. **Decision** — The Editor determines if the records are truly duplicates.
5. **Resolution** — Either the duplicate is rejected (with redirect to existing record) or both are kept (false positive).

### Merge Procedure

When an Editor determines that two records are duplicates:

1. Identify the more complete record (the "survivor").
2. Merge missing data fields from the duplicate into the survivor.
3. Merge all sources from the duplicate into the survivor.
4. Mark the duplicate as a redirect to the survivor.
5. Update the survivor's `change_history` with a note: "Merged duplicate record [ID] on [date]."
6. Notify the submitters of both records about the merge.

## Decision Rules

### What Is NOT a Duplicate

The following situations are not considered duplicates:

- A publisher changes its legal name (this is an update, not a duplicate).
- Two publishers share the same city but have different legal names.
- Two editions of the same book with different ISBNs.
- An author publishes under a pseudonym (different name, same person — handled via author aliases, not deduplication).

### False Positive Handling

If the duplicate detection system flags a false positive, the Editor documents the reason the records are distinct and may adjust the detection thresholds to prevent recurrence. The submitter is notified that their submission was approved despite the flag.

## Examples

**Example 1: Exact match duplicate.** Two Contributors independently submit "Penguin Random House LLC" with identical legal name, website, email, and registration number. The system auto-flags the second submission as a duplicate (score: 100). An Editor confirms and rejects the second submission, redirecting it to the existing record.

**Example 2: Name change (not a duplicate).** "O'Reilly Media Inc." rebrands as "O'Reilly Learning Platform LLC." A Contributor submits the new entity. The fuzzy name match flags it (score: 55). An Editor reviews, determines it is a legitimate name change, and processes it as an update to the existing record rather than a duplicate.

## Future Improvements

- Real-time duplicate check during data entry, showing potential matches as the user types.
- ML-based fuzzy matching that improves over time with Editor feedback on false positives.
- Automated source comparison to determine which record has better provenance.
- Scheduled background deduplication sweeps to find existing duplicates.
- Merge preview showing exactly what data will be transferred before confirming.
