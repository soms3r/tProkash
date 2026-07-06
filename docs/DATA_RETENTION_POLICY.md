# Data Retention Policy

## Purpose

Define how long different categories of data are retained in the tProkash publishing ecosystem and the conditions under which data may be purged. This policy balances the need for historical reference and audit capability with operational efficiency and storage management.

## Scope

This policy applies to all database records (entity data, source references, change history logs), audit logs, system backups, cached assets (cover images, documents), seed and test data, and any derived datasets or exports.

## Definitions

- **Retention Period**: The length of time a specific category of data is kept before it becomes eligible for purging or migration.
- **Purge**: Permanent and irreversible deletion of data from all systems, including backups. Purged data cannot be recovered.
- **Archive**: Migration of data to a lower-cost, lower-accessibility storage tier for long-term preservation. Archived data remains retrievable but is not available for normal queries.
- **Cold Storage**: Long-term storage on media that is not online and may require manual intervention to access (e.g., tape backup, offline hard drives).
- **Active Data**: Data that is available in the primary database for normal querying and operations.
- **Soft-Deleted Data**: Data that has been marked as deleted (via `deleted_at` timestamp) but is still physically present in the database.

## Rules

1. **Active data is retained indefinitely while relevant.** Records that have not been soft-deleted and remain relevant to the publishing ecosystem are retained in the active database without time limit.

2. **Soft-deleted data is retained for 3 years, then eligible for purge.** After 3 years from the `deleted_at` date, soft-deleted records may be permanently purged. Purge requires written approval from a database administrator.

3. **Audit logs (change_history) are retained for 7 years, then moved to cold storage.** After 7 years, audit logs are removed from the active database and archived in cold storage. Cold-stored logs remain retrievable within 5 business days.

4. **Backups: daily backups retained for 30 days, monthly for 12 months.** Daily backups older than 30 days are automatically replaced by newer backups. Monthly backups (first of each month) are retained for 12 months. Annual backups are retained indefinitely.

5. **Source references are retained indefinitely and are immutable.** Source records are never purged, even if all referencing records have been deleted. This ensures the provenance chain remains intact for audit purposes.

6. **Seed and test data may be purged after 90 days if not referenced.** Test data that is not referenced by any production record and is older than 90 days may be purged without special approval.

7. **Purge requires written approval and an audit trail.** Every purge operation must be documented in a purge request that includes: the data to be purged, the reason, the approving authority, and the date of execution. The purge record itself is retained indefinitely.

8. **Purging does not cascade to referenced data.** If a publisher record is purged, any books referencing that publisher remain in the database but the publisher reference becomes a broken link.

## Retention Schedule

| Entity Type | Active Retention | Soft-Delete Retention | Purge Policy |
|---|---|---|---|
| Publishers | Indefinite | 3 years | Purge with admin approval; blocks if referenced |
| Books | Indefinite | 3 years | Purge with admin approval; blocks if referenced by orders |
| Authors | Indefinite | 3 years | Purge with admin approval; blocks if referenced |
| Editions | Indefinite | 3 years | Purge with admin approval |
| Series | Indefinite | 3 years | Purge with admin approval |
| Source References | Indefinite | Not deleted | Never purged |
| Change History | 7 years (active) | N/A | Moved to cold storage after 7 years |
| Cover Images | Indefinite | 3 years after record deletion | Purge with record purge |
| Audit Logs (system) | 7 years (active) | N/A | Cold storage after 7 years |
| Daily Backups | 30 days | N/A | Automatically rotated |
| Monthly Backups | 12 months | N/A | Automatically rotated |
| Seed/Test Data | 90 days | N/A | Automatic purge after 90 days if unreferenced |
| User Accounts | Indefinite while active | 5 years after deactivation | Purge with admin approval |
| Session Data | 24 hours | N/A | Automatically expired |

## Examples

### Purging a Publisher Soft-Deleted 4 Years Ago

1. Publisher "Old Imprints Ltd" was soft-deleted on 2022-03-15.
2. On 2026-07-06, the 3-year retention period has passed (3,258 days).
3. Database admin initiates a purge request.
4. System checks: no active records reference this publisher — purge is unblocked.
5. Admin supervisor reviews and approves the purge request.
6. Purge is executed. The publisher record is permanently deleted. The source references that supported this publisher's data are retained indefinitely.
7. A purge audit record is created: "2026-07-06: Purge of publisher 'Old Imprints Ltd' (ID 1234). Approved by admin_supervisor."

### Archiving Audit Logs from 2019

1. Change history entries from 2019 are now 7+ years old.
2. An automated process selects all change_history records with `created_at < 2019-07-06`.
3. Records are exported to a structured file format (JSON) with full metadata.
4. The export is cryptographically signed and transferred to cold storage.
5. The cold storage location is recorded in the system manifest.
6. The records are deleted from the active database.
7. Estimated retrieval time: 3-5 business days.

### Cleaning Up Test Data

1. A bulk import test from 2026-04-01 created 500 test publisher records with a "test_" prefix.
2. On 2026-07-06, the 90-day retention period has passed.
3. System automatically flags these records for purge.
4. Admin reviews: none of the test records are referenced by production data.
5. Purge is executed automatically without additional approval (per rule 6).
6. 500 test records are permanently removed.

## Future Considerations

- **Legal holds for litigation**: Implement a legal hold mechanism that overrides standard retention policies when data is subject to a litigation hold or regulatory investigation. Held data cannot be purged until the hold is released.
- **Automated retention enforcement**: Build scheduled jobs that automatically enforce retention policies, generate purge proposals for admin review, and execute approved purges without manual intervention.
- **Granular retention per source type**: Allow retention periods to be configured per source type, so high-value authoritative sources may be retained longer than low-confidence community submissions.
- **Data disposal certification**: Generate cryptographically signed certificates for each purge operation, providing proof that data has been irreversibly destroyed in compliance with data protection regulations.
