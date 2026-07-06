# tProkash Database Data Dictionary

> **Ecosystem:** tProkash Publishing Ecosystem — Bangladesh  
> **Convention:** All primary keys use `VARCHAR(15)` with prefixed IDs  
> **Audit Columns:** Every table includes `created_at`, `updated_at`, and nullable `deleted_at` (all `TIMESTAMP` unless noted)

---

## 1. Publisher

### Table
`publisher`

### Purpose
Core entity representing a publishing house registered in the tProkash ecosystem. Stores both Bengali and English names, verification status, and linked address for each publisher.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| publisher_id | VARCHAR(15) | PK | Primary key, prefixed PUB-XXXXXXXXXX |
| name_bn | TEXT | NOT NULL | Publisher name in Bengali |
| name_en | TEXT | NOT NULL | Publisher name in English |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| website_url | TEXT | | Publisher website URL |
| founded_year | INTEGER | | Year the publisher was founded |
| status | VARCHAR(50) | DEFAULT 'active' | Current operational status |
| description_bn | TEXT | | Publisher description in Bengali |
| description_en | TEXT | | Publisher description in English |
| logo_url | TEXT | | URL to publisher logo |
| verification_level | VARCHAR(50) | DEFAULT 'Needs Review' | Verification status level |
| address_id | VARCHAR(15) | FK -> address, nullable | Reference to address record |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `address_id` references `address(address_id)` — many-to-one

### Constraints
- PK: `publisher_id`
- FK: `address_id` → `address(address_id)` ON DELETE SET NULL
- UNIQUE: `slug`

### Future Notes
- Consider adding `tax_id`, `bank_account_info` columns for financial workflows.

---

## 2. Imprint

### Table
`imprint`

### Purpose
Represents a publishing imprint or brand under a parent publisher. Allows a single publisher to manage multiple distinct imprints.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| imprint_id | VARCHAR(15) | PK | Primary key, prefixed IMP-XXXXXXXXXX |
| publisher_id | VARCHAR(15) | FK -> publisher, NOT NULL | Parent publisher |
| name_bn | TEXT | NOT NULL | Imprint name in Bengali |
| name_en | TEXT | NOT NULL | Imprint name in English |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| description | TEXT | | Imprint description |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `publisher_id` references `publisher(publisher_id)` — many-to-one

### Constraints
- PK: `imprint_id`
- FK: `publisher_id` → `publisher(publisher_id)` ON DELETE CASCADE
- UNIQUE: `slug`

### Future Notes
- None currently.

---

## 3. Person

### Table
`person`

### Purpose
Represents any individual in the ecosystem — authors, translators, illustrators, editors, and other contributors. Supports self-referential pseudonym linking.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| person_id | VARCHAR(15) | PK | Primary key, prefixed PER-XXXXXXXXXX |
| name_bn | TEXT | NOT NULL | Person name in Bengali |
| name_en | TEXT | NOT NULL | Person name in English |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| birth_year | INTEGER | | Year of birth |
| death_year | INTEGER | | Year of death |
| biography_bn | TEXT | | Biography in Bengali |
| biography_en | TEXT | | Biography in English |
| website_url | TEXT | | Personal website URL |
| pseudonym_of_id | VARCHAR(15) | FK -> person, nullable, self-ref | Links to the real person if this is a pseudonym |
| verification_level | VARCHAR(50) | DEFAULT 'Needs Review' | Verification status level |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `pseudonym_of_id` references `person(person_id)` — self-referential many-to-one (nullable)

### Constraints
- PK: `person_id`
- FK: `pseudonym_of_id` → `person(person_id)` ON DELETE SET NULL
- UNIQUE: `slug`

### Future Notes
- Consider adding `national_id`, `date_of_birth` for more precise identity management.

---

## 4. Book

### Table
`book`

### Purpose
Central entity representing a published work. Contains bibliographic metadata in both Bengali and English, with optional series association and imprint linkage.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| book_id | VARCHAR(15) | PK | Primary key, prefixed BOK-XXXXXXXXXX |
| title_bn | TEXT | NOT NULL | Book title in Bengali |
| title_en | TEXT | NOT NULL | Book title in English |
| subtitle_bn | TEXT | | Book subtitle in Bengali |
| subtitle_en | TEXT | | Book subtitle in English |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| description_bn | TEXT | | Book description in Bengali |
| description_en | TEXT | | Book description in English |
| imprint_id | VARCHAR(15) | FK -> imprint, nullable | Associated imprint |
| series_id | VARCHAR(15) | FK -> series, nullable | Associated series |
| series_number | INTEGER | | Position within the series |
| num_pages | INTEGER | | Total page count |
| publication_year | INTEGER | | Year of original publication |
| verification_level | VARCHAR(50) | DEFAULT 'Needs Review' | Verification status level |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `imprint_id` references `imprint(imprint_id)` — many-to-one (nullable)
- `series_id` references `series(series_id)` — many-to-one (nullable)

### Constraints
- PK: `book_id`
- FK: `imprint_id` → `imprint(imprint_id)` ON DELETE SET NULL
- FK: `series_id` → `series(series_id)` ON DELETE SET NULL
- UNIQUE: `slug`

### Future Notes
- Consider adding `original_language_id`, `page_direction` (LTR/RTL), `target_audience` columns.

---

## 5. Edition

### Table
`edition`

### Purpose
Represents a specific edition of a book — defined by language, format, and edition number. Tracks pricing, print status, and ISBN linkage.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| edition_id | VARCHAR(15) | PK | Primary key, prefixed EDN-XXXXXXXXXX |
| book_id | VARCHAR(15) | FK -> book, NOT NULL | Parent book |
| language_id | VARCHAR(15) | FK -> language, NOT NULL | Language of this edition |
| edition_number | INTEGER | NOT NULL | Sequential edition number |
| edition_name | TEXT | | Name or label for this edition |
| format | VARCHAR(50) | DEFAULT 'paperback' | Physical format (paperback, hardcover, etc.) |
| isbn_id | VARCHAR(15) | FK -> isbn, nullable | Associated ISBN record |
| publication_date | DATE | | Date of publication |
| num_copies | INTEGER | DEFAULT 0 | Number of copies printed |
| price_bdt | NUMERIC(12,2) | | Retail price in Bangladeshi Taka |
| status | VARCHAR(50) | DEFAULT 'planned' | Publication status |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `book_id` references `book(book_id)` — many-to-one
- `language_id` references `language(language_id)` — many-to-one
- `isbn_id` references `isbn(isbn_id)` — many-to-one (nullable)

### Constraints
- PK: `edition_id`
- FK: `book_id` → `book(book_id)` ON DELETE CASCADE
- FK: `language_id` → `language(language_id)` ON DELETE RESTRICT
- FK: `isbn_id` → `isbn(isbn_id)` ON DELETE SET NULL

### Future Notes
- Consider adding `page_count`, `dimensions`, `weight_grams` for physical edition tracking.

---

## 6. ISBN

### Table
`isbn`

### Purpose
Stores International Standard Book Number records linked to specific editions. Supports multiple ISBNs per edition for different formats.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| isbn_id | VARCHAR(15) | PK | Primary key, prefixed ISB-XXXXXXXXXX |
| edition_id | VARCHAR(15) | FK -> edition, NOT NULL | Associated edition |
| code | VARCHAR(20) | UNIQUE, NOT NULL | The ISBN string (10 or 13 digit) |
| format | VARCHAR(50) | NOT NULL | Format this ISBN applies to |
| issued_date | DATE | | Date the ISBN was issued |
| is_active | BOOLEAN | DEFAULT TRUE | Whether this ISBN is currently active |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `edition_id` references `edition(edition_id)` — many-to-one

### Constraints
- PK: `isbn_id`
- FK: `edition_id` → `edition(edition_id)` ON DELETE CASCADE
- UNIQUE: `code`

### Future Notes
- Consider adding an `is_valid` check constraint for ISBN checksum validation.

---

## 7. Language

### Table
`language`

### Purpose
Lookup table for languages used in editions and content. Uses ISO 639-1 codes and stores names in both Bengali and English.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| language_id | VARCHAR(15) | PK | Primary key, prefixed LNG-XXXXXXXXXX |
| code | VARCHAR(10) | UNIQUE, NOT NULL | ISO 639-1 language code |
| name_bn | TEXT | NOT NULL | Language name in Bengali |
| name_en | TEXT | NOT NULL | Language name in English |
| is_active | BOOLEAN | DEFAULT TRUE | Whether the language is active |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
None.

### Constraints
- PK: `language_id`
- UNIQUE: `code`

### Future Notes
- Consider adding `script` (Bengali, Latin, Arabic) for multilingual support within a single language.

---

## 8. Category

### Table
`category`

### Purpose
Hierarchical taxonomy for classifying books. Supports self-referential parent-child relationships for nested categories (e.g., Fiction → Literary Fiction → Historical).

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| category_id | VARCHAR(15) | PK | Primary key, prefixed CAT-XXXXXXXXXX |
| parent_id | VARCHAR(15) | FK -> category, nullable, self-ref | Parent category |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| name_bn | TEXT | NOT NULL | Category name in Bengali |
| name_en | TEXT | NOT NULL | Category name in English |
| description | TEXT | | Category description |
| level | INTEGER | DEFAULT 0 | Depth level in the hierarchy |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `parent_id` references `category(category_id)` — self-referential many-to-one (nullable)

### Constraints
- PK: `category_id`
- FK: `parent_id` → `category(category_id)` ON DELETE SET NULL
- UNIQUE: `slug`

### Future Notes
- Consider a closure table or nested set model for efficient hierarchical queries at scale.

---

## 9. Contribution Role

### Table
`contribution_role`

### Purpose
Defines the types of contributions a person can make to a book (editor, translator, illustrator, etc.). Acts as a lookup for the book_contributor junction.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| contribution_role_id | VARCHAR(15) | PK | Primary key, prefixed CRL-XXXXXXXXXX |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | URL-friendly identifier |
| name_bn | TEXT | NOT NULL | Role name in Bengali |
| name_en | TEXT | NOT NULL | Role name in English |
| description | TEXT | | Role description |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
None.

### Constraints
- PK: `contribution_role_id`
- UNIQUE: `slug`

### Future Notes
- None currently.

---

## 10. Series

### Table
`series`

### Purpose
Groups books into series (e.g., trilogies, anthologies). Optionally linked to a publisher and tracks active status.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| series_id | VARCHAR(15) | PK | Primary key, prefixed SER-XXXXXXXXXX |
| publisher_id | VARCHAR(15) | FK -> publisher, nullable | Publisher who owns the series |
| name_bn | TEXT | NOT NULL | Series name in Bengali |
| name_en | TEXT | NOT NULL | Series name in English |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| description | TEXT | | Series description |
| is_active | BOOLEAN | DEFAULT TRUE | Whether the series is active |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `publisher_id` references `publisher(publisher_id)` — many-to-one (nullable)

### Constraints
- PK: `series_id`
- FK: `publisher_id` → `publisher(publisher_id)` ON DELETE SET NULL
- UNIQUE: `slug`

### Future Notes
- Consider adding `genre`, `total_books`, `completion_status` for series-level metadata.

---

## 11. Collection

### Table
`collection`

### Purpose
Curated groupings of books for thematic or promotional purposes. Supports public/private visibility for user-facing or internal use.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| collection_id | VARCHAR(15) | PK | Primary key, prefixed COL-XXXXXXXXXX |
| name_bn | TEXT | NOT NULL | Collection name in Bengali |
| name_en | TEXT | NOT NULL | Collection name in English |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| description | TEXT | | Collection description |
| is_public | BOOLEAN | DEFAULT TRUE | Whether the collection is publicly visible |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
None.

### Constraints
- PK: `collection_id`
- UNIQUE: `slug`

### Future Notes
- Consider adding `cover_image_url`, `curator_id`, `featured_from`/`featured_until` for promotional collections.

---

## 12. Printer

### Table
`printer`

### Purpose
Represents printing companies that produce physical books. Stores contact and service information with address linkage.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| printer_id | VARCHAR(15) | PK | Primary key, prefixed PRN-XXXXXXXXXX |
| name_bn | TEXT | NOT NULL | Printer name in Bengali |
| name_en | TEXT | NOT NULL | Printer name in English |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| website_url | TEXT | | Printer website URL |
| address_id | VARCHAR(15) | FK -> address, nullable | Reference to address record |
| services | TEXT | | Description of printing services offered |
| verification_level | VARCHAR(50) | DEFAULT 'Needs Review' | Verification status level |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `address_id` references `address(address_id)` — many-to-one (nullable)

### Constraints
- PK: `printer_id`
- FK: `address_id` → `address(address_id)` ON DELETE SET NULL
- UNIQUE: `slug`

### Future Notes
- Consider adding `contact_person`, `minimum_order_quantity`, `avg_lead_time_days` for operational planning.

---

## 13. Printing

### Table
`printing`

### Purpose
Records individual print jobs for a specific edition at a printer. Tracks quantities, costs, and delivery status.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| printing_id | VARCHAR(15) | PK | Primary key, prefixed PRT-XXXXXXXXXX |
| edition_id | VARCHAR(15) | FK -> edition, NOT NULL | Edition being printed |
| printer_id | VARCHAR(15) | FK -> printer, NOT NULL | Printer executing the job |
| print_batch_id | VARCHAR(15) | FK -> print_batch, nullable | Parent print batch |
| quantity | INTEGER | NOT NULL, CHECK (quantity > 0) | Total quantity ordered |
| quantity_delivered | INTEGER | DEFAULT 0 | Quantity delivered so far |
| start_date | DATE | | Print job start date |
| completion_date | DATE | | Print job completion date |
| cost_bdt | NUMERIC(12,2) | | Total cost in Bangladeshi Taka |
| status | VARCHAR(50) | DEFAULT 'scheduled' | Job status |
| notes | TEXT | | Additional notes |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `edition_id` references `edition(edition_id)` — many-to-one
- `printer_id` references `printer(printer_id)` — many-to-one
- `print_batch_id` references `print_batch(print_batch_id)` — many-to-one (nullable)

### Constraints
- PK: `printing_id`
- FK: `edition_id` → `edition(edition_id)` ON DELETE CASCADE
- FK: `printer_id` → `printer(printer_id)` ON DELETE RESTRICT
- FK: `print_batch_id` → `print_batch(print_batch_id)` ON DELETE SET NULL
- CHECK: `quantity > 0`

### Future Notes
- Consider adding `unit_cost_bdt`, `paper_type`, `binding_type` for cost analysis.

---

## 14. Print Batch

### Table
`print_batch`

### Purpose
Groups multiple printing jobs into a single batch for coordinated production planning and cost aggregation.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| print_batch_id | VARCHAR(15) | PK | Primary key, prefixed PBH-XXXXXXXXXX |
| batch_name | VARCHAR(255) | NOT NULL | Human-readable batch name |
| description | TEXT | | Batch description |
| scheduled_date | DATE | | Planned start date |
| completed_date | DATE | | Actual completion date |
| status | VARCHAR(50) | DEFAULT 'planned' | Batch status |
| notes | TEXT | | Additional notes |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
None.

### Constraints
- PK: `print_batch_id`

### Future Notes
- Consider adding `total_cost_bdt`, `total_quantity` as computed/denormalized fields for reporting.

---

## 15. Warehouse

### Table
`warehouse`

### Purpose
Represents physical storage locations where book inventory is held. Tracks location, capacity, and operational status.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| warehouse_id | VARCHAR(15) | PK | Primary key, prefixed WHR-XXXXXXXXXX |
| name_bn | TEXT | NOT NULL | Warehouse name in Bengali |
| name_en | TEXT | NOT NULL | Warehouse name in English |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| address_id | VARCHAR(15) | FK -> address, nullable | Reference to address record |
| capacity | INTEGER | | Maximum storage capacity |
| is_active | BOOLEAN | DEFAULT TRUE | Whether the warehouse is active |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `address_id` references `address(address_id)` — many-to-one (nullable)

### Constraints
- PK: `warehouse_id`
- FK: `address_id` → `address(address_id)` ON DELETE SET NULL
- UNIQUE: `slug`

### Future Notes
- Consider adding `capacity_unit`, `contact_person`, `operating_hours`.

---

## 16. Inventory

### Table
`inventory`

### Purpose
Tracks stock levels for each edition per warehouse. Enforces non-negative quantities and supports reorder thresholds for supply chain management.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| inventory_id | VARCHAR(15) | PK | Primary key, prefixed INV-XXXXXXXXXX |
| edition_id | VARCHAR(15) | FK -> edition, NOT NULL | Edition in inventory |
| warehouse_id | VARCHAR(15) | FK -> warehouse, NOT NULL | Warehouse location |
| quantity_on_hand | INTEGER | DEFAULT 0, CHECK (quantity_on_hand >= 0) | Current stock count |
| quantity_reserved | INTEGER | DEFAULT 0, CHECK (quantity_reserved >= 0) | Stock reserved for orders |
| reorder_threshold | INTEGER | DEFAULT 10 | Minimum stock level triggering reorder |
| last_restocked_date | DATE | | Date of most recent restock |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `edition_id` references `edition(edition_id)` — many-to-one
- `warehouse_id` references `warehouse(warehouse_id)` — many-to-one

### Constraints
- PK: `inventory_id`
- FK: `edition_id` → `edition(edition_id)` ON DELETE CASCADE
- FK: `warehouse_id` → `warehouse(warehouse_id)` ON DELETE CASCADE
- UNIQUE: `(edition_id, warehouse_id)`
- CHECK: `quantity_on_hand >= 0`
- CHECK: `quantity_reserved >= 0`

### Future Notes
- Consider adding `location_code` (aisle/rack/shelf) for physical picking workflows.

---

## 17. Distributor

### Table
`distributor`

### Purpose
Represents book distribution companies that supply editions to bookstores. Tracks service areas and verification status.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| distributor_id | VARCHAR(15) | PK | Primary key, prefixed DST-XXXXXXXXXX |
| name_bn | TEXT | NOT NULL | Distributor name in Bengali |
| name_en | TEXT | NOT NULL | Distributor name in English |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| website_url | TEXT | | Distributor website URL |
| address_id | VARCHAR(15) | FK -> address, nullable | Reference to address record |
| service_areas | TEXT | | Geographic areas served |
| verification_level | VARCHAR(50) | DEFAULT 'Needs Review' | Verification status level |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `address_id` references `address(address_id)` — many-to-one (nullable)

### Constraints
- PK: `distributor_id`
- FK: `address_id` → `address(address_id)` ON DELETE SET NULL
- UNIQUE: `slug`

### Future Notes
- Consider adding `distribution_fee_percentage`, `contract_start_date`, `contract_end_date`.

---

## 18. Bookstore

### Table
`bookstore`

### Purpose
Represents retail outlets (physical or online) that sell books. Tracks type, active status, and verification level.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| bookstore_id | VARCHAR(15) | PK | Primary key, prefixed BKS-XXXXXXXXXX |
| name_bn | TEXT | NOT NULL | Bookstore name in Bengali |
| name_en | TEXT | NOT NULL | Bookstore name in English |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| website_url | TEXT | | Bookstore website URL |
| address_id | VARCHAR(15) | FK -> address, nullable | Reference to address record |
| store_type | VARCHAR(50) | DEFAULT 'physical' | Type of store (physical, online, both) |
| is_active | BOOLEAN | DEFAULT TRUE | Whether the bookstore is active |
| verification_level | VARCHAR(50) | DEFAULT 'Needs Review' | Verification status level |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `address_id` references `address(address_id)` — many-to-one (nullable)

### Constraints
- PK: `bookstore_id`
- FK: `address_id` → `address(address_id)` ON DELETE SET NULL
- UNIQUE: `slug`

### Future Notes
- Consider adding `commission_percentage`, `payment_terms_days` for financial tracking.

---

## 19. Reader

### Table
`reader`

### Purpose
Represents end-user readers in the ecosystem. Links optionally to a person record for identity unification. Uses email as the unique identifier for login/communication.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| reader_id | VARCHAR(15) | PK | Primary key, prefixed RDR-XXXXXXXXXX |
| person_id | VARCHAR(15) | FK -> person, nullable, 1:1 link | Linked person record |
| email | VARCHAR(254) | UNIQUE, NOT NULL | Reader email address |
| display_name | TEXT | NOT NULL | Public-facing display name |
| join_date | DATE | DEFAULT CURRENT_DATE | Account creation date |
| is_active | BOOLEAN | DEFAULT TRUE | Whether the reader account is active |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `person_id` references `person(person_id)` — one-to-one (nullable)

### Constraints
- PK: `reader_id`
- FK: `person_id` → `person(person_id)` ON DELETE SET NULL
- UNIQUE: `email`

### Future Notes
- Consider adding `preferred_language_id`, `newsletter_opt_in`, `birth_date` for personalization.

---

## 20. Review

### Table
`review`

### Purpose
Stores reader reviews and ratings for books. Enforces one review per reader per book and supports moderation workflow through status field.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| review_id | VARCHAR(15) | PK | Primary key, prefixed RVW-XXXXXXXXXX |
| book_id | VARCHAR(15) | FK -> book, NOT NULL | Reviewed book |
| reader_id | VARCHAR(15) | FK -> reader, NOT NULL | Reviewing reader |
| rating | INTEGER | NOT NULL, CHECK (rating >= 1 AND rating <= 5) | Numeric rating (1-5) |
| title | TEXT | | Review title |
| body | TEXT | | Review body text |
| is_verified_purchase | BOOLEAN | DEFAULT FALSE | Whether the reader purchased the book |
| status | VARCHAR(50) | DEFAULT 'pending' | Moderation status |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `book_id` references `book(book_id)` — many-to-one
- `reader_id` references `reader(reader_id)` — many-to-one

### Constraints
- PK: `review_id`
- FK: `book_id` → `book(book_id)` ON DELETE CASCADE
- FK: `reader_id` → `reader(reader_id)` ON DELETE CASCADE
- UNIQUE: `(book_id, reader_id)`
- CHECK: `rating >= 1 AND rating <= 5`

### Future Notes
- Consider adding `helpful_count`, `flagged_count` for community moderation features.

---

## 21. Award

### Table
`award`

### Purpose
Represents literary awards and honors. Optionally linked to an organizing body (organization) and tracks category and year.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| award_id | VARCHAR(15) | PK | Primary key, prefixed AWD-XXXXXXXXXX |
| organization_id | VARCHAR(15) | FK -> organization, nullable | Organizing body |
| name_bn | TEXT | NOT NULL | Award name in Bengali |
| name_en | TEXT | NOT NULL | Award name in English |
| category_name | TEXT | NOT NULL | Award category (e.g., Fiction, Poetry) |
| year | INTEGER | NOT NULL | Year the award was given |
| description | TEXT | | Award description |
| is_active | BOOLEAN | DEFAULT TRUE | Whether the award is active |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `organization_id` references `organization(organization_id)` — many-to-one (nullable)

### Constraints
- PK: `award_id`
- FK: `organization_id` → `organization(organization_id)` ON DELETE SET NULL

### Future Notes
- Consider adding `prize_amount_bdt`, `sponsor_name` for detailed award tracking.

---

## 22. Event

### Table
`event`

### Purpose
Represents literary events such as book fairs, launches, and signings. Tracks dates, venue, and organizational linkage.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| event_id | VARCHAR(15) | PK | Primary key, prefixed EVT-XXXXXXXXXX |
| organization_id | VARCHAR(15) | FK -> organization, nullable | Organizing body |
| name_bn | TEXT | NOT NULL | Event name in Bengali |
| name_en | TEXT | NOT NULL | Event name in English |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| description | TEXT | | Event description |
| event_type | VARCHAR(50) | DEFAULT 'book_fair' | Type of event |
| start_date | DATE | NOT NULL | Event start date |
| end_date | DATE | | Event end date |
| venue | TEXT | | Event venue name |
| address_id | VARCHAR(15) | FK -> address, nullable | Reference to address record |
| website_url | TEXT | | Event website URL |
| is_active | BOOLEAN | DEFAULT TRUE | Whether the event is active |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `organization_id` references `organization(organization_id)` — many-to-one (nullable)
- `address_id` references `address(address_id)` — many-to-one (nullable)

### Constraints
- PK: `event_id`
- FK: `organization_id` → `organization(organization_id)` ON DELETE SET NULL
- FK: `address_id` → `address(address_id)` ON DELETE SET NULL
- UNIQUE: `slug`

### Future Notes
- Consider adding `max_participants`, `registration_deadline`, `ticket_price_bdt` for ticketed events.

---

## 23. Organization

### Table
`organization`

### Purpose
Represents any organized body in the ecosystem — literary societies, award committees, cultural institutes, etc. Supports type-based categorization.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| organization_id | VARCHAR(15) | PK | Primary key, prefixed ORG-XXXXXXXXXX |
| name_bn | TEXT | NOT NULL | Organization name in Bengali |
| name_en | TEXT | NOT NULL | Organization name in English |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| organization_type | VARCHAR(50) | NOT NULL | Type (e.g., literary_society, institute, committee) |
| website_url | TEXT | | Organization website URL |
| address_id | VARCHAR(15) | FK -> address, nullable | Reference to address record |
| description | TEXT | | Organization description |
| founded_year | INTEGER | | Year the organization was founded |
| verification_level | VARCHAR(50) | DEFAULT 'Needs Review' | Verification status level |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `address_id` references `address(address_id)` — many-to-one (nullable)

### Constraints
- PK: `organization_id`
- FK: `address_id` → `address(address_id)` ON DELETE SET NULL
- UNIQUE: `slug`

### Future Notes
- Consider adding `registration_number`, `tax_id` for formal organizational records.

---

## 24. License

### Table
`license`

### Purpose
Manages intellectual property licenses granted to publishers. Defines scope, territory, exclusivity, and duration of rights.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| license_id | VARCHAR(15) | PK | Primary key, prefixed LIC-XXXXXXXXXX |
| publisher_id | VARCHAR(15) | FK -> publisher, NOT NULL | License holder publisher |
| license_type | VARCHAR(50) | NOT NULL | Type of license (e.g., translation, distribution, adaptation) |
| rights_granted | TEXT | NOT NULL | Description of granted rights |
| territory | VARCHAR(255) | DEFAULT 'Bangladesh' | Geographic territory covered |
| start_date | DATE | NOT NULL | License start date |
| end_date | DATE | | License end date |
| is_exclusive | BOOLEAN | DEFAULT FALSE | Whether the license is exclusive |
| notes | TEXT | | Additional notes |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `publisher_id` references `publisher(publisher_id)` — many-to-one

### Constraints
- PK: `license_id`
- FK: `publisher_id` → `publisher(publisher_id)` ON DELETE CASCADE

### Future Notes
- Consider adding `royalty_rate`, `advance_amount`, `renewal_terms` for comprehensive rights management.

---

## 25. Contract

### Table
`contract`

### Purpose
Represents formal legal agreements between publishers and parties. Tracks contract type, financial terms, and lifecycle status.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| contract_id | VARCHAR(15) | PK | Primary key, prefixed CTR-XXXXXXXXXX |
| contract_number | VARCHAR(100) | UNIQUE, NOT NULL | Human-readable contract reference number |
| contract_type | VARCHAR(50) | NOT NULL | Type of contract (e.g., author, distribution, license) |
| start_date | DATE | NOT NULL | Contract effective date |
| end_date | DATE | | Contract expiration date |
| publisher_id | VARCHAR(15) | FK -> publisher, NOT NULL | Publisher party to the contract |
| license_id | VARCHAR(15) | FK -> license, nullable | Associated license |
| royalty_percentage | NUMERIC(5,2) | | Agreed royalty percentage |
| advance_amount_bdt | NUMERIC(12,2) | | Advance payment in Bangladeshi Taka |
| status | VARCHAR(50) | DEFAULT 'draft' | Contract status (draft, active, completed, terminated) |
| notes | TEXT | | Additional notes |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `publisher_id` references `publisher(publisher_id)` — many-to-one
- `license_id` references `license(license_id)` — many-to-one (nullable)

### Constraints
- PK: `contract_id`
- FK: `publisher_id` → `publisher(publisher_id)` ON DELETE CASCADE
- FK: `license_id` → `license(license_id)` ON DELETE SET NULL
- UNIQUE: `contract_number`

### Future Notes
- Consider adding `template_id`, `approved_by`, `approved_date` for workflow management.

---

## 26. Submission

### Table
`submission`

### Purpose
Tracks manuscript and proposal submissions from authors to publishers. Supports the full submission-to-contract workflow with decision tracking.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| submission_id | VARCHAR(15) | PK | Primary key, prefixed SUB-XXXXXXXXXX |
| publisher_id | VARCHAR(15) | FK -> publisher, NOT NULL | Target publisher |
| title | TEXT | NOT NULL | Submission title |
| submission_type | VARCHAR(50) | DEFAULT 'manuscript' | Type of submission |
| abstract | TEXT | | Submission abstract or synopsis |
| status | VARCHAR(50) | DEFAULT 'draft' | Submission workflow status |
| submitted_date | DATE | | Date of formal submission |
| decision_date | DATE | | Date of editorial decision |
| decision_notes | TEXT | | Notes on the decision |
| contract_id | VARCHAR(15) | FK -> contract, nullable | Contract generated from accepted submission |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `publisher_id` references `publisher(publisher_id)` — many-to-one
- `contract_id` references `contract(contract_id)` — many-to-one (nullable)

### Constraints
- PK: `submission_id`
- FK: `publisher_id` → `publisher(publisher_id)` ON DELETE CASCADE
- FK: `contract_id` → `contract(contract_id)` ON DELETE SET NULL

### Future Notes
- Consider adding `expected_word_count`, `genre`, `target_audience` for detailed submission filtering.

---

## 27. Media Asset

### Table
`media_asset`

### Purpose
Polymorphic entity storing references to media coverage (news articles, interviews, reviews, etc.) linked to any other entity in the system.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| media_asset_id | VARCHAR(15) | PK | Primary key, prefixed MEA-XXXXXXXXXX |
| entity_type | VARCHAR(50) | NOT NULL | Type of linked entity |
| entity_id | VARCHAR(15) | NOT NULL | ID of linked entity |
| media_type | VARCHAR(50) | NOT NULL | Type of media (article, video, podcast, etc.) |
| title | TEXT | | Media title |
| url | TEXT | NOT NULL | URL to the media asset |
| published_date | DATE | | Original publication date |
| source_name | TEXT | | Name of the publishing source |
| is_approved | BOOLEAN | DEFAULT FALSE | Whether the asset is approved |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- Polymorphic: `(entity_type, entity_id)` references multiple tables

### Constraints
- PK: `media_asset_id`

### Future Notes
- Consider adding a `language_id` and `is_featured` flag for curated media galleries.

---

## 28. Digital Asset

### Table
`digital_asset`

### Purpose
Manages digital files associated with books — covers, sample chapters, full ebooks, audio files, etc. Tracks file metadata and access control.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| digital_asset_id | VARCHAR(15) | PK | Primary key, prefixed DIA-XXXXXXXXXX |
| book_id | VARCHAR(15) | FK -> book, NOT NULL | Parent book |
| asset_type | VARCHAR(50) | NOT NULL | Asset type (cover, ebook, audio, sample, etc.) |
| filename | TEXT | NOT NULL | Original filename |
| mime_type | VARCHAR(100) | NOT NULL | MIME type of the file |
| file_size_bytes | INTEGER | | File size in bytes |
| url | TEXT | NOT NULL | URL to the digital asset |
| description | TEXT | | Asset description |
| is_public | BOOLEAN | DEFAULT FALSE | Whether the asset is publicly accessible |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `book_id` references `book(book_id)` — many-to-one

### Constraints
- PK: `digital_asset_id`
- FK: `book_id` → `book(book_id)` ON DELETE CASCADE

### Future Notes
- Consider adding `checksum` (SHA-256), `storage_provider`, `expires_at` for digital rights management.

---

## 29. Tag

### Table
`tag`

### Purpose
Simple taxonomy entity for flexible categorization and filtering of content across the ecosystem.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| tag_id | VARCHAR(15) | PK | Primary key, prefixed TAG-XXXXXXXXXX |
| name_bn | TEXT | NOT NULL | Tag name in Bengali |
| name_en | TEXT | NOT NULL | Tag name in English |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| description | TEXT | | Tag description |
| is_active | BOOLEAN | DEFAULT TRUE | Whether the tag is active |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
None.

### Constraints
- PK: `tag_id`
- UNIQUE: `slug`

### Future Notes
- Consider adding `tag_group` (genre, theme, format, etc.) for hierarchical tag organization.

---

## 30. Keyword

### Table
`keyword`

### Purpose
Stores individual keywords used for search and SEO optimization. Supports language-specific keywords for multilingual discovery.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| keyword_id | VARCHAR(15) | PK | Primary key, prefixed KWD-XXXXXXXXXX |
| word | TEXT | UNIQUE, NOT NULL | The keyword text |
| language_code | VARCHAR(10) | | ISO 639-1 language code for the keyword |
| is_active | BOOLEAN | DEFAULT TRUE | Whether the keyword is active |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
None.

### Constraints
- PK: `keyword_id`
- UNIQUE: `word`

### Future Notes
- Consider adding `search_volume`, `relevance_score` for SEO analytics.

---

## 31. Dataset

### Table
`dataset`

### Purpose
Manages published/open datasets from the ecosystem (e.g., bibliographic data, statistics). Follows open data principles with versioning and licensing.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| dataset_id | VARCHAR(15) | PK | Primary key, prefixed DST-XXXXXXXXXX |
| publisher_id | VARCHAR(15) | FK -> publisher, nullable | Contributing publisher |
| name_bn | TEXT | NOT NULL | Dataset name in Bengali |
| name_en | TEXT | NOT NULL | Dataset name in English |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| version | VARCHAR(20) | NOT NULL | Dataset version string |
| description | TEXT | | Dataset description |
| license_type | VARCHAR(100) | DEFAULT 'ODbL 1.0' | Open data license type |
| file_url | TEXT | | URL to the dataset file |
| row_count | INTEGER | | Number of rows in the dataset |
| published_date | DATE | | Date the dataset was published |
| is_public | BOOLEAN | DEFAULT TRUE | Whether the dataset is publicly accessible |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `publisher_id` references `publisher(publisher_id)` — many-to-one (nullable)

### Constraints
- PK: `dataset_id`
- FK: `publisher_id` → `publisher(publisher_id)` ON DELETE SET NULL
- UNIQUE: `slug`

### Future Notes
- Consider adding `schema_url`, `data_dictionary_link`, `refresh_frequency` for dataset documentation.

---

## 32. Source

### Table
`source`

### Purpose
Represents the provenance of information in the system. Documents the origin of data entries for verification and citation purposes.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| source_id | VARCHAR(15) | PK | Primary key, prefixed SRC-XXXXXXXXXX |
| source_type | VARCHAR(50) | NOT NULL | Type: Document, Website, Interview, Official Record, Other |
| title | TEXT | NOT NULL | Source title or description |
| url | TEXT | | URL to the source |
| reference_number | VARCHAR(100) | | Internal reference or accession number |
| published_date | DATE | | Original publication date |
| author_name | TEXT | | Author or creator of the source |
| is_verified | BOOLEAN | DEFAULT FALSE | Whether the source has been verified |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
None.

### Constraints
- PK: `source_id`

### Future Notes
- Consider adding `language_id`, `file_url`, `checksum` for full source document management.

---

## 33. Verification

### Table
`verification`

### Purpose
Records verification events for any entity in the system. Provides an audit trail of who verified what, when, and at what level.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| verification_id | VARCHAR(15) | PK | Primary key, prefixed VRF-XXXXXXXXXX |
| entity_type | VARCHAR(50) | NOT NULL | Type of verified entity |
| entity_id | VARCHAR(15) | NOT NULL | ID of verified entity |
| verification_level | VARCHAR(50) | NOT NULL | Level: Verified, Partially Verified, Community Verified, Needs Review |
| verified_by | VARCHAR(15) | FK -> user, NOT NULL | User who performed the verification |
| source_id | VARCHAR(15) | FK -> source, nullable | Source used for verification |
| notes | TEXT | | Verification notes |
| verified_date | DATE | DEFAULT CURRENT_DATE | Date of verification |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `verified_by` references `user(user_id)` — many-to-one
- `source_id` references `source(source_id)` — many-to-one (nullable)
- Polymorphic: `(entity_type, entity_id)` references multiple tables

### Constraints
- PK: `verification_id`
- FK: `verified_by` → `user(user_id)` ON DELETE RESTRICT
- FK: `source_id` → `source(source_id)` ON DELETE SET NULL

### Future Notes
- Consider adding `expires_at` for time-limited verifications requiring renewal.

---

## 34. Role

### Table
`role`

### Purpose
Defines user roles within the system for authorization purposes. Supports system-level and custom roles with active/inactive status.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| role_id | VARCHAR(15) | PK | Primary key, prefixed ROL-XXXXXXXXXX |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Role name |
| description | TEXT | | Role description |
| is_system | BOOLEAN | DEFAULT FALSE | Whether this is a system-defined role |
| is_active | BOOLEAN | DEFAULT TRUE | Whether the role is active |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
None.

### Constraints
- PK: `role_id`
- UNIQUE: `name`

### Future Notes
- Consider adding `priority_level` for role hierarchy and escalation workflows.

---

## 35. Permission

### Table
`permission`

### Purpose
Defines granular access permissions (resource + action pairs) for the role-based access control system.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| permission_id | VARCHAR(15) | PK | Primary key, prefixed PRM-XXXXXXXXXX |
| resource | VARCHAR(100) | NOT NULL | Resource name (e.g., book, edition, publisher) |
| action | VARCHAR(50) | NOT NULL | Action: create, read, update, delete, manage |
| description | TEXT | | Permission description |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
None.

### Constraints
- PK: `permission_id`
- UNIQUE: `(resource, action)`

### Future Notes
- Consider adding `scope` (global, publisher, self) for context-dependent permissions.

---

## 36. User

### Table
`user`

### Purpose
Represents system users with authentication credentials. Links to person records and assigns roles for access control.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| user_id | VARCHAR(15) | PK | Primary key, prefixed USR-XXXXXXXXXX |
| person_id | VARCHAR(15) | FK -> person, nullable | Linked person record |
| role_id | VARCHAR(15) | FK -> role, NOT NULL | Assigned role |
| email | VARCHAR(254) | UNIQUE, NOT NULL | User email (login identifier) |
| password_hash | TEXT | NOT NULL | Bcrypt or Argon2 password hash |
| display_name | TEXT | NOT NULL | User display name |
| is_active | BOOLEAN | DEFAULT TRUE | Whether the user account is active |
| last_login | TIMESTAMP | | Timestamp of last successful login |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `person_id` references `person(person_id)` — many-to-one (nullable)
- `role_id` references `role(role_id)` — many-to-one

### Constraints
- PK: `user_id`
- FK: `person_id` → `person(person_id)` ON DELETE SET NULL
- FK: `role_id` → `role(role_id)` ON DELETE RESTRICT
- UNIQUE: `email`

### Future Notes
- Consider adding `two_factor_enabled`, `password_changed_at`, `failed_login_attempts` for security hardening.

---

## 37. Audit Log

### Table
`audit_log`

### Purpose
Captures a chronological record of all significant actions performed in the system for security, compliance, and debugging.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| audit_log_id | VARCHAR(15) | PK | Primary key, prefixed ALG-XXXXXXXXXX |
| actor_id | VARCHAR(15) | FK -> user, nullable | User who performed the action |
| action | VARCHAR(50) | NOT NULL | Action performed |
| entity_type | VARCHAR(50) | NOT NULL | Type of affected entity |
| entity_id | VARCHAR(15) | NOT NULL | ID of affected entity |
| old_values | TEXT | | Previous values as JSON |
| new_values | TEXT | | New values as JSON |
| ip_address | VARCHAR(45) | | Actor IP address (supports IPv6) |
| user_agent | TEXT | | Browser/client user agent string |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `actor_id` references `user(user_id)` — many-to-one (nullable)

### Constraints
- PK: `audit_log_id`
- FK: `actor_id` → `user(user_id)` ON DELETE SET NULL

### Future Notes
- Consider adding a `session_id` and partitioning strategy for high-volume audit data retention.

---

## 38. Notification

### Table
`notification`

### Purpose
Manages in-app and multi-channel notifications sent to users. Supports read tracking and delivery method logging.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| notification_id | VARCHAR(15) | PK | Primary key, prefixed NTF-XXXXXXXXXX |
| user_id | VARCHAR(15) | FK -> user, NOT NULL | Target user |
| notification_type | VARCHAR(50) | NOT NULL | Type of notification |
| subject | TEXT | NOT NULL | Notification subject line |
| body | TEXT | NOT NULL | Notification body content |
| is_read | BOOLEAN | DEFAULT FALSE | Whether the notification has been read |
| sent_via | VARCHAR(50) | DEFAULT 'in_app' | Delivery channel (in_app, email, sms) |
| sent_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When the notification was sent |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `user_id` references `user(user_id)` — many-to-one

### Constraints
- PK: `notification_id`
- FK: `user_id` → `user(user_id)` ON DELETE CASCADE

### Future Notes
- Consider adding `read_at`, `action_url`, `expires_at` for rich interactive notifications.

---

## 39. Search Index

### Table
`search_index`

### Purpose
Denormalized search index table for full-text search across multiple entity types. Supports weighted results and language-specific indexing.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| search_index_id | VARCHAR(15) | PK | Primary key, prefixed SID-XXXXXXXXXX |
| entity_type | VARCHAR(50) | NOT NULL | Type of indexed entity |
| entity_id | VARCHAR(15) | NOT NULL | ID of indexed entity |
| searchable_text | TEXT | NOT NULL | Concatenated searchable text |
| weight | INTEGER | DEFAULT 1 | Search result weight/priority |
| language_code | VARCHAR(10) | | Language of the indexed content |
| last_indexed | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When the index was last updated |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- Polymorphic: `(entity_type, entity_id)` references multiple tables

### Constraints
- PK: `search_index_id`
- UNIQUE: `(entity_type, entity_id)`

### Future Notes
- Consider migrating to dedicated full-text search (Elasticsearch, Meilisearch) and using this table as a sync log.

---

## 40. API Client

### Table
`api_client`

### Purpose
Manages third-party API credentials for programmatic access to the tProkash platform. Stores hashed secrets and rate-limiting configuration.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| api_client_id | VARCHAR(15) | PK | Primary key, prefixed APC-XXXXXXXXXX |
| user_id | VARCHAR(15) | FK -> user, NOT NULL | Owner of the API client |
| client_id | VARCHAR(100) | UNIQUE, NOT NULL | Public client identifier |
| client_secret_hash | TEXT | NOT NULL | Bcrypt/Argon2 hash of the client secret |
| name | TEXT | NOT NULL | Client application name |
| description | TEXT | | Client description |
| rate_limit | INTEGER | DEFAULT 1000 | Requests per hour limit |
| scope | TEXT | | Space-separated permission scopes |
| is_active | BOOLEAN | DEFAULT TRUE | Whether the client is active |
| last_used | TIMESTAMP | | Timestamp of last API call |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `user_id` references `user(user_id)` — many-to-one

### Constraints
- PK: `api_client_id`
- FK: `user_id` → `user(user_id)` ON DELETE CASCADE
- UNIQUE: `client_id`

### Future Notes
- Consider adding `allowed_ips`, `redirect_uris`, `token_expiry_seconds` for OAuth2 compliance.

---

## 41. Country

### Table
`country`

### Purpose
Lookup table for countries using ISO 3166-1 alpha-2 codes. Stores names in Bengali and English for localization.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| country_id | VARCHAR(15) | PK | Primary key, prefixed CTR-XXXXXXXXXX |
| code | VARCHAR(3) | UNIQUE, NOT NULL | ISO 3166-1 alpha-2 country code |
| name_bn | TEXT | NOT NULL | Country name in Bengali |
| name_en | TEXT | NOT NULL | Country name in English |
| is_active | BOOLEAN | DEFAULT TRUE | Whether the country is active |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
None.

### Constraints
- PK: `country_id`
- UNIQUE: `code`

### Future Notes
- Consider adding `iso_alpha_3`, `numeric_code`, `dial_code`, `currency_code`.

---

## 42. City

### Table
`city`

### Purpose
Lookup table for cities within countries. Supports capital city designation and localization in Bengali and English.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| city_id | VARCHAR(15) | PK | Primary key, prefixed CTY-XXXXXXXXXX |
| country_id | VARCHAR(15) | FK -> country, NOT NULL | Parent country |
| name_bn | TEXT | NOT NULL | City name in Bengali |
| name_en | TEXT | NOT NULL | City name in English |
| is_capital | BOOLEAN | DEFAULT FALSE | Whether the city is a national capital |
| is_active | BOOLEAN | DEFAULT TRUE | Whether the city is active |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `country_id` references `country(country_id)` — many-to-one

### Constraints
- PK: `city_id`
- FK: `country_id` → `country(country_id)` ON DELETE RESTRICT

### Future Notes
- Consider adding `division`, `district`, `population` for Bangladesh-specific administrative hierarchy.

---

## 43. Address

### Table
`address`

### Purpose
Polymorphic entity storing physical addresses linked to any other entity. Supports multiple address types and geolocation coordinates.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| address_id | VARCHAR(15) | PK | Primary key, prefixed ADR-XXXXXXXXXX |
| city_id | VARCHAR(15) | FK -> city, NOT NULL | Associated city |
| entity_type | VARCHAR(50) | NOT NULL | Type of linked entity |
| entity_id | VARCHAR(15) | NOT NULL | ID of linked entity |
| line_1 | TEXT | NOT NULL | Address line 1 |
| line_2 | TEXT | | Address line 2 |
| postal_code | VARCHAR(20) | | Postal or ZIP code |
| latitude | NUMERIC(10,7) | | Geographic latitude |
| longitude | NUMERIC(10,7) | | Geographic longitude |
| is_primary | BOOLEAN | DEFAULT FALSE | Whether this is the primary address |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `city_id` references `city(city_id)` — many-to-one
- Polymorphic: `(entity_type, entity_id)` references multiple tables

### Constraints
- PK: `address_id`
- FK: `city_id` → `city(city_id)` ON DELETE RESTRICT

### Future Notes
- Consider adding `address_type` (office, home, warehouse) and `is_billing` flags.

---

## 44. Contact Method

### Table
`contact_method`

### Purpose
Polymorphic entity storing contact information (phone, email, social media, fax) linked to any other entity. Supports primary and public visibility flags.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| contact_method_id | VARCHAR(15) | PK | Primary key, prefixed CNT-XXXXXXXXXX |
| entity_type | VARCHAR(50) | NOT NULL | Type of linked entity |
| entity_id | VARCHAR(15) | NOT NULL | ID of linked entity |
| contact_type | VARCHAR(50) | NOT NULL | Type: phone, email, social, fax |
| value | TEXT | NOT NULL | Contact value (phone number, email address, URL) |
| is_primary | BOOLEAN | DEFAULT FALSE | Whether this is the primary contact method |
| is_public | BOOLEAN | DEFAULT FALSE | Whether this contact is publicly visible |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- Polymorphic: `(entity_type, entity_id)` references multiple tables

### Constraints
- PK: `contact_method_id`

### Future Notes
- Consider adding `contact_person_name`, `availability_hours` for business contact workflows.

---

## 45. Book Author

### Table
`book_author`

### Purpose
Junction table linking books to their authors. Supports ordering of multiple authors for proper attribution.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| book_id | VARCHAR(15) | FK -> book, NOT NULL | Associated book |
| person_id | VARCHAR(15) | FK -> person, NOT NULL | Author person |
| author_order | INTEGER | DEFAULT 1 | Display order among authors |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `book_id` references `book(book_id)` — many-to-one
- `person_id` references `person(person_id)` — many-to-one

### Constraints
- PK: `(book_id, person_id)`
- FK: `book_id` → `book(book_id)` ON DELETE CASCADE
- FK: `person_id` → `person(person_id)` ON DELETE CASCADE

### Future Notes
- None currently.

---

## 46. Book Contributor

### Table
`book_contributor`

### Purpose
Junction table linking books to contributors with specific roles (editor, translator, illustrator, etc.). Supports granular attribution beyond authorship.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| book_id | VARCHAR(15) | FK -> book, NOT NULL | Associated book |
| person_id | VARCHAR(15) | FK -> person, NOT NULL | Contributor person |
| contribution_role_id | VARCHAR(15) | FK -> contribution_role, NOT NULL | Role performed |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `book_id` references `book(book_id)` — many-to-one
- `person_id` references `person(person_id)` — many-to-one
- `contribution_role_id` references `contribution_role(contribution_role_id)` — many-to-one

### Constraints
- PK: `(book_id, person_id, contribution_role_id)`
- FK: `book_id` → `book(book_id)` ON DELETE CASCADE
- FK: `person_id` → `person(person_id)` ON DELETE CASCADE
- FK: `contribution_role_id` → `contribution_role(contribution_role_id)` ON DELETE RESTRICT

### Future Notes
- None currently.

---

## 47. Book Publisher

### Table
`book_publisher`

### Purpose
Junction table linking books to publishers with a role qualifier. Supports scenarios where multiple publishers are involved (co-publishing, distribution rights).

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| book_id | VARCHAR(15) | FK -> book, NOT NULL | Associated book |
| publisher_id | VARCHAR(15) | FK -> publisher, NOT NULL | Associated publisher |
| role | VARCHAR(50) | DEFAULT 'publisher' | Publisher's role (publisher, co-publisher, distributor) |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `book_id` references `book(book_id)` — many-to-one
- `publisher_id` references `publisher(publisher_id)` — many-to-one

### Constraints
- PK: `(book_id, publisher_id)`
- FK: `book_id` → `book(book_id)` ON DELETE CASCADE
- FK: `publisher_id` → `publisher(publisher_id)` ON DELETE CASCADE

### Future Notes
- Consider adding `rights_share_percentage`, `territory` for detailed publishing rights management.

---

## 48. Book Category

### Table
`book_category`

### Purpose
Junction table linking books to categories for hierarchical classification and browsing.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| book_id | VARCHAR(15) | FK -> book, NOT NULL | Associated book |
| category_id | VARCHAR(15) | FK -> category, NOT NULL | Associated category |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `book_id` references `book(book_id)` — many-to-one
- `category_id` references `category(category_id)` — many-to-one

### Constraints
- PK: `(book_id, category_id)`
- FK: `book_id` → `book(book_id)` ON DELETE CASCADE
- FK: `category_id` → `category(category_id)` ON DELETE CASCADE

### Future Notes
- None currently.

---

## 49. Book Collection

### Table
`book_collection`

### Purpose
Junction table linking books to curated collections. Tracks when a book was added to each collection.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| book_id | VARCHAR(15) | FK -> book, NOT NULL | Associated book |
| collection_id | VARCHAR(15) | FK -> collection, NOT NULL | Associated collection |
| added_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When the book was added to the collection |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `book_id` references `book(book_id)` — many-to-one
- `collection_id` references `collection(collection_id)` — many-to-one

### Constraints
- PK: `(book_id, collection_id)`
- FK: `book_id` → `book(book_id)` ON DELETE CASCADE
- FK: `collection_id` → `collection(collection_id)` ON DELETE CASCADE

### Future Notes
- Consider adding `sort_order` for manually ordered collections.

---

## 50. Book Tag

### Table
`book_tag`

### Purpose
Junction table linking books to tags for flexible, non-hierarchical categorization.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| book_id | VARCHAR(15) | FK -> book, NOT NULL | Associated book |
| tag_id | VARCHAR(15) | FK -> tag, NOT NULL | Associated tag |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `book_id` references `book(book_id)` — many-to-one
- `tag_id` references `tag(tag_id)` — many-to-one

### Constraints
- PK: `(book_id, tag_id)`
- FK: `book_id` → `book(book_id)` ON DELETE CASCADE
- FK: `tag_id` → `tag(tag_id)` ON DELETE CASCADE

### Future Notes
- None currently.

---

## 51. Book Keyword

### Table
`book_keyword`

### Purpose
Junction table linking books to keywords for search engine optimization and discoverability.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| book_id | VARCHAR(15) | FK -> book, NOT NULL | Associated book |
| keyword_id | VARCHAR(15) | FK -> keyword, NOT NULL | Associated keyword |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `book_id` references `book(book_id)` — many-to-one
- `keyword_id` references `keyword(keyword_id)` — many-to-one

### Constraints
- PK: `(book_id, keyword_id)`
- FK: `book_id` → `book(book_id)` ON DELETE CASCADE
- FK: `keyword_id` → `keyword(keyword_id)` ON DELETE CASCADE

### Future Notes
- None currently.

---

## 52. Book Award

### Table
`book_award`

### Purpose
Junction table linking books to awards. Records the year the book received each award, which may differ from the award year.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| book_id | VARCHAR(15) | FK -> book, NOT NULL | Associated book |
| award_id | VARCHAR(15) | FK -> award, NOT NULL | Associated award |
| year | INTEGER | NOT NULL | Year the book received the award |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `book_id` references `book(book_id)` — many-to-one
- `award_id` references `award(award_id)` — many-to-one

### Constraints
- PK: `(book_id, award_id)`
- FK: `book_id` → `book(book_id)` ON DELETE CASCADE
- FK: `award_id` → `award(award_id)` ON DELETE CASCADE

### Future Notes
- Consider adding `award_result` (winner, shortlisted, nominated) for award milestone tracking.

---

## 53. Book Event

### Table
`book_event`

### Purpose
Junction table linking books to literary events. Tracks the nature of participation (featured, launched, exhibited).

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| book_id | VARCHAR(15) | FK -> book, NOT NULL | Associated book |
| event_id | VARCHAR(15) | FK -> event, NOT NULL | Associated event |
| participation_type | VARCHAR(50) | DEFAULT 'featured' | Type of participation |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `book_id` references `book(book_id)` — many-to-one
- `event_id` references `event(event_id)` — many-to-one

### Constraints
- PK: `(book_id, event_id)`
- FK: `book_id` → `book(book_id)` ON DELETE CASCADE
- FK: `event_id` → `event(event_id)` ON DELETE CASCADE

### Future Notes
- None currently.

---

## 54. Edition Distributor

### Table
`edition_distributor`

### Purpose
Junction table linking editions to distributors. Tracks active distribution agreements per edition.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| edition_id | VARCHAR(15) | FK -> edition, NOT NULL | Associated edition |
| distributor_id | VARCHAR(15) | FK -> distributor, NOT NULL | Associated distributor |
| is_active | BOOLEAN | DEFAULT TRUE | Whether distribution is active |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `edition_id` references `edition(edition_id)` — many-to-one
- `distributor_id` references `distributor(distributor_id)` — many-to-one

### Constraints
- PK: `(edition_id, distributor_id)`
- FK: `edition_id` → `edition(edition_id)` ON DELETE CASCADE
- FK: `distributor_id` → `distributor(distributor_id)` ON DELETE CASCADE

### Future Notes
- Consider adding `distribution_fee_percentage`, `exclusivity` for terms tracking.

---

## 55. Distributor Bookstore

### Table
`distributor_bookstore`

### Purpose
Junction table linking distributors to the bookstores they supply. Tracks contractual relationships and active status.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| distributor_id | VARCHAR(15) | FK -> distributor, NOT NULL | Associated distributor |
| bookstore_id | VARCHAR(15) | FK -> bookstore, NOT NULL | Associated bookstore |
| contract_ref | TEXT | | Reference to distribution contract |
| is_active | BOOLEAN | DEFAULT TRUE | Whether the relationship is active |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `distributor_id` references `distributor(distributor_id)` — many-to-one
- `bookstore_id` references `bookstore(bookstore_id)` — many-to-one

### Constraints
- PK: `(distributor_id, bookstore_id)`
- FK: `distributor_id` → `distributor(distributor_id)` ON DELETE CASCADE
- FK: `bookstore_id` → `bookstore(bookstore_id)` ON DELETE CASCADE

### Future Notes
- None currently.

---

## 56. Bookstore Inventory

### Table
`bookstore_inventory`

### Purpose
Tracks stock levels and retail pricing for editions at individual bookstores. Enables store-level inventory management.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| bookstore_id | VARCHAR(15) | FK -> bookstore, NOT NULL | Associated bookstore |
| edition_id | VARCHAR(15) | FK -> edition, NOT NULL | Associated edition |
| quantity_on_hand | INTEGER | DEFAULT 0 | Current stock count at the bookstore |
| price_bdt | NUMERIC(12,2) | | Retail price at this bookstore |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `bookstore_id` references `bookstore(bookstore_id)` — many-to-one
- `edition_id` references `edition(edition_id)` — many-to-one

### Constraints
- PK: `(bookstore_id, edition_id)`
- FK: `bookstore_id` → `bookstore(bookstore_id)` ON DELETE CASCADE
- FK: `edition_id` → `edition(edition_id)` ON DELETE CASCADE

### Future Notes
- Consider adding `reorder_threshold`, `last_restocked_date` for automated replenishment.

---

## 57. Contract Party

### Table
`contract_party`

### Purpose
Junction table linking contracts to the various parties involved. Supports polymorphic entity references for flexible party types (author, agent, publisher, etc.).

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| contract_id | VARCHAR(15) | FK -> contract, NOT NULL | Associated contract |
| entity_type | VARCHAR(50) | NOT NULL | Type of party entity |
| entity_id | VARCHAR(15) | NOT NULL | ID of party entity |
| party_role | VARCHAR(50) | NOT NULL | Role in the contract (author, publisher, agent, etc.) |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `contract_id` references `contract(contract_id)` — many-to-one
- Polymorphic: `(entity_type, entity_id)` references multiple tables

### Constraints
- PK: `(contract_id, entity_type, entity_id)`
- FK: `contract_id` → `contract(contract_id)` ON DELETE CASCADE

### Future Notes
- None currently.

---

## 58. Contract Book

### Table
`contract_book`

### Purpose
Junction table linking contracts to the specific books covered by each agreement.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| contract_id | VARCHAR(15) | FK -> contract, NOT NULL | Associated contract |
| book_id | VARCHAR(15) | FK -> book, NOT NULL | Associated book |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `contract_id` references `contract(contract_id)` — many-to-one
- `book_id` references `book(book_id)` — many-to-one

### Constraints
- PK: `(contract_id, book_id)`
- FK: `contract_id` → `contract(contract_id)` ON DELETE CASCADE
- FK: `book_id` → `book(book_id)` ON DELETE CASCADE

### Future Notes
- None currently.

---

## 59. Submission Author

### Table
`submission_author`

### Purpose
Junction table linking submissions to their authors. Supports multiple authors per submission with a primary contact designation.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| submission_id | VARCHAR(15) | FK -> submission, NOT NULL | Associated submission |
| person_id | VARCHAR(15) | FK -> person, NOT NULL | Author person |
| is_primary_contact | BOOLEAN | DEFAULT FALSE | Whether this author is the primary contact |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `submission_id` references `submission(submission_id)` — many-to-one
- `person_id` references `person(person_id)` — many-to-one

### Constraints
- PK: `(submission_id, person_id)`
- FK: `submission_id` → `submission(submission_id)` ON DELETE CASCADE
- FK: `person_id` → `person(person_id)` ON DELETE CASCADE

### Future Notes
- Consider adding `author_order` for multi-author submissions.

---

## 60. Event Participant

### Table
`event_participant`

### Purpose
Junction table linking events to participating people. Tracks the role each person plays at the event.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| event_id | VARCHAR(15) | FK -> event, NOT NULL | Associated event |
| person_id | VARCHAR(15) | FK -> person, NOT NULL | Participant person |
| participant_role | VARCHAR(50) | DEFAULT 'attendee' | Role at the event |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `event_id` references `event(event_id)` — many-to-one
- `person_id` references `person(person_id)` — many-to-one

### Constraints
- PK: `(event_id, person_id)`
- FK: `event_id` → `event(event_id)` ON DELETE CASCADE
- FK: `person_id` → `person(person_id)` ON DELETE CASCADE

### Future Notes
- Consider adding `schedule_time`, `topic` for structured event programming.

---

## 61. Organization Member

### Table
`organization_member`

### Purpose
Junction table linking organizations to their members. Supports polymorphic member types (people, publishers, other organizations) with role and join date.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| organization_id | VARCHAR(15) | FK -> organization, NOT NULL | Associated organization |
| entity_type | VARCHAR(50) | NOT NULL | Type of member entity |
| entity_id | VARCHAR(15) | NOT NULL | ID of member entity |
| membership_role | VARCHAR(50) | DEFAULT 'member' | Role within the organization |
| join_date | DATE | DEFAULT CURRENT_DATE | Date the member joined |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `organization_id` references `organization(organization_id)` — many-to-one
- Polymorphic: `(entity_type, entity_id)` references multiple tables

### Constraints
- PK: `(organization_id, entity_type, entity_id)`
- FK: `organization_id` → `organization(organization_id)` ON DELETE CASCADE

### Future Notes
- Consider adding `membership_status` (active, expired, suspended) and `expiry_date`.

---

## 62. Entity Tag

### Table
`entity_tag`

### Purpose
Polymorphic junction table allowing tags to be applied to any entity type in the system, not just books.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| entity_type | VARCHAR(50) | NOT NULL | Type of tagged entity |
| entity_id | VARCHAR(15) | NOT NULL | ID of tagged entity |
| tag_id | VARCHAR(15) | FK -> tag, NOT NULL | Associated tag |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `tag_id` references `tag(tag_id)` — many-to-one
- Polymorphic: `(entity_type, entity_id)` references multiple tables

### Constraints
- PK: `(entity_type, entity_id, tag_id)`
- FK: `tag_id` → `tag(tag_id)` ON DELETE CASCADE

### Future Notes
- None currently.

---

## 63. Entity Source

### Table
`entity_source`

### Purpose
Polymorphic junction table linking any entity to its source of information. Provides provenance tracking across the system.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| entity_type | VARCHAR(50) | NOT NULL | Type of linked entity |
| entity_id | VARCHAR(15) | NOT NULL | ID of linked entity |
| source_id | VARCHAR(15) | FK -> source, NOT NULL | Associated source |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `source_id` references `source(source_id)` — many-to-one
- Polymorphic: `(entity_type, entity_id)` references multiple tables

### Constraints
- PK: `(entity_type, entity_id, source_id)`
- FK: `source_id` → `source(source_id)` ON DELETE CASCADE

### Future Notes
- Consider adding `confidence_level`, `relevance_score` for weighted source attribution.

---

## 64. Role Permission

### Table
`role_permission`

### Purpose
Junction table implementing the many-to-many relationship between roles and permissions for role-based access control.

### Columns
| Column | Type | Constraints | Description |
|---|---|---|---|
| role_id | VARCHAR(15) | FK -> role, NOT NULL | Associated role |
| permission_id | VARCHAR(15) | FK -> permission, NOT NULL | Associated permission |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### Relationships
- `role_id` references `role(role_id)` — many-to-one
- `permission_id` references `permission(permission_id)` — many-to-one

### Constraints
- PK: `(role_id, permission_id)`
- FK: `role_id` → `role(role_id)` ON DELETE CASCADE
- FK: `permission_id` → `permission(permission_id)` ON DELETE CASCADE

### Future Notes
- Consider adding `is_granted` boolean to support both grant and deny permissions.
