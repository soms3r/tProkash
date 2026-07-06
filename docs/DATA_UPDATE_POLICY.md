# Data Update Policy

## Purpose

Define the rules, workflows, and approval requirements for modifying existing records in the tProkash publishing ecosystem. This policy ensures that all changes are tracked, attributable, reversible, and do not compromise data integrity.

## Scope

This policy applies to all entity records (publishers, books, authors, editions, series, and supplementary data) and all user roles (operators, verifiers, supervisors, administrators, community contributors). Every update action — whether a correction, enhancement, merge, or deletion — is governed by these rules.

## Definitions

- **Correction**: Fixing an error in an existing record (e.g., correcting a misspelled publisher name, fixing an invalid ISBN).
- **Enhancement**: Adding new data to an existing record without changing existing values (e.g., adding a social media link, adding a Bengali name).
- **Conflict Resolution**: Choosing between two or more conflicting values for the same field, supported by evidence.
- **Merge**: Combining two or more records into a single record when they are confirmed to represent the same real-world entity.
- **Change History**: An immutable log of every update made to a record, including before/after values, timestamp, operator identity, and reason.
- **Re-verification Workflow**: A process that re-evaluates a record's verification status after a substantive change to verified data.

## Rules

1. **Every update must record the reason in change_history.** No update may be performed without a human-readable reason explaining why the change was made.

2. **Every update must reference a source (existing or new).** If the update introduces new facts, attach new source records. If the update corrects existing data, reference the source that contains the correct value.

3. **Destructive updates (removing verified data) require supervisor approval.** Any change that removes or replaces data that has been verified must be reviewed and approved by a supervisor before execution. This includes deleting a verified field value, replacing it with contradictory data, or deleting a verified record.

4. **Merge two records only when they are confirmed duplicates.** Before merging, the operator must provide evidence that the records represent the same entity. Possible evidence includes matching ISBNs, matching official publisher registrations, or direct confirmation from the publisher. Merges are reversible for 30 days.

5. **Updated_at is automatically set on every change.** The system timestamp is recorded at the moment of update. Manual overrides of `updated_at` are prohibited.

6. **Deleted_at preserves history (soft delete).** Records are never permanently deleted from the active database. Instead, a `deleted_at` timestamp is set, and the record becomes invisible to normal queries but remains in the database for audit and recovery purposes.

7. **Corrections to verified data trigger a re-verification workflow.** When a `verified` record receives a substantive correction (change to a core field such as name, ISBN, or publisher), the record's status is automatically changed to `partially_verified` and a verification task is created for a verifier.

8. **Batch updates must be previewed.** Before executing a bulk update, the system must show a preview of all affected records and fields. The operator must confirm the preview before changes are applied.

## Update Approval Matrix

| Entity Type | Field Change Type | Operator | Verifier | Supervisor | Admin |
|---|---|---|---|---|---|
| Publisher | Name (non-verified) | Create draft | Verify | — | — |
| Publisher | Name (verified) | Propose change | — | Approve | — |
| Publisher | Address/Contact | Update directly | — | — | — |
| Publisher | Delete (soft) | — | — | Request | Execute |
| Book | ISBN | Create draft | Verify | — | — |
| Book | Title | Update directly | Re-verify if needed | — | — |
| Book | Author | Update directly | Re-verify if needed | — | — |
| Book | Delete (soft) | — | — | Request | Execute |
| Author | Name | Create draft | Verify | — | — |
| Author | Merge | Propose | — | Approve | Execute |
| Any | Source add | Update directly | — | — | — |
| Any | Source remove | — | — | Approve | Execute |

## Examples

### Correcting a Publisher Name

1. A verifier discovers that publisher "Prokashoni" is misspelled in the database as "Prokasnni".
2. Verifier creates a correction request with reason: "Spelling error in publisher name — official website shows 'Prokashoni'."
3. Source attached: official_website URL.
4. Since the publisher was `verified`, the system triggers re-verification workflow.
5. Supervisor reviews and approves.
6. Change is applied. Change_history records: old_value "Prokasnni", new_value "Prokashoni", operator "verifier_bk", reason "Spelling correction — confirmed via official website."

### Merging Duplicate Author Records

1. Operator finds two author records: "Rabi Thakur" and "Rabindranath Tagore" that refer to the same person.
2. Operator gathers evidence: both records have the same ISBN associated books, same birth date, and an authoritative source confirms the identity.
3. Operator creates a merge proposal with supporting evidence.
4. Supervisor reviews and approves.
5. System merges: primary record "Rabindranath Tagore" retains its ID; secondary record "Rabi Thakur" is redirected with a `merged_into` pointer.
6. All book associations from the secondary record are reassigned to the primary record.

### Adding an ISBN to an Existing Edition

1. An existing book record has no ISBN (marked as missing).
2. Operator finds the ISBN on the publisher's official website.
3. Operator updates the record, adding ISBN "9789841234567" with reason: "ISBN found on publisher website."
4. Source attached: official_website.
5. Since this is an enhancement (adding new data, not changing existing), no re-verification is needed.
6. Confidence score recalculates upward.

## Future Considerations

- **Collaborative editing with diff review**: Implement a wiki-style editing interface where changes are shown as diffs and must be reviewed by a second party before being applied to verified records.
- **Automated conflict detection**: Build systems that automatically detect conflicting information across records and flag them for resolution.
- **Schedule-based updates**: Allow scheduling of updates for future dates (e.g., updating a publisher name effective on a specific date).
- **Change rollback with one-click revert**: Provide a simple interface to roll back any change, automatically restoring the previous values and adding a reversal entry to change_history.
