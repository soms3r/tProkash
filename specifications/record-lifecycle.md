# Record Lifecycle Management

**Document ID:** SPEC-RLCM-001  
**Version:** 1.0  
**Status:** Approved  
**Last Updated:** 2026-07-06

---

## 1. Purpose

Define how records are created, curated, published, maintained, deprecated, and purged over their full lifespan within the tProkash publishing ecosystem. This specification governs all lifecycle operations and establishes quality, audit, and data integrity requirements.

## 2. Scope

All entity records across every content type in the tProkash system, including but not limited to publisher records, book records, author records, series records, and work records.

---

## 3. Lifecycle Stages

### 3.1 CREATION

Records enter the system through one of four channels:

| Channel | Description | Default Verification |
|---|---|---|
| Manual | Direct entry by a Contributor or above via the web interface | draft |
| Import | Bulk import from structured data sources (CSV, JSON, XML) | draft |
| API | Third-party integration via the public API | draft |
| Community | Public submission from unverified users (Guest role) | pending_review |

All creation methods enforce the same baseline requirements:

- Default state: DRAFT
- Initial verification_status: draft
- Required audit fields: `created_by` (user ID), `created_at` (UTC timestamp)
- Minimum required fields per entity type are enforced at creation time
- Duplicate detection runs synchronously before finalizing creation

### 3.2 CURATION

The curation stage transforms a raw record submission into a verified, publishable entity.

**Review and Approval Process:**

1. Record enters SUBMITTED state and appears in the review queue
2. Reviewer claims the record (transition to UNDER_REVIEW)
3. Reviewer evaluates against the quality checklist:
   - All required fields populated with valid data
   - At least one verifiable source attached
   - No conflicting information with existing published records
   - Compliance with entity-specific formatting rules
4. Reviewer issues one of: Approve, Request Changes, or Return to Draft

**Verification and Confidence Scoring:**

Each record carries a confidence score (0–100) calculated from:
- Source quality and quantity (weight: 40%)
- Cross-referencing with existing records (weight: 30%)
- Reviewer assessment (weight: 20%)
- Historical accuracy of the contributor (weight: 10%)

Records with confidence >= 90 may be eligible for auto-publishing.

### 3.3 PUBLICATION

Publication transitions a record from the curation pipeline to public visibility.

- Trigger: Editor or Administrator executes the Publish action on an APPROVED record
- Dataset inclusion: the record is added to all applicable active datasets
- Search index: the record is indexed and becomes discoverable via search
- Public visibility: the record appears on public profile pages and API responses
- Notification: the creator receives a record published notification
- Side effect: all related aggregate counts are recalculated

### 3.4 MAINTENANCE

Once published, records enter a continuous maintenance cycle.

**Scheduled Re-verification:**

Every published record is scheduled for re-verification 12 months after the last review date. The system:

1. Flags the record for re-verification
2. Assigns a reviewer from the pool
3. Tracks completion against the 30-day SLA
4. If verification passes, the schedule resets for another 12 months
5. If verification fails, the record transitions to UPDATED with a confidence penalty

**Change Request Handling:**

External parties may submit change requests against published records. Each request:

- Creates a shadow copy of the record in DRAFT state
- Links the draft to the published record as a change proposal
- Follows the standard review workflow
- On approval, merges changes into the published record and logs the diff

**Conflict Resolution:**

When two records contain contradictory information, the system:

1. Flags both records with a conflict marker
2. Notifies the assigned reviewers for each record
3. Escalates to an Editor for adjudication
4. The Editor selects the authoritative source or merges information
5. The non-authoritative record is updated or deprecated

**Version Tracking:**

Every edit to a published record creates a version entry recording:
- `version_number` (auto-incremented)
- `changed_fields` (list of modified field paths)
- `previous_values` (snapshot)
- `changed_by` (user ID)
- `changed_at` (UTC timestamp)
- `change_reason` (free text)

### 3.5 DEPRECATION (ARCHIVED)

Records enter the ARCHIVED state when they are no longer active but must be retained for historical reference.

**When to Archive:**
- The referenced publisher or source is defunct
- The dataset has been superseded by a newer edition
- The record is a confirmed duplicate that was merged
- The record falls outside the current scope of tProkash
- The publisher has requested removal (but the data must be retained for provenance)

**Archive Effect:**
- Removed from all active datasets
- Excluded from search results and public listings
- Retained in the database with full change_history
- Accessible only via direct link to Administrators and Editors
- API responses exclude archived records by default (opt-in query parameter available)

**Unarchive Process:**

An Editor or Administrator may restore an archived record. Restoration transitions the record to DRAFT, requiring full re-verification before it can be published again.

### 3.6 PURGE

Physical deletion is a rare, irreversible action with strict safeguards.

**Conditions for Purge:**
- Record must be in ARCHIVED state for more than 3 years
- Record must have no existing references from other active records
- Purge must be approved by an Administrator (two-factor confirmation required)
- A purge reason must be documented

**Audit Preservation:**

Even after purge, an immutable audit entry remains recording:
- Original record ID, title, and type
- Purge date, approver, and reason
- Reference to the last known state (preserved in audit archive)

---

## 4. SLA Requirements

| Stage | SLA Limit | Measurement |
|---|---|---|
| DRAFT → SUBMITTED | No limit | N/A |
| SUBMITTED → UNDER_REVIEW | < 24 hours | Calendar hours from submit to claim |
| UNDER_REVIEW → Decision | < 48 hours (simple), < 5 days (complex) | Calendar hours from claim to approve/return |
| APPROVED → PUBLISHED | < 24 hours | Calendar hours from approval to publish |
| NEEDS_CHANGES → Response | < 7 days | Calendar days from request to resubmit |
| Re-verification completion | < 30 days | Calendar days from trigger |

## 5. Notifications

Every state change triggers targeted notifications:

| Transition | Notified Parties | Message Content |
|---|---|---|
| SUBMITTED | Review queue | New record awaiting review |
| UNDER_REVIEW | Creator | Your record is being reviewed |
| NEEDS_CHANGES | Creator | Changes requested with instructions |
| APPROVED | Creator, Editor | Record approved, pending publication |
| PUBLISHED | Creator | Your record has been published |
| REJECTED (returned) | Creator | Record returned with reason |
| ARCHIVED | Creator, Editor | Record has been archived |
| Purge complete | Administrator | Record permanently deleted |

## 6. Examples

**Example 1: Community Submission to Archive**
A community member submits a publisher record. It passes through SUBMITTED → UNDER_REVIEW → NEEDS_CHANGES → SUBMITTED → UNDER_REVIEW → APPROVED → PUBLISHED. After five years, the publisher goes defunct and an Editor archives the record. Three years later, an Administrator purges it.

**Example 2: Multi-cycle Book Record**
A book record is submitted with incomplete metadata. The reviewer requests changes twice before approving. Upon publication, an editor notices a missing ISBN and triggers an edit (PUBLISHED → UPDATED → PUBLISHED). The record is re-verified seven months later during a scheduled maintenance cycle.

**Example 3: Duplicate Merge and Archive**
Two author records exist for the same person. An Editor merges the secondary record into the primary, then archives the secondary record. The merge is recorded in both records' change histories.

## 7. Future Considerations

- **Record versioning and diff history** allowing full rollback to any previous version
- **Lifecycle analytics dashboard** providing real-time metrics on queue sizes, SLA compliance, and reviewer performance
- **Automated lifecycle transitions** for low-risk records using configurable confidence thresholds
- **Bulk lifecycle operations** for dataset-wide updates, deprecations, and purges
- **Lifecycle hooks** enabling custom plugins to execute logic at specific transition points
