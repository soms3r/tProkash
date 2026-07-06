# Approval Policy

## Purpose

Define who can approve what under which conditions, ensuring that every published record in the tProkash ecosystem has undergone appropriate oversight proportional to the trust level of the submitter.

## Scope

All approval decisions across the system, including new submissions, change requests, bulk imports, and corrections. This policy governs the relationship between user roles and the approval authority required to transition a record from Under Review to Approved (or from Needs Changes to Approved after revision).

## Workflow / Process

### Approval Levels

| Level | Submitter Role | Requires Approval By |
|---|---|---|
| Level 1 | Contributor | Any Reviewer |
| Level 2 | Verified Contributor | Any Reviewer (expedited) |
| Level 3 | Reviewer | A different Reviewer, or any Editor |
| Level 4 | Editor / Administrator | Self-approved (trusted) |

### Approval Sequence

1. Submission is reviewed and deemed acceptable by the assigned Reviewer.
2. The approval level is determined based on the submitter's role.
3. The approving party confirms the decision with a timestamp and optional notes.
4. The record transitions to Approved status.
5. The submitter is notified of the approval.

### Rejection Appeal Process

If a submission is rejected, the submitter may file an appeal within **30 calendar days** of the rejection notification.

**Appeal Workflow:**
1. Submitter submits an appeal with additional evidence or justification.
2. The appeal is assigned to an Editor (not the original Reviewer).
3. The Editor reviews the original submission, the rejection reason, and the new evidence.
4. The Editor may: uphold the rejection, overturn it and approve the record, or request further changes.
5. The appeal decision is final.

### Expedited Approval

Verified Contributor submissions at Level 2 receive expedited handling:

- They are placed at the front of the review queue (priority +2).
- The SLA is reduced by 50% compared to Level 1.
- The Reviewer may use a streamlined checklist for submitters with a proven track record.

## Decision Rules

### Conditional Approval Rules

- **Single-source submissions** must have the source verified as authoritative by the Reviewer.
- **Records with conflicting data** must have all sides documented before approval (see Editorial Guidelines).
- **Bulk imports** may be spot-checked at the Reviewer's discretion (minimum 10% sample size for Verified Contributors, 25% for Contributors).
- **Self-approval (Level 4)** requires the Editor or Administrator to leave an audit note explaining the change.

### Approval Decision Tree

```
Is the submitter an Editor or Administrator?
  → Yes → Self-approve with audit note.
  → No → Is the submitter a Reviewer?
    → Yes → Assign a different Reviewer or Editor.
    → No → Is the submitter a Verified Contributor?
      → Yes → Level 2: Any Reviewer (expedited).
      → No → Level 1: Any Reviewer (standard).
```

### Conflict of Interest

A Reviewer must not approve a submission if they have a personal or financial interest in the entity being submitted. The submission must be reassigned to another Reviewer or an Editor.

## Examples

**Example 1: Level 1 approval.** A Contributor submits a new publisher record. An assigned Reviewer completes the detailed review, confirms all sources, and approves the record. The record transitions to Approved and becomes visible in search results.

**Example 2: Level 4 self-approval.** An Editor notices a typo in a published author's name while browsing. They correct the name directly and self-approve the change, leaving an audit note: "Corrected spelling of 'Murakami' — verified against publisher website."

**Example 3: Appeal.** A Contributor's book submission is rejected because the ISBN failed validation. The Contributor appeals within 30 days, providing a screenshot of the book's copyright page showing the ISBN. An Editor reviews and overturns the rejection.

## Future Improvements

- Delegated approval: Verified Contributors may approve certain low-risk submissions.
- Approval groups: configure approval workflows by entity type or data domain.
- Automated approval for records submitted by highly trusted contributors with zero prior rejections.
- Two-factor approval for sensitive or high-profile records.
- Time-based auto-approval for low-risk submissions that remain unreviewed beyond extended SLA.
