# Entity Registry

**Version:** 1.0.0\
**Status:** Approved

---

| # | Entity | Table | Owner | Description | Primary Key | Status |
|---|---|---|---|---|---|---|
| 1 | Publisher | publisher | Core | Organization that produces and distributes literary works | publisher_id | Active |
| 2 | Imprint | imprint | Core | A trade name or brand under which a Publisher releases works | imprint_id | Active |
| 3 | Author | person | Core | A person who creates original intellectual content of a Book | person_id | Active |
| 4 | Contributor | book_contributor | Core | A person who contributes to a Book in a non-author capacity | (book_id, person_id) | Active |
| 5 | Book | book | Core | The core intellectual unit representing a distinct work | book_id | Active |
| 6 | Edition | edition | Core | A specific version of a Book | edition_id | Active |
| 7 | ISBN | isbn | Core | International Standard Book Number — unique identifier for an Edition | isbn_id | Active |
| 8 | Language | language | Core | The language in which a Book or Edition is written | language_id | Active |
| 9 | Category | category | Core | A subject classification or genre assigned to a Book | category_id | Active |
| 10 | Series | series | Core | A sequence of related Books under a common title or branding | series_id | Active |
| 11 | Collection | collection | Core | A user-defined or editorially curated grouping of Books | collection_id | Active |
| 12 | Editor | book_contributor | Core | A person who prepares a Book for publication (role-based) | (book_id, person_id) | Active |
| 13 | Translator | book_contributor | Core | A person who converts a Book between languages (role-based) | (book_id, person_id) | Active |
| 14 | Illustrator | book_contributor | Core | A person who creates visual content for a Book (role-based) | (book_id, person_id) | Active |
| 15 | Designer | book_contributor | Core | A person responsible for visual layout of a Book (role-based) | (book_id, person_id) | Active |
| 16 | Printer | printer | Production | Organization that physically produces printed copies | printer_id | Active |
| 17 | Printing | printing | Production | A specific print run of an Edition | printing_id | Active |
| 18 | Print Batch | print_batch | Production | A grouped collection of Printings for operational tracking | print_batch_id | Active |
| 19 | Warehouse | warehouse | Logistics | Physical location where printed books are stored | warehouse_id | Active |
| 20 | Inventory | inventory | Logistics | Stock of a specific Edition at a specific Warehouse | inventory_id | Active |
| 21 | Distributor | distributor | Distribution | Organization that supplies books to retailers | distributor_id | Active |
| 22 | Bookstore | bookstore | Retail | Retail outlet that sells Books to Readers | bookstore_id | Active |
| 23 | Reader | reader | Community | A person who reads or purchases Books | reader_id | Active |
| 24 | Review | review | Community | A reader-submitted evaluation of a Book | review_id | Active |
| 25 | Award | award | Events | A prize or honor given to a Book, Author, Publisher, or other entity | award_id | Active |
| 26 | Event | event | Events | A scheduled occurrence related to publishing | event_id | Active |
| 27 | Organization | organization | Governance | Any legal or institutional entity in the publishing ecosystem | organization_id | Active |
| 28 | License | license | Legal | A legal instrument governing use of intellectual property | license_id | Active |
| 29 | Contract | contract | Legal | A legally binding agreement between two parties | contract_id | Active |
| 30 | Submission | submission | Workflow | A proposal or manuscript submitted to a Publisher for consideration | submission_id | Active |
| 31 | Media Asset | media_asset | Content | External media coverage related to a Book, Author, or Event | media_asset_id | Active |
| 32 | Digital Asset | digital_asset | Content | A digital file associated with a Book or Edition | digital_asset_id | Active |
| 33 | Tag | tag | Taxonomy | A free-form label for classification and discovery | tag_id | Active |
| 34 | Keyword | keyword | Search | A searchable term associated with a Book or Edition | keyword_id | Active |
| 35 | Dataset | dataset | Data | A packaged collection of domain data for release | dataset_id | Active |
| 36 | Source | source | Governance | A reference establishing provenance of a fact or record | source_id | Active |
| 37 | Verification | verification | Governance | A record indicating verification status of an entity or fact | verification_id | Active |
| 38 | Role | role | Auth | A named function grouping Permissions for assignment to Users | role_id | Active |
| 39 | Permission | permission | Auth | A discrete authorization to perform an action | permission_id | Active |
| 40 | User | user | Auth | A person with authenticated access to the system | user_id | Active |
| 41 | Audit Log | audit_log | System | An immutable record of every significant action | audit_log_id | Active |
| 42 | Notification | notification | System | A system-generated message sent to a User | notification_id | Active |
| 43 | Search Index | search_index | System | A denormalized representation optimized for full-text search | search_index_id | Active |
| 44 | API Client | api_client | System | A registered application authorized to access the API | api_client_id | Active |
| 45 | Country | country | Geography | A sovereign state or territory | country_id | Active |
| 46 | City | city | Geography | A populated place within a Country | city_id | Active |
| 47 | Address | address | Geography | A structured physical location | address_id | Active |
| 48 | Contact Method | contact_method | Communication | A means of contacting an entity (phone, email, social) | contact_method_id | Active |
