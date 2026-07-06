# Publishing Module

## Purpose

Manages the publishing workflow — submissions, contracts, licenses, and the end-to-end process of bringing a book from manuscript to publication.

## Responsibilities

- Submission management (author submits manuscript to publisher)
- Contract management between publishers and authors/contributors
- License management (copyright, distribution rights, translation rights)
- Publishing workflow orchestration (submission → review → contract → publication)
- Contract party management

## Owned Data

- `submission` — Author-to-publisher submissions
- `submission_author` — Submission-author relationships
- `contract` — Publishing contracts
- `contract_book` — Books covered by a contract
- `contract_party` — Parties to a contract
- `license` — Licenses and rights management

## Dependencies

- `core` — Base types, ID generation
- `directory` — Publisher references
- `catalog` — Book, author, and edition references
- `identity` — User/role management for workflow actions

## Public Interfaces

- Submission: `submitManuscript` / `reviewSubmission` / `acceptSubmission` / `rejectSubmission`
- Contract: `createContract` / `updateContract` / `getContract` / `listContracts`
- License: `grantLicense` / `revokeLicense` / `getLicense`
- Workflow: `getSubmissionStatus` / `advanceWorkflow` / `getWorkflowState`

## Future Features

- Digital rights management
- Royalty calculation and tracking
- Advance payment tracking
- Submission portal for authors
- Contract template management
- Submission deadline and SLA tracking

## Out of Scope

- Book catalog display (see `catalog` module)
- Printing and production (see `printing` module)
- Distribution and sales (see `distribution` module)
- Financial accounting
