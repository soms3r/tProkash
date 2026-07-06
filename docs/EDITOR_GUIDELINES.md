# Editor Guidelines

## Purpose

Define the expectations, standards, and procedures for editorial staff (Reviewers and Editors) who assess, verify, and curate data within the tProkash ecosystem. These guidelines ensure consistent, high-quality editorial decisions across all entity types.

## Scope

All users holding the Reviewer or Editor role within the tProkash system. This document applies to all editorial actions: reviewing submissions, approving records, making corrections, resolving duplicates, and handling disputes.

## Workflow / Process

### Editorial Principles

1. **Accuracy** — Every piece of data must be verifiable against authoritative sources. When in doubt, leave the field blank rather than guessing.
2. **Neutrality** — Present factual information without bias. Do not editorialize in record descriptions or notes.
3. **Completeness** — Strive to capture all available and relevant data fields, but never fabricate information to achieve completeness.
4. **Transparency** — Document the rationale for significant editorial decisions in the change history. Note sources consulted and reasoning applied.

### Verification Standards

Editors must follow the verification standards outlined in DATA_VERIFICATION_STANDARD.md (external reference). In summary:

- **Official sources** (government registries, ISBN agency databases, publisher websites) are preferred.
- **Secondary sources** (library catalogs, trade publications, Wikipedia) may supplement but not replace official sources.
- **Unverified sources** (personal blogs, forums, user-submitted content) are not acceptable as sole sources.
- At least one independently verifiable source is required for every published record.

### Handling Uncertain Data

- If a data point cannot be confirmed from any reliable source, leave the field empty.
- Do not infer, assume, or fabricate data points.
- Add an editorial note indicating the field was intentionally left blank due to insufficient sources.
- For conflicting information, document both versions in the editorial notes and flag for community input.

### Handling Conflicts

When two sources present conflicting information:

1. Prioritize the more authoritative source.
2. If sources are equally authoritative, document both in the record notes.
3. Seek a third authoritative source to break the tie.
4. If no resolution is possible, flag the record for senior Editor review.

## Decision Rules

### Quality Expectations

- Editorial accuracy target: minimum 95% across all reviewed records.
- Source citation rate: 100% of published records must have at least one cited source.
- Review throughput: Reviewers should process at least 20 submissions per week (part-time) or 50 per week (full-time).
- Error rate: If a Reviewer's error rate exceeds 5%, a performance review is triggered.

### Editor Code of Conduct

- **Confidentiality**: Do not disclose unreviewed submissions or editorial discussions outside the platform.
- **Impartiality**: Recuse yourself from reviewing records where you have a conflict of interest (personal, financial, or organizational).
- **Respect**: Communicate with contributors professionally and constructively, even when rejecting submissions.
- **Diligence**: Complete assigned reviews within SLA. If unable to meet SLA, escalate proactively.
- **Accountability**: Own your editorial decisions. Mistakes should be corrected promptly and transparently.

### Rejection Standards

Reject a submission only when:

- The data cannot be verified from any reliable source.
- The submission contains fabricated or intentionally misleading data.
- The submission violates the Moderation Policy.
- The submitter has not responded to a change request within 14 days.

## Examples

**Example 1: Conflicting website information.** An Editor reviews a publisher record where the submitted website URL points to a domain that redirects to a different company's site. The Editor leaves the website field blank, adds an editorial note explaining the discrepancy, and cites the publisher's official registration document as the source for the legal name.

**Example 2: Handling a bulk import with errors.** An Editor reviews a bulk import of 200 book records. Spot-checking reveals a 4% error rate in ISBN formatting. The Editor approves the 192 error-free records, rejects 8 with unresolvable issues, and requests changes on the remaining 200 with the specific formatting corrections needed.

## Future Improvements

- Editorial performance metrics dashboard with accuracy, throughput, and contributor satisfaction scores.
- Peer review process where Editors can request a second opinion on complex records.
- Automated verification suggestions from external authority databases.
- Continuing education requirements and certification tiers for Reviewers.
- Structured feedback loops from contributors to editors on review quality.
