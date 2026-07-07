---
title: Verification Framework
status: Draft
number: RFC-0008
version: 0.1
authors:
  - tbd
created: 2026-07-06
---

# RFC-0008: Verification Framework

## 1. Vision

**Verification** inside tProkash is the process of establishing,
recording, and maintaining confidence that a piece of data is authentic,
accurate, and currently valid. Every entity in the platform —
Organization, Publisher, Author, Book, Edition, ISBN, Printer,
Distributor, Bookstore, Library, User, Address, Contact, Media Asset —
requires verification at some level.

The Verification Framework is the universal, module-independent system
for all verification activity. It does not care what is being verified
or why. It provides:

- A standard object model for verification events, evidence, and
  outcomes.
- Immutable, append-only verification history.
- Multiple verification levels (Basic → Standard → Enhanced →
  Accredited → Trusted) that any module can adopt or extend.
- Multiple verification methods (email, SMS, document review, registry
  lookup, digital signature, etc.) that can be composed arbitrarily.
- Confidence scoring separate from trust levels.
- Automated and human-in-the-loop workflows.
- Scheduled expiration, renewal, and re-verification.
- Support for any target type — entities, value objects, identifiers.

This framework is the spine of the platform's trust model. Every
verification that happens anywhere in tProkash flows through it.

## 2. Goals

- Define a universal, module-independent Verification object model that
  any entity or value object can use.
- Support **six verification states** (UNVERIFIED, PENDING, VERIFIED,
  REJECTED, EXPIRED, REVOKED) that every verification target transitions
  through.
- Support **five verification levels** (Basic, Standard, Enhanced,
  Accredited, Trusted) with progressive requirements.
- Support **14 verification methods** (Email, SMS, Phone Call, Website
  Ownership, DNS Record, Government Registry, Business Registry, ISBN
  Agency, Manual Review, Community Validation, Digital Signature, API
  Verification, Document Review, Custom) that can be combined per
  verification event.
- Define an **Evidence model** with cryptographic hashing, retention
  policies, and immutable storage.
- Make every verification event **immutable and append-only**.
- Define **expiration, renewal, revocation, and re-verification** as
  first-class lifecycle transitions.
- Separate **confidence scoring** (how sure are we about this specific
  evidence?) from **trust level** (what is the overall standing of the
  entity?).
- Support **automated verification workflows** and **human review
  workflows** with the same object model.
- Define audit requirements for compliance and dispute resolution.

## 3. Non-Goals

- Implement database schema, migrations, or repositories.
- Define REST endpoints or GraphQL resolvers.
- Create UI components or verification dashboards.
- Implement specific integration with any external verification
  provider (designed to accommodate them, not implement them).
- Define module-specific verification rules (those belong in the
  module's own RFC, referencing this framework).
- Implement real-time verification or notification delivery.
- Define legal or regulatory compliance requirements (those are
  jurisdiction-specific and deployment-specific).
- Implement biometric verification or identity document scanning.
- Define a full KYC/KYB workflow (this framework provides the
  primitives; specific workflows are defined per module).

## 4. Verification Philosophy

The framework is built on five principles:

### 4.1 Verification is Universal

Any piece of data can be verified. An Organization, an ISBN, an Address,
a Contact method. The same framework handles them all. The framework
does not distinguish between entity verification and value verification.

### 4.2 Verification is Append-only

Every verification event is recorded as an immutable, timestamped,
signed entry. History is never rewritten. Past verification events
remain visible even when superseded. This is essential for audit,
compliance, and dispute resolution.

### 4.3 Verification is Independent

- Verification is independent of the entity lifecycle. A SUSPENDED
  entity may have VERIFIED identifiers.
- Verification is independent per method. An EMAIL may be VERIFIED
  while a PHONE for the same contact is UNVERIFIED.
- Verification is independent per target. An Organization may be
  VERIFIED while one of its Addresses is UNVERIFIED.

### 4.4 Verification is Decomposable

A single verification event may involve multiple methods, multiple
evidence objects, and multiple verifiers. The framework composes these
into a single result without losing the granularity.

### 4.5 Verification is Temporal

Verification is a point-in-time assertion. It always has an associated
timestamp, and it always expires unless explicitly configured as
non-expiring. The framework treats time as a first-class dimension.

## 5. Verification Object Model

The framework has three core objects: **VerificationEvent** (a single
verification attempt), **VerificationRecord** (the aggregate state of
a target's verification), and **Evidence** (the supporting material).

### VerificationEvent

```jsonc
{
  "id": "uuid",
  "targetType": "string",
  "targetId": "uuid",
  "targetRef": "string?",
  "level": "BASIC | STANDARD | ENHANCED | ACCREDITED | TRUSTED",
  "state": "PENDING | VERIFIED | REJECTED | EXPIRED | REVOKED",
  "methods": ["VerificationMethod"],
  "evidence": ["Evidence"],
  "verifier": {
    "actorType": "SYSTEM | HUMAN",
    "actorId": "uuid",
    "actorLabel": "string?"
  },
  "workflow": "AUTOMATED | HUMAN_REVIEW | HYBRID",
  "confidence": 0.95,
  "notes": "string?",
  "occurredAt": "datetime",
  "recordedAt": "datetime",
  "expiresAt": "datetime?",
  "supersedes": "uuid?",
  "supersededBy": "uuid?",
  "audit": "AuditMetadata"
}
```

| Field | Description |
|-------|-------------|
| `targetType` | The type of target being verified (e.g., "Organization", "Email", "ISBN"). |
| `targetId` | The UUID of the target entity or value object. |
| `targetRef` | An optional human-readable reference (e.g., the email address itself). |
| `level` | The verification level being attempted or achieved. |
| `state` | The outcome state of this event. |
| `methods` | The verification methods used in this event. |
| `evidence` | The evidence collected or referenced. |
| `verifier` | Who or what performed the verification. |
| `workflow` | Whether this was automated, human-reviewed, or hybrid. |
| `confidence` | A confidence score (0.0 – 1.0) for this specific event. |
| `supersedes` | The previous event that this event replaces. |
| `supersededBy` | The event that replaced this one (populated when superseded). |

### VerificationRecord

```jsonc
{
  "targetType": "string",
  "targetId": "uuid",
  "currentState": "UNVERIFIED | PENDING | VERIFIED | REJECTED | EXPIRED | REVOKED",
  "currentLevel": "BASIC | STANDARD | ENHANCED | ACCREDITED | TRUSTED",
  "currentConfidence": 0.0,
  "verifiedAt": "datetime?",
  "expiresAt": "datetime?",
  "lastCheckedAt": "datetime?",
  "eventCount": 42,
  "latestEvent": "uuid",
  "history": ["VerificationEvent"]
}
```

`VerificationRecord` is a read-only projection derived from the
immutable event stream. It is never stored directly; it is computed from
the chain of `VerificationEvent` entries.

### Evidence

See Section 11 (Evidence Model) for the full Evidence schema.

## 6. Verification Target Model

Any entity or value object can be a verification target. The framework
is agnostic to the target type.

### Target Types (Illustrative)

| Target Type | Examples |
|-------------|----------|
| Organization | Legal entity, company, institution |
| Publisher | Publishing identity |
| Author | Individual or collective author |
| Book | Published work |
| Edition | Specific edition of a work |
| ISBN | ISBN identifier |
| Printer | Printing company |
| Distributor | Distribution company |
| Bookstore | Retail outlet |
| Library | Library institution |
| User | Platform user account |
| Address | Physical or virtual address |
| Contact Method | Email, phone, WhatsApp, etc. |
| Contact | Contact entity |
| Media Asset | Logo, image, document |
| Identifier | Any GenericIdentifier |
| Slug | URL slug |
| Website | Website URL |
| Domain | Domain name |

### Targeting Mechanism

- Every target is identified by `(targetType, targetId)`.
- `targetType` is a string that maps to the domain type. It is
  extensible.
- A target may have multiple independent verification streams (e.g., an
  Organization may have one stream for identity verification and another
  for address verification).
- Verification streams are disambiguated by `(targetType, targetId,
  level)` or by the specific method used.

## 7. Verification States

```
UNVERIFIED
    │
    ▼
PENDING ──► VERIFIED ──► EXPIRED ──► PENDING (re-verify)
    │                      │
    └──► REJECTED          └──► REVOKED
```

### State Definitions

| State | Description |
|-------|-------------|
| **UNVERIFIED** | No verification has been attempted. This is the initial state for all targets. |
| **PENDING** | Verification is in progress. Evidence has been submitted or a verification request has been sent. Awaiting completion. |
| **VERIFIED** | Verification succeeded. The target has met the requirements for the specified level. |
| **REJECTED** | Verification failed. The evidence was insufficient, invalid, or the requirements were not met. |
| **EXPIRED** | A previous VERIFIED state has expired. The target must be re-verified to return to VERIFIED. |
| **REVOKED** | A previous VERIFIED state has been revoked by an Administrator or Verifier. This is a permanent state for the specific verification event (a new verification may be started). |

### State Transitions

| From | To | Trigger |
|------|----|---------|
| UNVERIFIED | PENDING | Verification request submitted. |
| PENDING | VERIFIED | All requirements met. |
| PENDING | REJECTED | Requirements not met. |
| VERIFIED | EXPIRED | Scheduled expiration reached. |
| VERIFIED | REVOKED | Administrator or Verifier action. |
| EXPIRED | PENDING | Re-verification initiated. |
| REVOKED | PENDING | New verification initiated (after appeal or remediation). |

## 8. Verification Levels

The framework defines five standard verification levels. Any module may
define additional levels.

| Level | Code | Description | Typical Requirements |
|-------|------|-------------|---------------------|
| **Basic** | `BASIC` | Minimal confirmation of existence and format validity. | Email confirmed. Website responds. Format validation passed. |
| **Standard** | `STANDARD` | Moderate confirmation of authenticity. | Email + phone verified. Domain ownership confirmed. Basic registration check. |
| **Enhanced** | `ENHANCED` | Substantial confirmation with document evidence. | Government ID or registration document reviewed. Tax ID cross-checked. Business registry lookup. |
| **Accredited** | `ACCREDITED` | Comprehensive due diligence. | All Enhanced requirements, plus: physical address verified, business licence confirmed, operational history verified, compliance check passed. |
| **Trusted** | `TRUSTED` | Highest level, long-standing track record. | All Accredited requirements, plus: multiple years on platform, no incidents, community endorsements, periodic audit passed. |

### Level Progression

- A target enters at UNVERIFIED and moves up through the levels.
- Levels are generally sequential (BASIC → STANDARD → ENHANCED →
  ACCREDITED → TRUSTED).
- A module may require a minimum level for specific operations (e.g.,
  "Only ACCREDITED organizations may distribute books").
- A target may be verified at multiple levels simultaneously (e.g.,
  BASIC for one identifier, TRUSTED for the overall entity).

### Module-Specific Levels

Modules may extend the level system:

```jsonc
{
  "level": "VERIFIED",     // Publisher-specific (RFC-0004)
  "extends": "STANDARD",   // Inherits requirements
  "module": "publisher"
}
```

The level system is a hierarchy, not a flat list. Each level extends
the requirements of the level below it.

## 9. Verification Methods

| Method | Code | Description | Typical Workflow |
|--------|------|-------------|------------------|
| **Email** | `EMAIL` | Email address confirmation. | Send verification link, user clicks to confirm. |
| **SMS** | `SMS` | Phone number confirmation via SMS. | Send code via SMS, user enters code. |
| **Phone Call** | `PHONE_CALL` | Phone number confirmation via voice call. | Automated call delivers code, user enters code. |
| **Website Ownership** | `WEBSITE_OWNERSHIP` | Confirm ownership of a website. | Meta tag, file upload, or DNS record placed on the site. |
| **DNS Record** | `DNS_RECORD` | Confirm control via DNS. | Specific TXT or CNAME record added to domain DNS. |
| **Government Registry** | `GOVERNMENT_REGISTRY` | Verify against a government registry. | Look up registration number in official registry (manual or API). |
| **Business Registry** | `BUSINESS_REGISTRY` | Verify against a business registry. | Look up company number in business register (manual or API). |
| **ISBN Agency** | `ISBN_AGENCY` | Verify ISBN prefix against the official ISBN agency. | API or manual lookup in ISBN database. |
| **Manual Review** | `MANUAL_REVIEW` | Human review of submitted documents. | Verifier examines documents, compares to requirements, approves or rejects. |
| **Community Validation** | `COMMUNITY_VALIDATION` | Endorsement or confirmation by trusted community members. | N existing TRUSTED entities vouch for the target. |
| **Digital Signature** | `DIGITAL_SIGNATURE` | Cryptographic signature verification. | Verify a digital signature against a known public key. |
| **API Verification** | `API_VERIFICATION` | Verification via a third-party API. | External service (Google, Loqate, etc.) confirms the data. |
| **Document Review** | `DOCUMENT_REVIEW` | Review of uploaded documentation. | Verifier examines PDF, image, or other document evidence. |
| **Custom** | `CUSTOM` | Extensible custom method. | Configurable per deployment or per module. |

### Method Composition

Multiple verification methods may contribute to a single verification
event. The framework supports:

- **AND composition** — All specified methods must pass for the event to
  be VERIFIED.
- **OR composition** — At least one of the specified methods must pass.
- **Weighted composition** — Methods contribute different weights to the
  confidence score.

Composition rules are defined per module or per verification policy.

## 10. Evidence Model

Evidence is the supporting material that justifies a verification
outcome.

### Evidence Object

```jsonc
{
  "id": "uuid",
  "type": "EvidenceType",
  "label": "string?",
  "description": "string?",
  "hash": {
    "algorithm": "SHA-256",
    "value": "abc123def456..."
  },
  "location": "s3://bucket/path/to/evidence",
  "mimeType": "application/pdf",
  "size": 1048576,
  "metadata": {
    "source": "upload",
    "uploadedBy": "uuid",
    "uploadedAt": "datetime",
    "originalFilename": "business_licence.pdf"
  },
  "retention": {
    "policy": "STANDARD | EXTENDED | INDEFINITE",
    "expiresAt": "datetime?"
  },
  "status": "CURRENT | PURGED",
  "audit": "AuditMetadata"
}
```

### Evidence Types

| Type | Description |
|------|-------------|
| **EMAIL_CONFIRMATION** | Verification email content or metadata. |
| **SMS_LOG** | SMS delivery and confirmation log. |
| **CALL_LOG** | Phone call verification log. |
| **SCREENSHOT** | Screenshot of registry or website. |
| **DOCUMENT_UPLOAD** | Uploaded document (PDF, image, office file). |
| **REGISTRY_RESPONSE** | API or manual response from an official registry. |
| **DNS_RECORD** | DNS record content and discovery metadata. |
| **META_TAG** | Website meta tag content and check result. |
| **FILE_UPLOAD** | File uploaded to website for ownership proof. |
| **DIGITAL_SIGNATURE** | Cryptographic signature and verification result. |
| **API_RESPONSE** | Response from a third-party verification API. |
| **MANUAL_NOTE** | Notes recorded by a human verifier. |
| **PHOTOGRAPH** | Photograph of physical location or document. |
| **OTHER** | Any type not covered by the above list. |

## 11. Evidence Hashing

Every piece of evidence is cryptographically hashed at the time of
recording.

### Hashing Requirements

- **Algorithm**: SHA-256 minimum. SHA-384 or SHA-512 recommended for
  long-term storage.
- **Scope**: The hash is computed over the raw bytes of the evidence
  file or content.
- **Storage**: The hash is stored alongside the evidence record, never
  embedded in the evidence file itself.
- **Verification**: The hash can be recomputed at any time to verify
  that the evidence has not been tampered with.
- **Multiple files**: If a single evidence item comprises multiple files,
  each file is hashed individually, and a Merkle root hash is computed
  across all files.

### Purpose

- Tamper detection: any modification to the evidence changes the hash.
- Audit integrity: third parties can verify that evidence has not been
  altered since recording.
- De-duplication: identical evidence submitted for multiple targets can
  be identified by hash.

## 12. Evidence Retention

Evidence retention policies determine how long evidence is kept.

### Retention Policies

| Policy | Description | Default Duration |
|--------|-------------|------------------|
| **STANDARD** | Evidence retained for the standard period. | 7 years after verification event. |
| **EXTENDED** | Evidence retained for an extended period. | 10 years after verification event, or as required by regulation. |
| **INDEFINITE** | Evidence retained permanently. | Never purged. Used for critical verification events (e.g., TRUSTED level). |

### Rules

- Evidence is never deleted before the retention period expires.
- After expiry, evidence may be purged. The evidence record (metadata,
  hash) is retained indefinitely even after the file is purged.
- Purged evidence has `status: "PURGED"` and the `location` field is
  cleared.
- Retention policy is set at evidence creation time and may be extended
  but never shortened.
- Regulatory holds override retention policies. Evidence under a hold
  is never purged.

## 13. Verification History (Immutable)

Verification history is the complete, ordered, append-only sequence of
all verification events for a target.

### Properties

- **Append-only**: Events are only added, never removed.
- **Immutable**: Once recorded, an event cannot be modified. Corrections
  are made by creating a new event that supersedes the previous one.
- **Ordered**: Events are ordered by `occurredAt`. The chain of
  `supersedes` / `supersededBy` links provides the causal order.
- **Linked**: Each event (except the first) references the event it
  supersedes. This forms a chain that can be traversed forward and
  backward.
- **Accessible**: The full history is accessible to Administrators and
  the target owner. A summary (current state only) is accessible to
  lower-privilege actors.

### Chain Example

```
Event 1: UNVERIFIED → PENDING  (supersedes: null)
Event 2: PENDING → VERIFIED     (supersedes: Event 1)
Event 3: VERIFIED → EXPIRED     (supersedes: Event 2)
Event 4: EXPIRED → PENDING      (supersedes: Event 3)
Event 5: PENDING → VERIFIED     (supersedes: Event 4)
```

## 14. Verification Lifecycle

The lifecycle of a verification event is distinct from the lifecycle of
the target being verified.

### Event Lifecycle

```
RECORDED → ACTIVE → SUPERSEDED
                └──→ EXPIRED
```

| Stage | Description |
|-------|-------------|
| **RECORDED** | The event has been created and stored. |
| **ACTIVE** | The event is the current active verification for its target and level. |
| **SUPERSEDED** | A newer event has replaced this one. The event remains in the history. |
| **EXPIRED** | The verification period has ended. The event is no longer active. |

### Target Verification Lifecycle

The target's overall verification state is derived from its active
events. If the target has at least one active VERIFIED event at any
level, the target is considered VERIFIED at that level. If all events
have expired or been revoked, the target's overall state is EXPIRED.

## 15. Expiration and Renewal

### Expiration

- Every verification event has an optional `expiresAt` timestamp.
- If `expiresAt` is null, the verification never expires.
- When `expiresAt` is reached, the event automatically transitions to
  EXPIRED state.
- Expiration is a system action, not a human action. It is triggered by
  a scheduled process.

### Default Expiration Periods by Level

| Level | Default Expiration |
|-------|-------------------|
| BASIC | 12 months |
| STANDARD | 12 months |
| ENHANCED | 24 months |
| ACCREDITED | 36 months |
| TRUSTED | 36 months (with annual review) |

### Renewal

- Renewal is a new verification event that supersedes the expired one.
- Renewal may require the same evidence as the original, or a subset
  (e.g., re-confirm email but not re-submit registration documents).
- The renewal requirements are defined per module and per level.
- A grace period (configurable, default 30 days) may be allowed after
  expiry before the target's overall state changes to EXPIRED.

### Scheduled Re-verification

- The framework supports scheduling re-verification at arbitrary
  intervals.
- Scheduled re-verification creates a PENDING event before the current
  one expires.
- If the scheduled re-verification completes before expiry, the new
  event replaces the current one with no gap.
- If it does not complete, the current event expires normally.

## 16. Revocation

Revocation is the invalidation of a previously VERIFIED event by an
authorised actor.

### Triggers

- Discovery that the original evidence was fraudulent or invalid.
- Change in the target's status that invalidates the verification (e.g.,
  organization dissolved).
- Regulatory or legal requirement.
- Policy violation by the target.
- Request by the target owner (e.g., revoke verification of a former
  address).

### Revocation Rules

- Revocation requires Administrator or Verifier privileges.
- A revoked event has `state: "REVOKED"` and is no longer active.
- The revocation records the actor, reason, timestamp, and supporting
  evidence.
- Revocation is not deletion. The original event and evidence remain in
  the history.
- A new verification may be started after revocation.

## 17. Re-verification

Re-verification is the process of verifying a target that was previously
VERIFIED but has since transitioned to EXPIRED or REVOKED.

### Re-verification Rules

- Re-verification starts a new verification event.
- The new event is independent of the previous one. Past evidence is not
  reused unless explicitly carried forward.
- The re-verification requirements are the same as for a new
  verification at the same level, unless a reduced scope is defined.
- Re-verification after REVOKED may require enhanced scrutiny.

## 18. Verification Relationships

Verification events are related to targets, not to modules. A single
target may have multiple verification streams.

### Examples

```
Target: Organization (id: abc-123)
    ├── Level: STANDARD (overall org verification)
    │   ├── Method: BUSINESS_REGISTRY → Event 1 (VERIFIED)
    │   └── Method: MANUAL_REVIEW    → Event 2 (VERIFIED)
    └── Level: TRUSTED
        └── Method: MANUAL_REVIEW    → Event 3 (PENDING)

Target: ContactMethod: email (id: def-456)
    └── Level: BASIC
        └── Method: EMAIL            → Event 4 (VERIFIED)

Target: Address (id: ghi-789)
    └── Level: STANDARD
        ├── Method: POSTCARD         → Event 5 (PENDING)
        └── Method: DOCUMENT_REVIEW  → Event 6 (VERIFIED, Event 5 superseded)
```

### Relationship to Module Verification

Module-level verification (e.g., "Publisher is ACCREDITED") is a
composite of multiple target-level verifications:

```
Publisher Accreditation (composite)
    ├── Organization: STANDARD → VERIFIED
    ├── Address (HQ): STANDARD → VERIFIED
    ├── Email: BASIC → VERIFIED
    ├── Phone: BASIC → VERIFIED
    └── Website: BASIC → VERIFIED
```

The module is responsible for defining the composition rules. The
Verification Framework provides the primitives.

## 19. Trust Scoring

Trust scoring is a higher-level aggregation of verification state across
multiple targets and levels. It answers: "How much should the platform
trust this entity overall?"

### Trust Score Components

| Component | Description | Weight |
|-----------|-------------|--------|
| Verification Level | The highest level achieved (BASIC → TRUSTED weighted). | 40% |
| Verification Age | How long the entity has maintained its current level. | 20% |
| Verification History | Ratio of successful to failed verification events. | 15% |
| Incident Count | Number of verified issues (suspensions, complaints, etc.). | 15% |
| Community Endorsements | Number and trust level of endorsing entities. | 10% |

### Score Range

- **0.0 – 0.2**: Unverified or mostly unverified.
- **0.2 – 0.5**: Basic verification achieved.
- **0.5 – 0.7**: Standard or Enhanced verification maintained for some
  time.
- **0.7 – 0.9**: Accredited or Trusted level with good history.
- **0.9 – 1.0**: Long-standing Trusted level, zero incidents, strong
  endorsements.

### Principles

- Trust scoring is advisory, not authoritative. Modules define their own
  minimum requirements.
- Trust score is recalculated periodically, not in real-time.
- Trust score is visible to the entity owner and Administrators. It may
  optionally be exposed in public profiles as a single aggregate metric.

## 20. Confidence Scoring

Confidence scoring answers: "How sure are we about this specific
verification event?"

### Confidence by Method

| Method | Typical Confidence |
|--------|-------------------|
| Email confirmation | 0.90 |
| SMS confirmation | 0.85 |
| Phone call | 0.85 |
| DNS record | 0.95 |
| Government registry (API) | 0.95 |
| Government registry (manual) | 0.80 |
| Business registry (API) | 0.90 |
| Business registry (manual) | 0.75 |
| Document review | 0.70 – 0.90 |
| Digital signature | 0.99 |
| Community validation | 0.50 – 0.80 |

### Composite Confidence

When multiple methods contribute to a single verification event, the
confidence score is computed as:

- **AND composition**: `min(confidence of all methods)` — the chain is
  only as strong as its weakest link.
- **OR composition**: `max(confidence of all methods)` — the strongest
  method determines confidence.
- **Weighted composition**: Weighted average based on predefined
  weights.

### Principles

- Confidence scoring is transparent. The score and its derivation can
  be inspected.
- Confidence scores are per-event, not per-target. Different events for
  the same target may have different scores.
- Confidence scores are never exposed publicly. They are internal to the
  verification system.

## 21. Human Review Workflow

Some verification methods require human review. The framework defines a
standard workflow.

### Workflow Stages

```
SUBMITTED → ASSIGNED → IN_REVIEW → APPROVED
                              └──→ REJECTED
                                  └──→ REQUEST_CHANGES → SUBMITTED (loop)
```

| Stage | Description |
|-------|-------------|
| **SUBMITTED** | Evidence has been submitted. Awaiting assignment. |
| **ASSIGNED** | A Verifier has been assigned to review. |
| **IN_REVIEW** | The Verifier is actively reviewing the evidence. |
| **APPROVED** | The Verifier has approved. Event transitions to VERIFIED. |
| **REJECTED** | The Verifier has rejected. Event transitions to REJECTED. |
| **REQUEST_CHANGES** | The Verifier has requested additional or corrected evidence. |

### Reviewer Assignment

- Reviewers are assigned from a pool of Verifier actors.
- Assignment may be manual (Administrator assigns) or automatic
  (round-robin, least-loaded, or skill-based).
- Assignment records are part of the audit trail.

### Reviewer Notes

- Reviewers may add notes at any stage.
- Notes are private to Administrators and the target owner.
- Notes are immutable once the review is complete.

### SLA Targets

- BASIC: 24 hours
- STANDARD: 72 hours
- ENHANCED: 5 business days
- ACCREDITED: 10 business days
- TRUSTED: 15 business days

SLAs are configurable per deployment.

## 22. Automated Verification Workflow

Automated verification runs without human intervention.

### Workflow Stages

```
TRIGGERED → IN_PROGRESS → COMPLETED (VERIFIED)
                       └──→ COMPLETED (REJECTED)
                       └──→ ESCALATED → HUMAN_REVIEW
```

| Stage | Description |
|-------|-------------|
| **TRIGGERED** | The verification has been initiated by a system event or schedule. |
| **IN_PROGRESS** | The verification steps are being executed. |
| **COMPLETED** | All steps finished. Outcome is VERIFIED or REJECTED. |
| **ESCALATED** | Automated verification could not reach a definitive outcome. Transferred to human review. |

### Escalation Rules

Automated verification escalates to human review when:

- The external API is unavailable or returns an ambiguous result.
- The evidence does not match expected patterns.
- The confidence score is below a configurable threshold.
- The target is at a high verification level (ACCREDITED, TRUSTED)
  where automated verification alone is insufficient.

## 23. Batch Verification

Batch verification allows multiple targets to be verified in a single
operation.

### Use Cases

- Import verification: verifying all records in an imported batch.
- Scheduled re-verification: renewing verification for all targets
  expiring in the next 30 days.
- Bulk escalation: escalating all targets verified by a specific method
  that has been compromised.

### Batch Model

```jsonc
{
  "id": "uuid",
  "purpose": "SCHEDULED_RENEWAL",
  "targets": [
    { "targetType": "Organization", "targetId": "uuid" },
    { "targetType": "Organization", "targetId": "uuid" }
  ],
  "level": "STANDARD",
  "methods": ["MANUAL_REVIEW"],
  "workflow": "HYBRID",
  "status": "IN_PROGRESS",
  "progress": { "total": 200, "completed": 145, "failed": 3 },
  "createdAt": "datetime",
  "completedAt": "datetime?",
  "audit": "AuditMetadata"
}
```

### Principles

- Each target in a batch is verified independently. Failure of one does
  not affect others.
- Batch results are aggregated. A summary report is generated on
  completion.
- Batch verification supports the same methods, levels, and workflows
  as individual verification.

## 24. Search Requirements

Verification search must support:

- **Filter by target type** (Organization, Publisher, Email, ISBN,
  etc.).
- **Filter by current verification state** (UNVERIFIED, PENDING,
  VERIFIED, REJECTED, EXPIRED, REVOKED).
- **Filter by verification level** (BASIC, STANDARD, ENHANCED,
  ACCREDITED, TRUSTED).
- **Filter by verification method** (EMAIL, SMS, DOCUMENT_REVIEW, etc.).
- **Filter by verifier** (system or human actor).
- **Filter by workflow type** (AUTOMATED, HUMAN_REVIEW, HYBRID).
- **Filter by date range** (occurredAt, expiresAt).
- **Filter by confidence score range.**
- **Filter by evidence type.**
- **Find targets with expiring verification** (within a configurable
  window).
- **Find targets with expired verification.**
- **Find targets with revoked verification.**
- **Find targets by evidence hash** (find all targets that used the same
  evidence file).
- **Full-text search** across notes, targetRef, and evidence
  descriptions.

Search results are accessible to Administrators and Verifiers. Target
owners can search their own verification records only.

## 25. Import/Export Considerations

### Import

- Verification history is typically **not imported** from external
  systems. External verification is not trusted by default.
- Imported targets start at UNVERIFIED. They must be verified through
  the framework.
- Exception: when migrating from a trusted legacy system, verification
  history may be imported as a single "MIGRATED" verification event with
  manually set confidence.

### Export

- **Public export**: Current verification level only (VERIFIED /
  UNVERIFIED / etc.). No evidence, no history, no confidence scores.
- **Full export**: Complete verification history including evidence
  metadata (not evidence files themselves). Restricted to Administrators
  and target owner.
- **Audit export**: Full history including evidence file references.
  Restricted to Administrators.

## 26. Permissions

| Action | Visitor | Target Owner | Verifier | Administrator |
|--------|---------|--------------|----------|---------------|
| View current verification state (target) | ✅ | ✅ | ✅ | ✅ |
| View current verification level | ✅ | ✅ | ✅ | ✅ |
| View verification history | ❌ | ✅ (own) | ✅ | ✅ |
| View evidence metadata | ❌ | ✅ (own) | ✅ | ✅ |
| View evidence content | ❌ | ✅ (own) | ✅ | ✅ |
| View confidence scores | ❌ | ❌ | ✅ | ✅ |
| View trust score | ❌ | ✅ (own) | ✅ | ✅ |
| View review notes | ❌ | ✅ (own) | ✅ | ✅ |
| Submit evidence | ❌ | ✅ (own) | ❌ | ✅ |
| Request verification | ❌ | ✅ (own) | ❌ | ✅ |
| Perform automated verification | ❌ | ❌ | ✅ (system) | ✅ (system) |
| Perform human review | ❌ | ❌ | ✅ | ✅ |
| Approve verification | ❌ | ❌ | ✅ | ✅ |
| Reject verification | ❌ | ❌ | ✅ | ✅ |
| Revoke verification | ❌ | ❌ | ✅ | ✅ |
| Set verification level requirements | ❌ | ❌ | ❌ | ✅ |
| Configure verification policies | ❌ | ❌ | ❌ | ✅ |
| Configure expiration periods | ❌ | ❌ | ❌ | ✅ |
| Export verification data | ❌ | ✅ (own) | ✅ | ✅ |
| Assign review workload | ❌ | ❌ | ❌ | ✅ |

## 27. Audit Requirements

Every verification event generates audit records.

### Audit per Event

| Field | Description |
|-------|-------------|
| `eventId` | The verification event ID. |
| `action` | Created, approved, rejected, revoked, expired, superseded. |
| `actor` | The system or human actor. |
| `timestamp` | When the action occurred. |
| `previousState` | The state before the action. |
| `newState` | The state after the action. |
| `reason` | Why the action was taken. |
| `evidence` | Evidence involved (if any). |

### Audit Retention

- Audit records are retained indefinitely.
- Audit records are immutable and append-only.
- Audit records are separate from verification history (they record
  actions on the verification itself, not verification of a target).
- Audit records are accessible only to Administrators.

## 28. Security Considerations

- **Evidence integrity** — Evidence is hashed at ingestion. The hash is
  stored separately from the evidence. Evidence is stored in encrypted
  blob storage with access logging.
- **Evidence access** — Evidence is never served through public
  endpoints. Access requires explicit authorisation and is logged.
- **Verification oracle** — Verification results are authoritative
  within the platform. Compromise of the verification system could allow
  fraudulent entities to appear verified. The verification event stream
  must be append-only at the storage level, not just the application
  level.
- **Rate limiting** — Verification requests are rate-limited per target
  and per requester to prevent abuse.
- **Evidence inspection** — Evidence uploaded for human review is
  scanned for malware. File types are restricted to a configured allow
  list.
- **Confidentiality** — Evidence may contain sensitive personal or
  business information. Access controls are enforced at the evidence
  level, not just the verification event level.
- **Replay attacks** — Verification tokens (email links, SMS codes) are
  single-use and expire after a short window.
- **Verifier impersonation** — Verifier actions are cryptographically
  signed or logged with strong actor authentication.
- **Expiration integrity** — Expiration timestamps are set by the
  system, not by the target. They cannot be modified by the target.

## 29. International Compliance Considerations

The framework is designed to accommodate varying regulatory requirements
across jurisdictions.

| Consideration | Description |
|---------------|-------------|
| **GDPR (Europe)** | Evidence containing personal data must support deletion requests. Evidence hashes may be retained after deletion. Retention policies must be configurable per jurisdiction. |
| **CCPA (California)** | Similar to GDPR: evidence deletion and access rights. |
| **KYC/KYB (Global)** | Verification evidence for financial or identity verification may have minimum retention periods (typically 5–7 years). |
| **eIDAS (Europe)** | Digital signatures and electronic identification may be accepted as verification methods. |
| **Data Localisation** | Some jurisdictions require evidence to be stored within their borders. The evidence model supports region-scoped storage locations. |
| **Regulatory Audit** | Regulators may require access to verification history and evidence. Audit export supports this. |

### Principles

- The framework is not compliant by default in any specific jurisdiction.
  Compliance is achieved through configuration of retention policies,
  privacy levels, and evidence storage locations.
- Evidence retention policies are configurable per target type and
  per jurisdiction.
- The framework provides the primitives; each deployment configures them
  for its regulatory environment.

## 30. Future Extensions

### Continuous Verification

Real-time or near-real-time monitoring of verification state. If a
verified entity's registration lapses in a government registry, the
system automatically transitions the relevant verification to EXPIRED.

### Self-sovereign Verification

Integration with decentralised identity systems (DID, Verifiable
Credentials). Targets present verifiable credentials instead of
uploading evidence.

### Cross-platform Verification

Sharing verification status with trusted partner platforms through
signed verification assertions.

### Verification Marketplace

A marketplace where trusted third-party verifiers offer their services
for specific methods (e.g., "Document review for Bangladesh publishers
within 24 hours").

### Machine Learning Verification Assistance

ML models that pre-screen evidence, flag anomalies, and suggest
confidence scores before human review.

### Blockchain Verification Anchoring

Anchoring verification event hashes to a public blockchain for
independent verifiability.

### Programmatic Verification Policies

A policy engine where verification rules are expressed as code or
configuration, allowing modules to define their own requirements
without modifying the framework.

## 31. Open Questions

1. Should verification events be signed (digitally) by the verifier or
   system at the storage level, or is the audit trail sufficient?

2. How is the initial verification level determined for a newly created
   target? Should it always start at UNVERIFIED, or are there cases
   where a target should start at a higher level (e.g., a verified
   platform user creates a new Organization)?

3. Should verification events support multiple targets
  (one-to-many or many-to-one), or is the current one-to-one
   (targetType + targetId) model sufficient?

4. How should cross-jurisdiction verification be handled? If a
   government registry API is only available in one country, can
   verification using that method be considered valid for a target in
   another country?

5. Should evidence be storable across multiple storage providers or
   regions simultaneously for redundancy and compliance?

6. What is the threshold for automatic escalation from automated
   verification to human review?

7. Should confidence scores be exposed in the public profile as a
   simplified metric (e.g., "High confidence", "Medium confidence"), or
   kept entirely internal?

8. How should the framework handle verification of historical data
   (e.g., verifying that a publisher's former name was valid at the
   time)?

9. Should batch verification support partial completion notifications,
   or only final completion?

10. How are verification disputes handled? Should there be an appeal
    workflow within the framework, or is that a module-level concern?

## 32. Acceptance Criteria

- [ ] Verification **Vision**, **Goals**, and **Non-Goals** are
      documented and reviewed.
- [ ] **Verification Philosophy** documents five principles:
      Universal, Append-only, Independent, Decomposable, Temporal.
- [ ] The **Verification Object Model** defines VerificationEvent
      (with targetType, targetId, targetRef, level, state, methods,
      evidence, verifier, workflow, confidence, expiresAt,
      supersedes/supersededBy, audit) and VerificationRecord (read-only
      projection from events).
- [ ] **Verification Target Model** documents that any entity or value
      object can be a target, identified by (targetType, targetId), with
      multiple independent verification streams per target.
- [ ] **Verification States** (6 states) are defined with a complete
      transition map (UNVERIFIED → PENDING → VERIFIED → EXPIRED →
      PENDING, with REJECTED and REVOKED branches).
- [ ] **Verification Levels** (5 levels: BASIC, STANDARD, ENHANCED,
      ACCREDITED, TRUSTED) are defined with typical requirements,
      progression rules, and extensibility for module-specific levels.
- [ ] **Verification Methods** (14 methods) are listed with codes,
      descriptions, and typical workflows.
- [ ] **Method Composition** documents AND, OR, and Weighted
      composition rules.
- [ ] **Evidence Model** defines the Evidence object (id, type, label,
      description, hash with algorithm + value, location, mimeType,
      size, metadata, retention, status, audit) and 14 evidence types.
- [ ] **Evidence Hashing** specifies SHA-256 minimum, per-file and
      Merkle root hashing, and tamper-detection purpose.
- [ ] **Evidence Retention** defines STANDARD (7 years), EXTENDED (10
      years), and INDEFINITE policies with purging rules and regulatory
      hold support.
- [ ] **Verification History** documents append-only, immutable,
      ordered, linked (supersedes chain), and accessible properties.
- [ ] **Verification Lifecycle** defines RECORDED, ACTIVE, SUPERSEDED,
      and EXPIRED stages.
- [ ] **Expiration and Renewal** defines configurable expiration
      periods per level, grace periods, and scheduled re-verification.
- [ ] **Revocation** documents triggers, rules, and audit
      requirements.
- [ ] **Re-verification** documents independence from past events and
      reduced-scope options.
- [ ] **Verification Relationships** documents multiple independent
      streams per target and composite module-level verification.
- [ ] **Trust Scoring** defines 5 components (Verification Level, Age,
      History, Incidents, Endorsements) with weights and score ranges.
- [ ] **Confidence Scoring** defines per-method typical values,
      composite rules (AND/OR/Weighted), and transparency principles.
- [ ] **Human Review Workflow** defines 6 stages (SUBMITTED, ASSIGNED,
      IN_REVIEW, APPROVED, REJECTED, REQUEST_CHANGES), reviewer
      assignment, notes, and SLA targets.
- [ ] **Automated Verification Workflow** defines 4 stages (TRIGGERED,
      IN_PROGRESS, COMPLETED, ESCALATED) with escalation rules.
- [ ] **Batch Verification** defines the batch model with independent
      target processing and aggregated results.
- [ ] **Search Requirements** document 15 search dimensions.
- [ ] **Import/Export Considerations** document that imported targets
      start at UNVERIFIED and export scope limitations.
- [ ] **Permissions** are defined for all 4 actor classes across 19
      actions.
- [ ] **Audit Requirements** document per-event audit records with
      indefinite retention and immutability.
- [ ] **Security Considerations** address evidence integrity, evidence
      access, verification oracle, rate limiting, evidence inspection,
      confidentiality, replay attacks, verifier impersonation, and
      expiration integrity.
- [ ] **International Compliance** documents GDPR, CCPA, KYC/KYB,
      eIDAS, data localisation, and regulatory audit considerations with
      configurable-principles approach.
- [ ] **Future Extensions** (Continuous Verification, Self-sovereign,
      Cross-platform, Marketplace, ML Assistance, Blockchain Anchoring,
      Programmatic Policies) are identified.
- [ ] **Open Questions** are documented (10 questions) and awaiting
      resolution.
