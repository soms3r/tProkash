# Relationship Registry

**Version:** 1.0.0\
**Status:** Approved

---

| # | Left Entity | Relationship | Right Entity | Cardinality | Description |
|---|---|---|---|---|---|
| 1 | Publisher | has | Imprint | 1:N | A Publisher may have zero or more Imprints. An Imprint belongs to exactly one Publisher. |
| 2 | Publisher | publishes | Book | M:N | A Publisher may publish zero or more Books. A Book may be published by one or more Publishers. (book_publisher) |
| 3 | Publisher | receives | Submission | 1:N | A Publisher may receive zero or more Submissions. A Submission is addressed to exactly one Publisher. |
| 4 | Publisher | signs | Contract | 1:N | A Publisher may enter into zero or more Contracts. |
| 5 | Publisher | holds | License | 1:N | A Publisher may hold zero or more Licenses. |
| 6 | Publisher | belongs to | Organization | M:N | A Publisher may be a member of zero or more Organizations. (organization_member) |
| 7 | Publisher | receives | Award | M:N | A Publisher may receive zero or more Awards. (book_award polymorphic) |
| 8 | Publisher | located at | Address | N:1 | A Publisher may have one or more Addresses. |
| 9 | Publisher | has | Contact Method | 1:N | A Publisher may have zero or more Contact Methods. |
| 10 | Imprint | belongs to | Publisher | N:1 | An Imprint belongs to exactly one Publisher. |
| 11 | Imprint | publishes | Book | 1:N | An Imprint may publish zero or more Books. |
| 12 | Person | writes | Book | M:N | A Person (as Author) may write zero or more Books. A Book may have one or more Authors. (book_author) |
| 13 | Person | contributes to | Book | M:N | A Person (as Contributor) may contribute to zero or more Books with a specific role. (book_contributor) |
| 14 | Person | submits | Submission | M:N | A Person may submit zero or more Submissions. (submission_author) |
| 15 | Person | reviews | Book | 1:N | A Person (as Reader) may write zero or more Reviews. |
| 16 | Person | uses | User | 1:1 | A Person may optionally have a linked User account. |
| 17 | Person | lives at | Address | N:1 | A Person may have one or more Addresses. |
| 18 | Person | has | Contact Method | 1:N | A Person may have zero or more Contact Methods. |
| 19 | Book | has | Edition | 1:N | A Book may have one or more Editions. An Edition belongs to exactly one Book. |
| 20 | Book | belongs to | Category | M:N | A Book may belong to one or more Categories. (book_category) |
| 21 | Book | belongs to | Series | N:1 | A Book may belong to zero or one Series. |
| 22 | Book | belongs to | Collection | M:N | A Book may belong to zero or more Collections. (book_collection) |
| 23 | Book | tagged with | Tag | M:N | A Book may be tagged with zero or more Tags. (book_tag) |
| 24 | Book | has | Keyword | M:N | A Book may have zero or more Keywords. (book_keyword) |
| 25 | Book | receives | Award | M:N | A Book may receive zero or more Awards. (book_award) |
| 26 | Book | has | Review | 1:N | A Book may have zero or more Reviews. |
| 27 | Book | featured at | Event | M:N | A Book may be featured at zero or more Events. (book_event) |
| 28 | Book | has | Digital Asset | 1:N | A Book may have zero or more Digital Assets. |
| 29 | Book | has | Media Asset | 1:N | A Book may have zero or more Media Assets. |
| 30 | Book | published under | Imprint | N:1 | A Book may be published under zero or one Imprint. |
| 31 | Book | covered by | Contract | M:N | A Book may be covered by zero or more Contracts. (contract_book) |
| 32 | Edition | belongs to | Book | N:1 | An Edition belongs to exactly one Book. |
| 33 | Edition | has | ISBN | 1:N | An Edition may have one or more ISBNs. |
| 34 | Edition | written in | Language | N:1 | An Edition is written in exactly one Language. |
| 35 | Edition | printed by | Printer | M:N | An Edition may be printed by one or more Printers through Printings. |
| 36 | Edition | has | Printing | 1:N | An Edition may have one or more Printings. |
| 37 | Edition | stored at | Warehouse | M:N | An Edition may be stored at one or more Warehouses. (inventory) |
| 38 | Edition | distributed by | Distributor | M:N | An Edition may be distributed by one or more Distributors. (edition_distributor) |
| 39 | Edition | stocked at | Bookstore | M:N | An Edition may be stocked at zero or more Bookstores. (bookstore_inventory) |
| 40 | ISBN | belongs to | Edition | N:1 | An ISBN belongs to exactly one Edition. |
| 41 | Category | parent of | Category | 1:N | A Category may be a parent of zero or more subcategories (self-referencing). |
| 42 | Series | contains | Book | 1:N | A Series may contain one or more Books. |
| 43 | Collection | contains | Book | M:N | A Collection may contain zero or more Books. (book_collection) |
| 44 | Printer | executes | Printing | 1:N | A Printer may execute zero or more Printings. |
| 45 | Printing | belongs to | Edition | N:1 | A Printing belongs to exactly one Edition. |
| 46 | Printing | part of | Print Batch | N:1 | A Printing may optionally belong to a Print Batch. |
| 47 | Printing | executed by | Printer | N:1 | A Printing is executed by exactly one Printer. |
| 48 | Print Batch | contains | Printing | 1:N | A Print Batch may contain one or more Printings. |
| 49 | Warehouse | houses | Inventory | 1:N | A Warehouse may have zero or more Inventory records. |
| 50 | Inventory | references | Edition | N:1 | An Inventory record references exactly one Edition. |
| 51 | Inventory | references | Warehouse | N:1 | An Inventory record references exactly one Warehouse. |
| 52 | Distributor | supplies | Bookstore | M:N | A Distributor may supply zero or more Bookstores. (distributor_bookstore) |
| 53 | Distributor | distributes | Edition | M:N | A Distributor may distribute zero or more Editions. (edition_distributor) |
| 54 | Bookstore | supplied by | Distributor | M:N | A Bookstore may be supplied by one or more Distributors. (distributor_bookstore) |
| 55 | Bookstore | stocks | Edition | M:N | A Bookstore may stock zero or more Editions. (bookstore_inventory) |
| 56 | Bookstore | located at | Address | N:1 | A Bookstore may have one or more Addresses. |
| 57 | Reader | authors | Review | 1:N | A Reader may write zero or more Reviews. |
| 58 | Reader | links to | Person | 1:1 | A Reader may optionally link to a Person (Author). |
| 59 | Review | belongs to | Book | N:1 | A Review belongs to exactly one Book. |
| 60 | Review | written by | Reader | N:1 | A Review is written by exactly one Reader. |
| 61 | Award | granted to | Entity | N:1 | An Award may be granted to a Book, Publisher, Author, or Event (polymorphic). |
| 62 | Award | organized by | Organization | N:1 | An Award may be organized by exactly one Organization. |
| 63 | Event | hosted by | Organization | N:1 | An Event may be hosted by exactly one Organization. |
| 64 | Event | features | Book | M:N | An Event may feature zero or more Books. (book_event) |
| 65 | Event | features | Person | M:N | An Event may feature zero or more Persons. (event_participant) |
| 66 | Organization | hosts | Event | 1:N | An Organization may host zero or more Events. |
| 67 | Organization | grants | Award | 1:N | An Organization may grant zero or more Awards. |
| 68 | Organization | has | Member | M:N | An Organization may have zero or more members (Publisher or Person). (organization_member) |
| 69 | License | owned by | Publisher | N:1 | A License is granted to exactly one Publisher. |
| 70 | Contract | involves | Party | M:N | A Contract involves two parties tracked via contract_party. |
| 71 | Contract | covers | Book | M:N | A Contract may cover one or more Books. (contract_book) |
| 72 | Contract | references | License | N:1 | A Contract may reference one License. |
| 73 | Submission | submitted by | Person | M:N | A Submission may be submitted by one or more Persons. (submission_author) |
| 74 | Submission | sent to | Publisher | N:1 | A Submission is addressed to exactly one Publisher. |
| 75 | Submission | results in | Contract | 1:1 | An accepted Submission may result in one Contract. |
| 76 | Digital Asset | belongs to | Book | N:1 | A Digital Asset belongs to exactly one Book. |
| 77 | Media Asset | references | Entity | N:1 | A Media Asset may reference a Book, Person, Event, or Publisher (polymorphic). |
| 78 | Tag | applied to | Entity | M:N | A Tag may be applied to multiple entities. (entity_tag) |
| 79 | Keyword | associated with | Book | M:N | A Keyword may be associated with zero or more Books. (book_keyword) |
| 80 | Dataset | published by | Publisher | N:1 | A Dataset may be published by exactly one Publisher. |
| 81 | Dataset | references | Source | M:N | A Dataset may reference zero or more Sources. |
| 82 | Source | verifies | Entity | M:N | A Source may verify one or more entities. (entity_source) |
| 83 | Verification | applies to | Entity | N:1 | A Verification record applies to exactly one entity (polymorphic). |
| 84 | Verification | performed by | User | N:1 | A Verification is performed by exactly one User. |
| 85 | Role | grants | Permission | M:N | A Role may grant zero or more Permissions. (role_permission) |
| 86 | Role | assigned to | User | 1:N | A Role may be assigned to zero or more Users. |
| 87 | User | has | Role | N:1 | A User is assigned exactly one Role. |
| 88 | User | owns | Audit Log | 1:N | A User may be associated with zero or more Audit Log entries. |
| 89 | User | linked to | Person | 1:1 | A User may optionally be linked to a Person. |
| 90 | Audit Log | references | User | N:1 | An Audit Log entry references exactly one User (or NULL for anonymous). |
| 91 | Notification | sent to | User | N:1 | A Notification is sent to exactly one User. |
| 92 | API Client | owned by | User | N:1 | An API Client is owned by exactly one User. |
| 93 | Search Index | derived from | Entity | 1:1 | A Search Index entry maps to exactly one domain entity. |
| 94 | Country | contains | City | 1:N | A Country may contain zero or more Cities. |
| 95 | City | located in | Country | N:1 | A City belongs to exactly one Country. |
| 96 | City | contains | Address | 1:N | A City may contain zero or more Addresses. |
| 97 | Address | located in | City | N:1 | An Address belongs to exactly one City. |
| 98 | Address | belongs to | Entity | N:1 | An Address may belong to a Publisher, Person, Bookstore, or Warehouse (polymorphic). |
| 99 | Contact Method | belongs to | Entity | N:1 | A Contact Method belongs to exactly one entity (polymorphic). |
| 100 | Permission | granted via | Role | M:N | A Permission may be granted through zero or more Roles. (role_permission) |
