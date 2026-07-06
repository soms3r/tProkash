# Domain Architecture

**Document ID:** TP-ARCH-020\
**Version:** 1.0.0\
**Status:** Approved\
**Owner:** tProkash Core Project\
**Created:** 2026-07-06\
**Last Updated:** 2026-07-06\
**Applies To:** Entire repository — database, API, documentation, data

---

## 1. Purpose

This document defines the complete domain architecture of the tProkash publishing ecosystem. It serves as the single authoritative reference for every entity, relationship, business rule, and lifecycle within the system.

All database schemas, API designs, data exports, and software components must conform to this document. If another specification conflicts with this document, this document takes precedence.

---

## 2. Scope

This document covers the core publishing domain and its supporting subdomains:

- **Core Publishing** — books, authors, publishers, editions, ISBNs
- **Production** — printing, warehousing, inventory
- **Distribution** — distributors, bookstores, sales channels
- **Rights & Contracts** — licenses, contracts, submissions
- **Community** — reviews, awards, events, readers
- **Content Management** — media, digital assets, tags, collections
- **Administration** — users, roles, permissions, audit logging
- **Data Governance** — sources, verification, datasets

Out of scope: financial accounting, payroll, HR, physical POS systems.

---

## 3. Domain Overview

tProkash models the Bangladeshi publishing ecosystem as an interconnected graph of entities centered on the **Book**. A Book is created by Authors and Contributors, published by a Publisher under an Imprint, produced in Editions with unique ISBNs, printed by Printers, stored in Warehouses, distributed by Distributors, sold by Bookstores, and read by Readers.

The domain is database-first, normalized to Third Normal Form (3NF), and designed for API-ready access and open-data publication. Every fact is traceable to a Source and carries an explicit Verification status.

Key characteristics of the domain:

- **Identifiers** — stable, prefixed IDs (AUT, PUB, BOK, EDN, ISBN, etc.)
- **Auditing** — every entity carries created_at, updated_at, deleted_at (soft delete)
- **Multilingual** — names stored in Bengali (bn) and English (en) where applicable
- **Verification** — every record has a verification_level (Verified, Partial, Community, Needs Review)
- **Traceability** — every fact links back to a Source or Document

---

## 4. Core Entities

### 4.1 Publisher

An organization that produces and distributes books, journals, or other literary works. Publishers are the central commercial entities in the ecosystem.

Key attributes: name (bn/en), slug, website, address, contact, verification_status, founded_year, status (active/inactive/defunct).

### 4.2 Imprint

A trade name under which a Publisher releases works. A single Publisher may operate multiple Imprints, each targeting a specific market or genre.

### 4.3 Author

A person who creates the intellectual content of a Book. Authorship implies original creative contribution to the text.

### 4.4 Contributor

A person who contributes to a Book in a non-author capacity. Contributors include editors, translators, illustrators, designers, and others. Every Contributor has a role.

### 4.5 Book

The core intellectual unit. A Book represents a distinct work with a title, regardless of format or edition. Books are the central entity around which the entire domain is organized.

### 4.6 Edition

A specific version of a Book. Editions differ by content, format, publication date, or publisher. Examples: first edition, second edition, paperback edition, illustrated edition.

### 4.7 ISBN

International Standard Book Number. A unique identifier assigned to a single Edition. An ISBN is the most granular identifier in the publishing supply chain.

### 4.8 Language

The language in which a Book or Edition is written. Supports both the language name and its ISO 639-1/639-2 code.

### 4.9 Category

A subject classification or genre assigned to a Book. Categories form a hierarchy (parent-child) and may be assigned by multiple classification systems.

### 4.10 Series

A sequence of related Books published under a common title or branding. Examples: trilogies, multi-volume collections, annual series.

### 4.11 Collection

A user-defined or editorially curated grouping of Books. Collections may cross series, publishers, and genres.

### 4.12 Editor

A person who prepares a Book for publication. Editors perform manuscript review, copy editing, developmental editing, or proofreading.

### 4.13 Translator

A person who converts a Book from one language to another. Translations are treated as derivative works.

### 4.14 Illustrator

A person who creates visual content for a Book, including drawings, paintings, diagrams, and photographs.

### 4.15 Designer

A person responsible for the visual layout, typography, and cover design of a Book or Edition.

### 4.16 Printer

An organization that physically produces printed copies of a Book. Printers handle typesetting, printing, binding, and finishing.

### 4.17 Printing

A specific print run of an Edition. A Printing records quantity, date, printer, cost, and status.

### 4.18 Warehouse

A physical location where printed books are stored before distribution. Warehouses manage inventory levels and fulfill orders.

### 4.19 Inventory

The stock of a specific Edition at a specific Warehouse. Inventory tracks quantity on hand, quantity reserved, and reorder thresholds.

### 4.20 Distributor

An organization that supplies books from Publishers or Warehouses to Bookstores and other retailers.

### 4.21 Bookstore

A retail outlet that sells Books to Readers. Bookstores may be physical, online, or both.

### 4.22 Reader

A person who reads or purchases Books. Readers may optionally create an account, write reviews, and maintain reading lists.

### 4.23 Review

A reader-submitted evaluation of a Book. Reviews include a rating (numeric score) and optional text.

### 4.24 Award

A prize or honor given to a Book, Author, Publisher, or other entity. Awards have a name, year, category, and granting organization.

### 4.25 Event

A scheduled occurrence related to publishing. Events include book fairs, book launches, author signings, readings, and conferences.

### 4.26 Organization

Any legal or institutional entity that participates in the publishing ecosystem but is not specifically a Publisher, Printer, Distributor, or Bookstore. Examples: literary societies, libraries, universities, funding bodies.

### 4.27 License

A legal instrument that governs the use of a Book or other intellectual property. Licenses specify rights granted, territory, duration, and restrictions.

### 4.28 Contract

A legally binding agreement between two parties in the publishing ecosystem. Contracts cover author-publisher agreements, distribution deals, translation rights, and employment.

### 4.29 Submission

A proposal or manuscript submitted by an Author or agent to a Publisher for consideration. Submissions track status, decision, review comments, and dates.

### 4.30 Media

External media coverage related to a Book, Author, or Event. Media includes news articles, interviews, podcasts, and video features.

### 4.31 Digital Asset

A digital file associated with a Book or Edition. Digital assets include cover images, sample chapters, author photos, promotional materials, and audio/video files.

### 4.32 Tag

A free-form label attached to any entity for classification, filtering, or discovery. Tags are user-generated and not part of the formal category hierarchy.

### 4.33 Role

A named function within the system. Roles group Permissions for assignment to Users. Examples: Admin, Editor, Publisher Rep, Reviewer.

### 4.34 Permission

A discrete authorization to perform an action within the system. Permissions are assigned to Roles.

### 4.35 User

A person with authenticated access to the system. Users have a Role and may be linked to an Organization.

### 4.36 Audit Log

An immutable record of every significant action performed within the system. Audit Logs capture who did what, when, and from which IP address.

### 4.37 Notification

A system-generated message sent to a User. Notifications cover status changes, submissions, reviews, and system alerts.

### 4.38 Search Index

A denormalized representation of domain entities optimized for full-text search. The Search Index is maintained asynchronously and updated from authoritative entity data.

### 4.39 API Client

A registered application or service authorized to access the tProkash API. API Clients have credentials, rate limits, and scope restrictions.

### 4.40 Dataset

A packaged collection of domain data intended for public or restricted release. Datasets have versions, licenses, and download statistics.

### 4.41 Source

A reference that establishes the provenance of a fact or record. Sources include documents, websites, interviews, and official records. Every published fact links to at least one Source.

### 4.42 Verification

A record indicating the verification status of an entity or fact. Verification includes the verification level, verifier identity, date, and method.

---

## 5. Relationships

### Publisher — Imprint

A Publisher may have zero or more Imprints. An Imprint belongs to exactly one Publisher.

### Publisher — Book (publication)

A Book may be published by one or more Publishers (co-publication). A Publisher may publish zero or more Books. This is a many-to-many relationship managed through a book_publisher junction.

### Imprint — Book

A Book may be published under zero or one Imprint. An Imprint may have zero or more Books.

### Author — Book

An Author may write zero or more Books. A Book may have one or more Authors. This is a many-to-many relationship managed through a book_author junction.

### Contributor — Book

A Contributor may contribute to zero or more Books. A Book may have zero or more Contributors. The relationship carries a role attribute specifying the contribution type.

### Book — Edition

A Book may have one or more Editions. An Edition belongs to exactly one Book.

### Edition — ISBN

An Edition may have one or more ISBNs (different formats). An ISBN belongs to exactly one Edition.

### Edition — Language

An Edition is written in exactly one Language. A Language may apply to zero or more Editions.

### Book — Category

A Book may belong to one or more Categories. A Category may contain zero or more Books. Categories form a self-referencing hierarchy (parent-child).

### Book — Series

A Book may belong to zero or one Series. A Series may contain one or more Books. Books within a Series have a sequence number.

### Book — Collection

A Book may belong to zero or more Collections. A Collection may contain zero or more Books.

### Book — Editor

A Book may be edited by one or more Editors. An Editor may work on zero or more Books.

### Book — Translator

A Book may be translated by one or more Translators. A Translator may work on zero or more Books.

### Book — Illustrator

A Book may be illustrated by one or more Illustrators. An Illustrator may work on zero or more Books.

### Book — Designer

A Book may be designed by one or more Designers. A Designer may work on zero or more Books.

### Edition — Printer

An Edition may be printed by one or more Printers. A Printer may print zero or more Editions.

### Edition — Printing

An Edition may have one or more Printings. A Printing belongs to exactly one Edition.

### Printing — Printer

A Printing is executed by exactly one Printer. A Printer may execute zero or more Printings.

### Edition — Warehouse — Inventory

An Edition may be stored in one or more Warehouses. A Warehouse may store zero or more Editions. Inventory records the quantity of a specific Edition at a specific Warehouse.

### Edition — Distributor

An Edition may be distributed by one or more Distributors. A Distributor may distribute zero or more Editions.

### Distributor — Bookstore

A Distributor may supply zero or more Bookstores. A Bookstore may be supplied by one or more Distributors.

### Bookstore — Book

A Bookstore may stock zero or more Books. A Book may be stocked by zero or more Bookstores.

### Reader — Review

A Reader may write zero or more Reviews. A Review is written by exactly one Reader.

### Book — Review

A Book may have zero or more Reviews. A Review belongs to exactly one Book.

### Book — Award

A Book may receive zero or more Awards. An Award may be given to zero or more Books.

### Author — Award

An Author may receive zero or more Awards. An Award may be given to zero or more Authors.

### Publisher — Award

A Publisher may receive zero or more Awards. An Award may be given to zero or more Publishers.

### Book — Event

A Book may be associated with zero or more Events. An Event may feature zero or more Books.

### Author — Event

An Author may participate in zero or more Events. An Event may have zero or more Authors.

### Organization — Event

An Organization may host or sponsor zero or more Events. An Event may involve zero or more Organizations.

### Publisher — Organization

A Publisher may be a member of zero or more Organizations. An Organization may have zero or more Publisher members.

### Publisher — License

A Publisher may hold zero or more Licenses. A License is granted to exactly one Publisher.

### Author — Contract

An Author may sign zero or more Contracts. A Contract involves exactly one Author and one Publisher.

### Publisher — Contract

A Publisher may enter into zero or more Contracts. A Contract involves exactly one Publisher.

### Book — Contract

A Contract covers one or more Books. A Book may be covered by zero or more Contracts.

### Author — Submission

An Author may submit zero or more Submissions. A Submission is made by exactly one Author or agent.

### Publisher — Submission

A Publisher may receive zero or more Submissions. A Submission is addressed to exactly one Publisher.

### Book — Digital Asset

A Book may have zero or more Digital Assets. A Digital Asset belongs to exactly one Book.

### Entity — Tag

Any major entity may be tagged with zero or more Tags. A Tag may be applied to zero or more entities.

### User — Role

A User is assigned exactly one Role. A Role may have zero or more Users.

### Role — Permission

A Role grants zero or more Permissions. A Permission may be included in zero or more Roles.

### User — Audit Log

A User may be associated with zero or more Audit Log entries. An Audit Log entry references exactly one User.

### User — Notification

A User may receive zero or more Notifications. A Notification is sent to exactly one User.

### Entity — Source

Any fact or record may be attributed to one or more Sources. A Source may support zero or more facts.

### Entity — Verification

Any entity may have one or more Verification records. A Verification record belongs to exactly one entity.

### Publisher — Dataset

A Publisher may contribute data to one or more Datasets. A Dataset may aggregate data from one or more Publishers.

### Author — Reader

An Author may optionally have a Reader account. A Reader account may optionally be linked to an Author profile.

---

## 6. Business Rules

1.  A Book must have at least one Author.
2.  A Book must have a title in at least one language.
3.  A Book may have multiple Editions.
4.  An Edition belongs to exactly one Book.
5.  An Edition must have exactly one Language.
6.  An ISBN belongs to exactly one Edition.
7.  An ISBN must be exactly 10 or 13 digits (excluding hyphens).
8.  An ISBN must be unique across all Editions.
9.  An ISBN may be reassigned only if the Edition is deleted.
10. An Edition may have multiple ISBNs for different formats (hardcover, paperback, eBook).
11. A Publisher may operate multiple Imprints.
12. An Imprint belongs to exactly one Publisher.
13. An Imprint name must be unique within its Publisher.
14. A Publisher may publish zero or more Books.
15. A Book may be co-published by multiple Publishers.
16. Co-publication requires a Contract between the Publishers.
17. A Book may belong to zero or one Series.
18. A Series may contain one or more Books.
19. Books within a Series must have a sequence number.
20. A Book may belong to exactly one Category at the leaf level.
21. A Category may be a parent of zero or more subcategories.
22. A Category may not be its own ancestor.
23. A Book may be tagged with zero or more Tags.
24. A Tag must have a unique name within its namespace.
25. An Author may write multiple Books.
26. An Author may use a pseudonym (pen name).
27. A pseudonym is treated as a separate Author record.
28. An Author may be linked to a Reader account.
29. A Contributor must have a role (Editor, Translator, Illustrator, Designer).
30. A Contributor role must be one of the defined Contributor types.
31. A Printer may execute multiple Printings.
32. A Printing belongs to exactly one Edition.
33. A Printing must have a quantity greater than zero.
34. A Printing must have a scheduled or completed date.
35. An Edition may be printed by multiple Printers across different Printings.
36. A Warehouse may store multiple Editions.
37. An Edition may be stored in multiple Warehouses.
38. Inventory quantity on hand must be non-negative.
39. Inventory quantity reserved must not exceed quantity on hand.
40. A Distributor may distribute multiple Editions.
41. An Edition may be distributed by multiple Distributors.
42. A Distributor must have a valid name and contact.
43. A Bookstore may be supplied by multiple Distributors.
44. A Bookstore may stock multiple Books.
45. A Book may be stocked by multiple Bookstores.
46. A Reader may write multiple Reviews.
47. A Review belongs to exactly one Book.
48. A Review must have a rating between 1 and 5.
49. A Reader may write only one Review per Book.
50. An Award must have a name and year.
51. An Award may be granted to a Book, Author, Publisher, or other entity.
52. An Award category must be unique within its Award and year.
53. An Event must have a name, date, and location.
54. An Event may be associated with multiple Books and Authors.
55. An Organization may host or sponsor multiple Events.
56. A Contract must involve exactly two parties.
57. A Contract must have a start date.
58. A Contract may have an end date.
59. A Contract may cover multiple Books.
60. A Contract must reference a License where applicable.
61. A Submission must have a status (Draft, Submitted, Under Review, Accepted, Rejected, Withdrawn).
62. A Submission may transition only through valid statuses.
63. A Submission must be associated with exactly one Publisher.
64. A Submission may be associated with one or more Authors.
65. A License must specify the rights granted.
66. A License must specify territory (e.g., Bangladesh, Worldwide).
67. A License must have a start date.
68. A License may have an end date.
69. A License without an end date is perpetual.
70. A Digital Asset must have a filename and MIME type.
71. A Digital Asset must belong to exactly one Book.
72. A Digital Asset file must not exceed the configured size limit.
73. A User must have a unique email address.
74. A User must have exactly one Role.
75. A Role may have zero or more Permissions.
76. A Permission is defined by action and resource (e.g., book.create, publisher.update).
77. An Audit Log entry must record actor, action, target, and timestamp.
78. An Audit Log entry is immutable after creation.
79. A Notification must have a recipient, subject, and body.
80. A Notification may be sent via email, in-app, or both.
81. A Search Index entry is derived from authoritative entity data.
82. A Search Index must be refreshed within a defined interval.
83. An API Client must have a unique client ID and secret.
84. An API Client must be rate-limited to prevent abuse.
85. A Dataset must have a version number.
86. A Dataset must reference a License.
87. A Dataset may aggregate data from multiple Publishers.
88. A Source must be of a defined type (Document, Website, Interview, Official Record, Other).
89. Every published fact must be traceable to at least one Source.
90. A Verification record must include a verification level.
91. Verification levels are Verified, Partially Verified, Community Verified, and Needs Review.
92. A fact may be re-verified at any time.
93. A verified fact may be downgraded if new evidence contradicts it.
94. An entity that is soft-deleted retains its ID and is not reused.
95. Soft-deleted entities are excluded from query results by default.
96. ID prefixes must be unique by entity type (AUT for Author, PUB for Publisher, etc.).
97. Timestamps must be stored in UTC.
98. All monetary values must be stored with currency code.
99. Character data must support Unicode (UTF-8) for Bengali and English text.

---

## 7. Lifecycle

### 7.1 Book

```
Draft -> Under Contract -> In Development -> Manuscript Complete
   -> Editing -> Typesetting -> Proofreading -> Printing
   -> Published -> Out of Print -> Out of Stock Indefinitely
```

| State | Description |
|---|---|
| Draft | Idea stage, no formal commitment |
| Under Contract | Author signed, publisher committed |
| In Development | Manuscript being written or commissioned |
| Manuscript Complete | Full manuscript delivered |
| Editing | Developmental and copy editing |
| Typesetting | Interior layout and design |
| Proofreading | Final error check |
| Printing | Physical or digital production |
| Published | Available for sale |
| Out of Print | No active editions |
| Out of Stock Indefinitely | No current print run planned |

### 7.2 Edition

```
Planned -> In Production -> Available -> Out of Stock -> Reprinting -> Available
                                          -> Out of Print
```

| State | Description |
|---|---|
| Planned | Edition scheduled but not started |
| In Production | Layout, printing, or digital conversion |
| Available | In stock and sellable |
| Out of Stock | Temporarily unavailable |
| Reprinting | New printing underway |
| Out of Print | Permanently discontinued |

### 7.3 Publisher

```
Inactive -> Active -> Suspended -> Active
                   -> Defunct
```

| State | Description |
|---|---|
| Inactive | Registered but not yet publishing |
| Active | Currently publishing |
| Suspended | Temporarily inactive (administrative) |
| Defunct | Ceased operations permanently |

### 7.4 Submission

```
Draft -> Submitted -> Under Review -> Accepted -> Under Contract
                                    -> Rejected
           -> Withdrawn
```

| State | Description |
|---|---|
| Draft | Author preparing, not yet sent |
| Submitted | Delivered to publisher |
| Under Review | Publisher evaluating |
| Accepted | Publisher wants to proceed |
| Rejected | Publisher declined |
| Withdrawn | Author cancelled submission |
| Under Contract | Contract signed, transitioning to Book lifecycle |

### 7.5 Printing

```
Scheduled -> In Progress -> Completed -> Delivered
                                     -> Partial
                        -> Cancelled
```

| State | Description |
|---|---|
| Scheduled | Printing date set |
| In Progress | Printing underway |
| Completed | Printing finished |
| Partial | Partial delivery |
| Delivered | All copies delivered to warehouse |
| Cancelled | Print run cancelled |

### 7.6 Distribution

```
Planned -> In Transit -> At Warehouse -> Allocated -> Shipped -> Delivered
                                                             -> Lost
                     -> On Hold
```

| State | Description |
|---|---|
| Planned | Distribution scheduled |
| In Transit | Moving between locations |
| At Warehouse | Received and inventoried |
| Allocated | Reserved for an order |
| Shipped | Dispatched to destination |
| Delivered | Received by recipient |
| Lost | Shipment lost in transit |
| On Hold | Distribution paused |

---

## 8. Glossary

| Term | Definition |
|---|---|
| **Author** | A person who creates the original intellectual content of a Book. |
| **Advance** | A pre-publication payment made by a Publisher to an Author against future royalties. |
| **Backlist** | Books published in previous seasons that remain in print. |
| **Bengali (bn)** | The primary language of Bangladesh, also known as Bangla. |
| **BISAC** | Book Industry Standards and Communications — subject category codes. |
| **Blurb** | A short promotional description of a Book, often on the back cover. |
| **Colophon** | A publisher's emblem or imprint logo. |
| **Contributor** | A person who contributes to a Book in a defined role other than Author. |
| **Copy Editing** | Correction of grammar, spelling, punctuation, and consistency. |
| **Copyright** | Legal right protecting an Author's original work. |
| **Cover** | The outer binding of a Book, including front, spine, and back. |
| **Dataset** | A packaged export of structured domain data. |
| **Developmental Editing** | Substantive editing of structure, content, and narrative. |
| **Distributor** | An intermediary that supplies books from publishers to retailers. |
| **Edition** | A specific version of a Book, distinguished by content or format changes. |
| **Endsheet** | The paper connecting the book block to the cover. |
| **Frontlist** | Newly published or soon-to-be-published Books. |
| **Gutter** | The inner margin of a Book page near the spine. |
| **Imprint** | A distinct brand or trade name under which a Publisher releases works. |
| **ISBN** | International Standard Book Number — a unique identifier for Editions. |
| **ISSN** | International Standard Serial Number — for serial publications. |
| **Junction Table** | A database table that resolves a many-to-many relationship. |
| **Manuscript** | The original text of a Book before publication. |
| **Masthead** | A listing of a publication's staff and contributors. |
| **Proofreading** | Final review of typeset pages for errors before printing. |
| **Publisher** | An organization that produces and distributes literary works. |
| **Recto** | A right-hand page of a Book (odd-numbered). |
| **Royalty** | A percentage of sales paid to an Author by the Publisher. |
| **Self-Publishing** | Publication by the Author without a traditional Publisher. |
| **Series** | A sequence of related Books released under a shared title or branding. |
| **Slug** | A URL-friendly identifier derived from a name or title. |
| **Spine** | The edge of a Book where pages are bound, bearing the title and author. |
| **Submission** | A manuscript or proposal submitted to a Publisher for consideration. |
| **Trim Size** | The dimensions of a Book's pages after binding. |
| **Typesetting** | The process of arranging text and images for printing. |
| **Vanity Press** | A publisher that charges authors for production. |
| **Verso** | A left-hand page of a Book (even-numbered). |

---

## 9. Future Expansion

The following domains are reserved for future specification. No entities, relationships, or rules are defined for these areas in this document. Each will be addressed in a subsequent architecture document.

### 9.1 AI

Reserved for machine learning models, recommendation engines, automated classification, content analysis, and AI-assisted search. Future entities may include Model, Training Set, Prediction, and Embedding.

### 9.2 Marketplace

Reserved for a direct-to-reader e-commerce platform connecting Publishers, Bookstores, and Readers. Future entities may include Cart, Order, Invoice, Payment, and Shipment.

### 9.3 Self Publishing

Reserved for tools and workflows enabling Authors to publish independently without a traditional Publisher. Future entities may include SelfPub Project, Publishing Package, and Author Dashboard.

### 9.4 Rights Management

Reserved for tracking and managing intellectual property rights across territories, languages, and formats. Future entities may include Rights Holding, Rights Transaction, and Option.

### 9.5 Royalty

Reserved for calculating, tracking, and disbursing royalty payments to Authors and Contributors. Future entities may include Royalty Statement, Royalty Rate, Sales Report, and Payment Run.

### 9.6 Print on Demand

Reserved for just-in-time printing where single copies are printed per order. Future entities may include POD Profile, POD Cost, and POD Supplier.

### 9.7 eBook

Reserved for digital book formats (EPUB, MOBI, PDF) and their distribution. Future entities may include eBook Format, DRM License, and eBook Retailer.

### 9.8 Audiobook

Reserved for audio-based book productions. Future entities may include Audiobook Recording, Narrator, Audio Format, and Audio Distributor.

---

## Document History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0.0 | 2026-07-06 | tProkash Core | Initial consolidated domain architecture |
