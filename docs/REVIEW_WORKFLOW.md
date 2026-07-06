# Review Workflow

## Purpose

Define the structured review process for incoming submissions, ensuring every record that enters the tProkash ecosystem is vetted for accuracy, completeness, and compliance before publication.

## Scope

All submissions from all channels — web form, bulk import, API, and email — are subject to this review workflow. It applies to Reviewer and Editor roles who perform assessments and make decisions on submission quality.

## Workflow / Process

### Review Lifecycle

1. **Queue Entry** — A validated, non-rejected submission enters the review queue with a priority score.
2. **Reviewer Assignment** — A Reviewer is assigned via round-robin, self-assignment, or admin directive.
3. **Initial Assessment** — The Reviewer opens the submission, performs a quick scan for completeness, and flags obvious issues.
4. **Detailed Review** — The Reviewer works through the entity-specific checklist (see below).
5. **Source Verification** — Attached sources are checked for accessibility, relevance, and authority.
6. **Decision** — The Reviewer selects one of the four decision options.
7. **Notification** — The submitter and relevant stakeholders are notified of the outcome.

### Queue Priority

Records are processed first-in-first-out, with the following priority modifiers:

- Verified Contributor submissions: +2 priority score
- Bulk imports (10+ records): +1 priority score
- Urgent corrections flagged by Editor: +3 priority score
- Previously rejected re-submissions: −1 priority score

### Review Checklist by Entity Type

**Publisher:**
- Legal name matches official registration or authoritative source
- Website URL resolves and matches the publisher's identity
- Bilingual name fields both populated (where applicable)
- Country and city are correct
- Contact information is verifiable

**Author:**
- Name matches official or widely accepted form
- Date of birth/death are plausible and sourced
- Biography is factual, neutral, and cited
- Author image (if provided) is appropriately licensed

**Book / Edition:**
- Title matches the work
- ISBN/ISSN is valid and matches the record
- Author/publisher relationship is correct
- Publication date is consistent with the edition
- Cover image is not copyrighted without license

## Decision Rules

### Decision Options

| Decision | Definition | Next State |
|---|---|---|
| Approve | Record meets all quality criteria | Under Review → Approved |
| Approve with Changes | Record is acceptable but minor edits applied by Reviewer | Applied, then Approved |
| Request Changes | Record has fixable deficiencies; submitter must revise | Needs Changes |
| Reject | Record cannot be accepted; fatal or irreparable issues | Needs Changes (with reason) |

### SLA Targets

| Record Type | SLA | Escalation After |
|---|---|---|
| Simple (publisher, author) | 48 hours | 72 hours |
| Complex (book + editions) | 5 business days | 7 business days |
| Bulk import (50+ records) | 10 business days | 14 business days |

### Escalation

If a Reviewer does not act within the SLA window, the submission escalates to a senior Reviewer or Editor. Escalated records are flagged and tracked separately in the editorial dashboard.

### Reviewer Assignment Rules

- Round-robin assignment distributes workload evenly across available Reviewers.
- Self-assignment allows Reviewers to claim records matching their expertise.
- Admin-assignment overrides all other methods for priority or sensitive submissions.

## Examples

**Example 1: Simple publisher review.** A Contributor submits a publisher record for "Penguin Random House" with a verified website and official registration number. The Reviewer checks the source, confirms the legal name matches the German trade register entry, and approves the record within 24 hours.

**Example 2: Bulk import of 100 books.** A Verified Contributor uploads 100 book records via CSV. The Reviewer is assigned with a 10-day SLA. During detailed review, 3 records are flagged for suspicious ISBNs. The Reviewer requests changes on those 3 and approves the remaining 97.

## Future Improvements

- Automated review for low-risk submissions from trusted Verified Contributors.
- AI-assisted review that flags potential issues for human Reviewers to examine.
- Reviewer performance dashboards with accuracy and throughput metrics.
- Collaborative review sessions for complex or disputed submissions.
- Integration with external authority APIs for real-time source verification.
