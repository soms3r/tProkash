# Change Request Workflow

## Purpose

Define the process for requesting and applying modifications to existing published records within the tProkash ecosystem. This ensures all changes are tracked, reviewed appropriately, and auditable.

## Scope

All published entity records — publishers, authors, books, editions, series, and imprints — that are in the Approved or Published state. Draft and Needs Changes records are edited directly without this workflow.

## Workflow / Process

### Change Request Lifecycle

1. **Change Request Submission** — A user submits a change request describing the desired modification, the reason, and supporting sources.
2. **Triage** — A Reviewer assesses the change type and routes accordingly (standard or urgent).
3. **Review** — The change is evaluated against source verification and editorial standards.
4. **Decision** — The change is approved and applied, or rejected with a reason.
5. **Notification** — The requester and affected stakeholders are informed.

### Change Types

| Type | Definition | Review Required | Example |
|---|---|---|---|
| Correction | Fixing an error in the record | Standard if simple; urgent if typo | Fixing a misspelled author name |
| Enhancement | Adding missing data | Standard | Adding a missing ISBN |
| Update | Reflecting real-world changes | Standard | Updating a publisher's website URL |
| Merge | Combining duplicate records | Editor-only | Merging two publisher records |
| Deprecation | Marking a record as obsolete | Editor-only | Deprecating a defunct imprint |

### Self-Service vs. Reviewed Changes

| Role | Can Suggest Changes | Can Directly Edit |
|---|---|---|
| Contributor | Yes (goes to review queue) | Own drafts only |
| Verified Contributor | Yes | Any draft record |
| Reviewer | Yes | Any draft record |
| Editor | Yes | Any record (published or draft) |
| Administrator | Yes | Any record (published or draft) |

### Urgent Changes

The following change types qualify for urgent (fast-track) processing:

- Typographical errors in entity names or identifiers.
- Broken URLs in source or contact fields.
- Incorrect ISBN/ISSN values.
- Security-related changes (e.g., malicious links).
- Legal requests (e.g., copyright takedown).

Urgent changes are flagged with priority +3 in the review queue and have a 4-hour SLA.

## Decision Rules

### Change Tracking

Every change applied to a published record must be recorded in the record's `change_history` field. The history entry includes:

- Timestamp of the change.
- User ID who requested the change.
- User ID who approved/applied the change.
- Previous value and new value (for field-level changes).
- A human-readable change reason.

### Rejection Reasons

A change request may be rejected if:

- The proposed change is not supported by a verifiable source.
- The change would introduce duplicate data.
- The change conflicts with a pending change request on the same record.
- The change is out of scope (e.g., requesting deletion when deprecation is the correct process).

### Expiration

Change requests that require additional information remain open for 14 days. If the requester does not respond within that window, the change request is automatically closed.

## Examples

**Example 1: Correction by a Contributor.** A Contributor notices that an author's last name is misspelled ("Murakiami" instead of "Murakami"). They submit a change request with a screenshot of the author's official website as evidence. A Reviewer approves the correction, and the change is applied and logged in `change_history`.

**Example 2: Direct edit by an Editor.** An Editor notices that a publisher's website URL has changed from "http://example.com" to "https://example.com" (with HTTPS). The Editor directly edits the record, saves the change, and adds the audit note: "Updated URL to HTTPS version — verified redirect in place."

## Future Improvements

- Change diff viewer showing before/after comparison of any record at any point in its history.
- One-click rollback of any change with automatic reversion of all affected fields.
- Change request templates for common operations (e.g., "Update website URL," "Correct ISBN").
- Scheduled changes that take effect at a specified future date.
- Change request subscriptions allowing stakeholders to watch specific records.
