# Publisher Verification

**Version:** 1.0.0\
**Status:** Approved

---

## Purpose

Define the verification workflow for Publisher records. Verification establishes trust in publisher data before it is published or used.

## Verification States

```
┌─────────┐
│  DRAFT  │
└────┬────┘
     │ submit
     v
┌─────────┐
│ PENDING │
└────┬────┘
     │ review
     v
┌──────────┐
│ VERIFIED │ ← ─ ─ ─ ─ ─ ┐
└────┬─────┘              │
     │ new evidence       │
     v                    │
┌──────────────────┐      │
│ PARTIALLY_       │──────┘
│ VERIFIED         │  re-verify
└────────┬─────────┘
         │ unrecoverable
         v
┌──────────┐
│ REJECTED │
└──────────┘
```

## State Descriptions

| State | Definition | Duration |
|---|---|---|
| draft | Initial state. Record created but not yet submitted for verification. | Indefinite |
| pending | Record submitted for review. Awaiting verification action. | Target: < 7 days |
| verified | All facts confirmed accurate by authorized verifier against authoritative sources. | Indefinite, subject to re-verification |
| partially_verified | Some facts verified, others remain unconfirmed. Clearly marked per-field. | Maximum 90 days |
| rejected | Determined to be inaccurate, fraudulent, or unrecoverable. | Permanent |

## State Transitions

| From | To | Trigger | Required Action |
|---|---|---|---|
| draft | pending | Submit for review | Source references must be attached |
| pending | verified | Approve | At least one source verified |
| pending | partially_verified | Partial approval | Specify which fields are unverified |
| pending | rejected | Reject | Provide rejection reason |
| verified | partially_verified | New contradictory evidence | Document conflicting sources |
| partially_verified | verified | Re-verify | Confirm remaining fields |
| partially_verified | rejected | Unrecoverable errors | Document reason |
| verified | archived | Superseded | New version published |
| pending | draft | Return for revision | Provide revision notes |

## Verification Levels

Each verification state pairs with a minimum confidence_score:

| State | Minimum Confidence |
|---|---|
| draft | 0 |
| pending | 10 |
| verified | 70 |
| partially_verified | 30 |
| rejected | 0 |
| archived | (inherits from previous state) |

## Verification Methods

| Method | Description | Confidence Boost |
|---|---|---|
| website_match | Confirmed on official website | +40 |
| email_confirmation | Confirmed via direct email | +35 |
| phone_confirmation | Confirmed via phone call | +30 |
| government_registry | Found in government register | +50 |
| isbn_agency | Listed with ISBN agency | +45 |
| document_review | Physical document inspected | +35 |
| third_party_crossref | Confirmed by independent source | +25 |
| social_media_crossref | Consistent across social media | +10 |

## Re-Verification Policy

- Verified publishers are re-verified every 12 months.
- Re-verification may be triggered early by: user report, contradictory data, website domain expiry.
- Re-verification follows the same workflow but starts from the current verification state.

## Escalation

If a verification operator cannot determine the correct status:
1. Flag the record for senior reviewer.
2. Senior reviewer has 14 days to decide.
3. If no decision, the record remains at the current verification state.

## Related

- Verification model: `database/verification-model.md`
- Verification statuses defined in: `docs/DATA_VERIFICATION_STANDARD.md`
