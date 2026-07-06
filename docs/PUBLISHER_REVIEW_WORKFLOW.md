# Publisher Review Workflow

**Version:** 1.0.0\
**Status:** Approved

---

## Purpose

Standard operating procedure for reviewing and verifying Publisher records. This workflow is followed by verification operators.

## Prerequisites

- Operator has the "Reviewer" role or higher
- Publisher record exists with verification_status = "pending"
- Source references are attached to the record

## Review Steps

### Step 1: Open the Record

1. Locate the pending Publisher record.
2. Review the source material attached.
3. Open the publisher's website (if available).
4. Review all populated fields.

### Step 2: Verify Legal Name

1. Compare legal_name_bn and legal_name_en against the source.
2. If source is an official website, confirm the name matches.
3. If source is a government registry, the name must match exactly.
4. If source is a book fair catalog, cross-reference with another source.

**Pass:** Names match the source exactly.
**Fail:** Names differ from source.

### Step 3: Verify Website

1. Visit the website URL.
2. Confirm the site belongs to the publisher (logo, name, content match).
3. Check that the site is not a generic placeholder or under construction.
4. Record the domain as a source if not already done.

**Pass:** Active website clearly belonging to the publisher.
**Partial:** Website exists but minimal content.
**Fail:** Website does not exist or belongs to a different entity.

### Step 4: Verify Contact Information

1. If email is provided, send a verification email (optional for initial verification).
2. If phone is provided, call to confirm (optional for initial verification).
3. Cross-reference contact details with website.

**Pass:** Contact details match website and/or confirmed directly.
**Partial:** Contact exists but not independently verifiable.
**Fail:** Contact details clearly wrong.

### Step 5: Verify Business Status

1. Check if the publisher is actively publishing (recent books, website activity).
2. Search for recent news or book fair participation.
3. If no recent activity, mark as inactive with a note.

**Pass:** Evidence of publishing activity within last 2 years.
**Partial:** Existing but no recent activity.
**Fail:** Evidence of permanent closure.

### Step 6: Check for Duplicates

1. Search for similar names.
2. Check fuzzy matches within the same city.
3. If a duplicate is found, flag for merge review.

**Pass:** No duplicates found.
**Fail:** Duplicate identified.

### Step 7: Assign Verification Status

Based on the evidence collected:

| Evidence Level | Status | Minimum Confidence |
|---|---|---|
| All facts confirmed from authoritative source | verified | 80 |
| Most facts confirmed, some gaps | partially_verified | 40 |
| Significant unverifiable claims | pending (return to collector) | — |
| Evidence of inaccuracy or fraud | rejected | 0 |

### Step 8: Assign Confidence Score

Calculate based on sources and verification method:

| Condition | Score |
|---|---|
| Government registry or ISBN agency match | 90-100 |
| Official website + email confirmation | 80-90 |
| Official website only | 60-75 |
| Book fair catalog + cross-reference | 50-65 |
| Book fair catalog only | 30-45 |
| Community submission with evidence | 20-35 |
| Community submission without evidence | 5-15 |
| Unverifiable | 0 |

### Step 9: Document the Review

1. Record the verification in the verification table.
2. Link to the source(s) used.
3. Write clear notes explaining the decision.
4. If rejected, explain exactly why.

### Step 10: Submit

1. Save the verification record.
2. The system updates publisher.verification_status automatically.
3. If verified, the publisher becomes visible in public datasets.
4. Notify the original data collector of the result.

## Common Reasons for Rejection

| Reason | Description |
|---|---|
| Duplicate record | Publisher already exists in the database |
| Not a publisher | Entity is a printer, bookstore, or similar, not a publisher |
| Fabricated data | Information cannot be verified and appears invented |
| Name mismatch | Legal name does not match any official record |
| Defunct without evidence | Claimed defunct but no evidence provided |

## SLA Targets

- Initial review: within 7 days of submission
- Re-verification: within 14 days of trigger
- Rejected record appeal: within 30 days

## Related

- Publisher verification: `specifications/publisher-verification.md`
- Import workflow: `scripts/import-workflow.md`
- Verification standard: `docs/DATA_VERIFICATION_STANDARD.md`
