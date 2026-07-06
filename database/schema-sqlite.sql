-- ============================================================
-- tProkash Publishing Ecosystem - SQLite 3.40+ Schema
-- ============================================================

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- ============================================================
-- LOOKUP / REFERENCE TABLES
-- ============================================================

-- 1. language
CREATE TABLE language (
    language_id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_language_code ON language(code);
CREATE INDEX idx_language_is_active ON language(is_active);

-- 2. category
CREATE TABLE category (
    category_id TEXT PRIMARY KEY,
    parent_id TEXT DEFAULT NULL REFERENCES category(category_id),
    slug TEXT NOT NULL UNIQUE,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT DEFAULT NULL,
    level INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_category_parent_id ON category(parent_id);
CREATE INDEX idx_category_slug ON category(slug);

-- 3. contribution_role
CREATE TABLE contribution_role (
    contribution_role_id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_contribution_role_slug ON contribution_role(slug);

-- 4. country
CREATE TABLE country (
    country_id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_country_code ON country(code);
CREATE INDEX idx_country_is_active ON country(is_active);

-- 5. city
CREATE TABLE city (
    city_id TEXT PRIMARY KEY,
    country_id TEXT NOT NULL REFERENCES country(country_id),
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    is_capital INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_city_country_id ON city(country_id);
CREATE INDEX idx_city_is_active ON city(is_active);

-- 6. address
CREATE TABLE address (
    address_id TEXT PRIMARY KEY,
    city_id TEXT NOT NULL REFERENCES city(city_id),
    line_1 TEXT NOT NULL,
    line_2 TEXT DEFAULT NULL,
    postal_code TEXT DEFAULT NULL,
    latitude REAL DEFAULT NULL,
    longitude REAL DEFAULT NULL,
    is_primary INTEGER NOT NULL DEFAULT 0,
    entity_type TEXT DEFAULT NULL,
    entity_id TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_address_city_id ON address(city_id);
CREATE INDEX idx_address_entity ON address(entity_type, entity_id);

-- 7. tag
CREATE TABLE tag (
    tag_id TEXT PRIMARY KEY,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_tag_slug ON tag(slug);
CREATE INDEX idx_tag_is_active ON tag(is_active);

-- 8. keyword
CREATE TABLE keyword (
    keyword_id TEXT PRIMARY KEY,
    word TEXT NOT NULL UNIQUE,
    language_code TEXT DEFAULT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_keyword_word ON keyword(word);
CREATE INDEX idx_keyword_is_active ON keyword(is_active);

-- 9. role
CREATE TABLE role (
    role_id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    is_system INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_role_name ON role(name);
CREATE INDEX idx_role_is_active ON role(is_active);

-- 10. permission
CREATE TABLE permission (
    permission_id TEXT PRIMARY KEY,
    resource TEXT NOT NULL,
    action TEXT NOT NULL,
    description TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL,
    UNIQUE (resource, action)
);

CREATE INDEX idx_permission_resource ON permission(resource);

-- ============================================================
-- CORE ENTITY TABLES
-- ============================================================

-- 11. publisher
CREATE TABLE publisher (
    publisher_id TEXT PRIMARY KEY,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    website_url TEXT DEFAULT NULL,
    founded_year INTEGER DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    description_bn TEXT DEFAULT NULL,
    description_en TEXT DEFAULT NULL,
    logo_url TEXT DEFAULT NULL,
    verification_level TEXT NOT NULL DEFAULT 'Needs Review',
    address_id TEXT DEFAULT NULL REFERENCES address(address_id),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_publisher_slug ON publisher(slug);
CREATE INDEX idx_publisher_address_id ON publisher(address_id);
CREATE INDEX idx_publisher_status ON publisher(status);

-- 12. imprint
CREATE TABLE imprint (
    imprint_id TEXT PRIMARY KEY,
    publisher_id TEXT NOT NULL REFERENCES publisher(publisher_id),
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_imprint_publisher_id ON imprint(publisher_id);
CREATE INDEX idx_imprint_slug ON imprint(slug);

-- 13. person
CREATE TABLE person (
    person_id TEXT PRIMARY KEY,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    birth_year INTEGER DEFAULT NULL,
    death_year INTEGER DEFAULT NULL,
    biography_bn TEXT DEFAULT NULL,
    biography_en TEXT DEFAULT NULL,
    website_url TEXT DEFAULT NULL,
    pseudonym_of_id TEXT DEFAULT NULL REFERENCES person(person_id),
    verification_level TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_person_slug ON person(slug);
CREATE INDEX idx_person_pseudonym_of_id ON person(pseudonym_of_id);

-- 14. book
CREATE TABLE book (
    book_id TEXT PRIMARY KEY,
    title_bn TEXT NOT NULL,
    title_en TEXT NOT NULL,
    subtitle_bn TEXT DEFAULT NULL,
    subtitle_en TEXT DEFAULT NULL,
    slug TEXT NOT NULL UNIQUE,
    description_bn TEXT DEFAULT NULL,
    description_en TEXT DEFAULT NULL,
    imprint_id TEXT DEFAULT NULL REFERENCES imprint(imprint_id),
    series_id TEXT DEFAULT NULL,
    series_number INTEGER DEFAULT NULL,
    num_pages INTEGER DEFAULT NULL,
    publication_year INTEGER DEFAULT NULL,
    verification_level TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_book_slug ON book(slug);
CREATE INDEX idx_book_imprint_id ON book(imprint_id);
CREATE INDEX idx_book_series_id ON book(series_id);

-- 15. edition
CREATE TABLE edition (
    edition_id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL REFERENCES book(book_id),
    language_id TEXT NOT NULL REFERENCES language(language_id),
    edition_number INTEGER NOT NULL,
    edition_name TEXT DEFAULT NULL,
    format TEXT NOT NULL DEFAULT 'paperback',
    publication_date TEXT DEFAULT NULL,
    num_copies INTEGER NOT NULL DEFAULT 0,
    price_bdt REAL DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'planned',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_edition_book_id ON edition(book_id);
CREATE INDEX idx_edition_language_id ON edition(language_id);
CREATE INDEX idx_edition_status ON edition(status);

-- 16. isbn
CREATE TABLE isbn (
    isbn_id TEXT PRIMARY KEY,
    edition_id TEXT NOT NULL REFERENCES edition(edition_id),
    code TEXT NOT NULL UNIQUE,
    format TEXT NOT NULL,
    issued_date TEXT DEFAULT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_isbn_edition_id ON isbn(edition_id);
CREATE INDEX idx_isbn_code ON isbn(code);
CREATE INDEX idx_isbn_is_active ON isbn(is_active);

-- 17. series
CREATE TABLE series (
    series_id TEXT PRIMARY KEY,
    publisher_id TEXT DEFAULT NULL REFERENCES publisher(publisher_id),
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_series_slug ON series(slug);
CREATE INDEX idx_series_publisher_id ON series(publisher_id);
CREATE INDEX idx_series_is_active ON series(is_active);

-- 18. collection
CREATE TABLE collection (
    collection_id TEXT PRIMARY KEY,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    is_public INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_collection_slug ON collection(slug);
CREATE INDEX idx_collection_is_public ON collection(is_public);

-- 19. printer
CREATE TABLE printer (
    printer_id TEXT PRIMARY KEY,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    website_url TEXT DEFAULT NULL,
    address_id TEXT DEFAULT NULL REFERENCES address(address_id),
    services TEXT DEFAULT NULL,
    verification_level TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_printer_slug ON printer(slug);
CREATE INDEX idx_printer_address_id ON printer(address_id);

-- 20. printing
CREATE TABLE printing (
    printing_id TEXT PRIMARY KEY,
    edition_id TEXT NOT NULL REFERENCES edition(edition_id),
    printer_id TEXT NOT NULL REFERENCES printer(printer_id),
    print_batch_id TEXT DEFAULT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    quantity_delivered INTEGER NOT NULL DEFAULT 0,
    start_date TEXT DEFAULT NULL,
    completion_date TEXT DEFAULT NULL,
    cost_bdt REAL DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled',
    notes TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_printing_edition_id ON printing(edition_id);
CREATE INDEX idx_printing_printer_id ON printing(printer_id);
CREATE INDEX idx_printing_print_batch_id ON printing(print_batch_id);
CREATE INDEX idx_printing_status ON printing(status);

-- 21. print_batch
CREATE TABLE print_batch (
    print_batch_id TEXT PRIMARY KEY,
    batch_name TEXT DEFAULT NULL,
    description TEXT DEFAULT NULL,
    scheduled_date TEXT DEFAULT NULL,
    completed_date TEXT DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'planned',
    notes TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_print_batch_status ON print_batch(status);

-- 22. warehouse
CREATE TABLE warehouse (
    warehouse_id TEXT PRIMARY KEY,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    address_id TEXT DEFAULT NULL REFERENCES address(address_id),
    capacity INTEGER DEFAULT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_warehouse_slug ON warehouse(slug);
CREATE INDEX idx_warehouse_address_id ON warehouse(address_id);
CREATE INDEX idx_warehouse_is_active ON warehouse(is_active);

-- 23. inventory
CREATE TABLE inventory (
    inventory_id TEXT PRIMARY KEY,
    edition_id TEXT NOT NULL REFERENCES edition(edition_id),
    warehouse_id TEXT NOT NULL REFERENCES warehouse(warehouse_id),
    quantity_on_hand INTEGER NOT NULL DEFAULT 0 CHECK (quantity_on_hand >= 0),
    quantity_reserved INTEGER NOT NULL DEFAULT 0 CHECK (quantity_reserved >= 0),
    reorder_threshold INTEGER NOT NULL DEFAULT 10,
    last_restocked_date TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL,
    UNIQUE (edition_id, warehouse_id)
);

CREATE INDEX idx_inventory_edition_id ON inventory(edition_id);
CREATE INDEX idx_inventory_warehouse_id ON inventory(warehouse_id);

-- 24. distributor
CREATE TABLE distributor (
    distributor_id TEXT PRIMARY KEY,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    website_url TEXT DEFAULT NULL,
    address_id TEXT DEFAULT NULL REFERENCES address(address_id),
    service_areas TEXT DEFAULT NULL,
    verification_level TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_distributor_slug ON distributor(slug);
CREATE INDEX idx_distributor_address_id ON distributor(address_id);

-- 25. bookstore
CREATE TABLE bookstore (
    bookstore_id TEXT PRIMARY KEY,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    website_url TEXT DEFAULT NULL,
    address_id TEXT DEFAULT NULL REFERENCES address(address_id),
    store_type TEXT NOT NULL DEFAULT 'physical',
    is_active INTEGER NOT NULL DEFAULT 1,
    verification_level TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_bookstore_slug ON bookstore(slug);
CREATE INDEX idx_bookstore_address_id ON bookstore(address_id);
CREATE INDEX idx_bookstore_is_active ON bookstore(is_active);

-- 26. reader
CREATE TABLE reader (
    reader_id TEXT PRIMARY KEY,
    person_id TEXT DEFAULT NULL REFERENCES person(person_id),
    email TEXT NOT NULL UNIQUE,
    display_name TEXT DEFAULT NULL,
    join_date TEXT DEFAULT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_reader_person_id ON reader(person_id);
CREATE INDEX idx_reader_email ON reader(email);
CREATE INDEX idx_reader_is_active ON reader(is_active);

-- 27. review
CREATE TABLE review (
    review_id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL REFERENCES book(book_id),
    reader_id TEXT NOT NULL REFERENCES reader(reader_id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT DEFAULT NULL,
    body TEXT DEFAULT NULL,
    is_verified_purchase INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL,
    UNIQUE (book_id, reader_id)
);

CREATE INDEX idx_review_book_id ON review(book_id);
CREATE INDEX idx_review_reader_id ON review(reader_id);
CREATE INDEX idx_review_status ON review(status);

-- 28. award
CREATE TABLE award (
    award_id TEXT PRIMARY KEY,
    organization_id TEXT DEFAULT NULL,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    category_name TEXT DEFAULT NULL,
    year INTEGER DEFAULT NULL,
    description TEXT DEFAULT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_award_organization_id ON award(organization_id);
CREATE INDEX idx_award_is_active ON award(is_active);

-- 29. event
CREATE TABLE event (
    event_id TEXT PRIMARY KEY,
    organization_id TEXT DEFAULT NULL,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    event_type TEXT DEFAULT NULL,
    start_date TEXT DEFAULT NULL,
    end_date TEXT DEFAULT NULL,
    venue TEXT DEFAULT NULL,
    address_id TEXT DEFAULT NULL REFERENCES address(address_id),
    website_url TEXT DEFAULT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_event_organization_id ON event(organization_id);
CREATE INDEX idx_event_slug ON event(slug);
CREATE INDEX idx_event_address_id ON event(address_id);
CREATE INDEX idx_event_is_active ON event(is_active);

-- 30. organization
CREATE TABLE organization (
    organization_id TEXT PRIMARY KEY,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    organization_type TEXT DEFAULT NULL,
    website_url TEXT DEFAULT NULL,
    address_id TEXT DEFAULT NULL REFERENCES address(address_id),
    description TEXT DEFAULT NULL,
    founded_year INTEGER DEFAULT NULL,
    verification_level TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_organization_slug ON organization(slug);
CREATE INDEX idx_organization_address_id ON organization(address_id);

-- 31. license
CREATE TABLE license (
    license_id TEXT PRIMARY KEY,
    publisher_id TEXT NOT NULL REFERENCES publisher(publisher_id),
    license_type TEXT DEFAULT NULL,
    rights_granted TEXT DEFAULT NULL,
    territory TEXT NOT NULL DEFAULT 'Bangladesh',
    start_date TEXT DEFAULT NULL,
    end_date TEXT DEFAULT NULL,
    is_exclusive INTEGER NOT NULL DEFAULT 0,
    notes TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_license_publisher_id ON license(publisher_id);

-- 32. contract
CREATE TABLE contract (
    contract_id TEXT PRIMARY KEY,
    contract_number TEXT NOT NULL UNIQUE,
    contract_type TEXT DEFAULT NULL,
    start_date TEXT DEFAULT NULL,
    end_date TEXT DEFAULT NULL,
    publisher_id TEXT NOT NULL REFERENCES publisher(publisher_id),
    license_id TEXT DEFAULT NULL REFERENCES license(license_id),
    royalty_percentage REAL DEFAULT NULL,
    advance_amount_bdt REAL DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    notes TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_contract_contract_number ON contract(contract_number);
CREATE INDEX idx_contract_publisher_id ON contract(publisher_id);
CREATE INDEX idx_contract_license_id ON contract(license_id);
CREATE INDEX idx_contract_status ON contract(status);

-- 33. submission
CREATE TABLE submission (
    submission_id TEXT PRIMARY KEY,
    publisher_id TEXT NOT NULL REFERENCES publisher(publisher_id),
    title TEXT NOT NULL,
    submission_type TEXT NOT NULL DEFAULT 'manuscript',
    abstract TEXT DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    submitted_date TEXT DEFAULT NULL,
    decision_date TEXT DEFAULT NULL,
    decision_notes TEXT DEFAULT NULL,
    contract_id TEXT DEFAULT NULL REFERENCES contract(contract_id),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_submission_publisher_id ON submission(publisher_id);
CREATE INDEX idx_submission_contract_id ON submission(contract_id);
CREATE INDEX idx_submission_status ON submission(status);

-- 34. media_asset
CREATE TABLE media_asset (
    media_asset_id TEXT PRIMARY KEY,
    entity_type TEXT DEFAULT NULL,
    entity_id TEXT DEFAULT NULL,
    media_type TEXT DEFAULT NULL,
    title TEXT DEFAULT NULL,
    url TEXT NOT NULL,
    published_date TEXT DEFAULT NULL,
    source_name TEXT DEFAULT NULL,
    is_approved INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_media_asset_entity ON media_asset(entity_type, entity_id);

-- 35. digital_asset
CREATE TABLE digital_asset (
    digital_asset_id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL REFERENCES book(book_id),
    asset_type TEXT DEFAULT NULL,
    filename TEXT DEFAULT NULL,
    mime_type TEXT DEFAULT NULL,
    file_size_bytes INTEGER DEFAULT NULL,
    url TEXT DEFAULT NULL,
    description TEXT DEFAULT NULL,
    is_public INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_digital_asset_book_id ON digital_asset(book_id);

-- 36. dataset
CREATE TABLE dataset (
    dataset_id TEXT PRIMARY KEY,
    publisher_id TEXT DEFAULT NULL REFERENCES publisher(publisher_id),
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    version TEXT DEFAULT NULL,
    description TEXT DEFAULT NULL,
    license_type TEXT NOT NULL DEFAULT 'ODbL 1.0',
    file_url TEXT DEFAULT NULL,
    row_count INTEGER DEFAULT NULL,
    published_date TEXT DEFAULT NULL,
    is_public INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_dataset_slug ON dataset(slug);
CREATE INDEX idx_dataset_publisher_id ON dataset(publisher_id);

-- 37. source
CREATE TABLE source (
    source_id TEXT PRIMARY KEY,
    source_type TEXT DEFAULT NULL,
    title TEXT DEFAULT NULL,
    url TEXT DEFAULT NULL,
    reference_number TEXT DEFAULT NULL,
    published_date TEXT DEFAULT NULL,
    author_name TEXT DEFAULT NULL,
    is_verified INTEGER NOT NULL DEFAULT 0,
    confidence_score INTEGER NOT NULL DEFAULT 0 CHECK (confidence_score >= 0 AND confidence_score <= 100),
    verification_status TEXT NOT NULL DEFAULT 'draft',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

-- 38. verification
CREATE TABLE verification (
    verification_id TEXT PRIMARY KEY,
    entity_type TEXT DEFAULT NULL,
    entity_id TEXT DEFAULT NULL,
    verification_status TEXT NOT NULL,
    confidence_score INTEGER NOT NULL DEFAULT 0 CHECK (confidence_score >= 0 AND confidence_score <= 100),
    verified_by TEXT NOT NULL,
    source_id TEXT DEFAULT NULL REFERENCES source(source_id),
    notes TEXT DEFAULT NULL,
    verified_date TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_verification_entity ON verification(entity_type, entity_id);
CREATE INDEX idx_verification_verified_by ON verification(verified_by);
CREATE INDEX idx_verification_source_id ON verification(source_id);

-- 39. change_history
CREATE TABLE change_history (
    change_history_id TEXT PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    field_name TEXT NOT NULL,
    old_value TEXT DEFAULT NULL,
    new_value TEXT DEFAULT NULL,
    changed_by TEXT DEFAULT NULL,
    change_reason TEXT DEFAULT NULL,
    source_id TEXT DEFAULT NULL,
    changed_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX idx_change_history_entity ON change_history(entity_type, entity_id);
CREATE INDEX idx_change_history_changed_by ON change_history(changed_by);
CREATE INDEX idx_change_history_source_id ON change_history(source_id);
CREATE INDEX idx_change_history_changed_at ON change_history(changed_at);

-- 40. user
CREATE TABLE user (
    user_id TEXT PRIMARY KEY,
    person_id TEXT DEFAULT NULL REFERENCES person(person_id),
    role_id TEXT NOT NULL REFERENCES role(role_id),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name TEXT DEFAULT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    last_login TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_user_person_id ON user(person_id);
CREATE INDEX idx_user_role_id ON user(role_id);
CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_user_is_active ON user(is_active);

-- 41. audit_log
CREATE TABLE audit_log (
    audit_log_id TEXT PRIMARY KEY,
    actor_id TEXT DEFAULT NULL REFERENCES user(user_id),
    action TEXT NOT NULL,
    entity_type TEXT DEFAULT NULL,
    entity_id TEXT DEFAULT NULL,
    old_values TEXT DEFAULT NULL,
    new_values TEXT DEFAULT NULL,
    ip_address TEXT DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_audit_log_actor_id ON audit_log(actor_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);

-- 42. notification
CREATE TABLE notification (
    notification_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES user(user_id),
    notification_type TEXT DEFAULT NULL,
    subject TEXT DEFAULT NULL,
    body TEXT DEFAULT NULL,
    is_read INTEGER NOT NULL DEFAULT 0,
    sent_via TEXT NOT NULL DEFAULT 'in_app',
    sent_date TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_notification_user_id ON notification(user_id);
CREATE INDEX idx_notification_is_read ON notification(is_read);

-- 43. search_index
CREATE TABLE search_index (
    search_index_id TEXT PRIMARY KEY,
    entity_type TEXT DEFAULT NULL,
    entity_id TEXT DEFAULT NULL,
    searchable_text TEXT DEFAULT NULL,
    weight INTEGER NOT NULL DEFAULT 1,
    language_code TEXT DEFAULT NULL,
    last_indexed TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL,
    UNIQUE (entity_type, entity_id)
);

CREATE INDEX idx_search_index_entity ON search_index(entity_type, entity_id);

-- 44. api_client
CREATE TABLE api_client (
    api_client_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES user(user_id),
    client_id TEXT NOT NULL UNIQUE,
    client_secret_hash TEXT NOT NULL,
    name TEXT DEFAULT NULL,
    description TEXT DEFAULT NULL,
    rate_limit INTEGER NOT NULL DEFAULT 1000,
    scope TEXT DEFAULT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    last_used TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_api_client_user_id ON api_client(user_id);
CREATE INDEX idx_api_client_client_id ON api_client(client_id);
CREATE INDEX idx_api_client_is_active ON api_client(is_active);

-- 45. contact_method
CREATE TABLE contact_method (
    contact_method_id TEXT PRIMARY KEY,
    entity_type TEXT DEFAULT NULL,
    entity_id TEXT DEFAULT NULL,
    contact_type TEXT DEFAULT NULL,
    value TEXT NOT NULL,
    is_primary INTEGER NOT NULL DEFAULT 0,
    is_public INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_contact_method_entity ON contact_method(entity_type, entity_id);

-- ============================================================
-- JUNCTION TABLES
-- ============================================================

-- 46. book_author
CREATE TABLE book_author (
    book_id TEXT NOT NULL REFERENCES book(book_id),
    person_id TEXT NOT NULL REFERENCES person(person_id),
    author_order INTEGER DEFAULT NULL,
    PRIMARY KEY (book_id, person_id)
);

CREATE INDEX idx_book_author_person_id ON book_author(person_id);

-- 47. book_contributor
CREATE TABLE book_contributor (
    book_id TEXT NOT NULL REFERENCES book(book_id),
    person_id TEXT NOT NULL REFERENCES person(person_id),
    contribution_role_id TEXT NOT NULL REFERENCES contribution_role(contribution_role_id),
    PRIMARY KEY (book_id, person_id, contribution_role_id)
);

CREATE INDEX idx_book_contributor_person_id ON book_contributor(person_id);
CREATE INDEX idx_book_contributor_role_id ON book_contributor(contribution_role_id);

-- 48. book_publisher
CREATE TABLE book_publisher (
    book_id TEXT NOT NULL REFERENCES book(book_id),
    publisher_id TEXT NOT NULL REFERENCES publisher(publisher_id),
    role TEXT NOT NULL DEFAULT 'publisher',
    PRIMARY KEY (book_id, publisher_id)
);

CREATE INDEX idx_book_publisher_publisher_id ON book_publisher(publisher_id);

-- 49. book_category
CREATE TABLE book_category (
    book_id TEXT NOT NULL REFERENCES book(book_id),
    category_id TEXT NOT NULL REFERENCES category(category_id),
    PRIMARY KEY (book_id, category_id)
);

CREATE INDEX idx_book_category_category_id ON book_category(category_id);

-- 50. book_collection
CREATE TABLE book_collection (
    book_id TEXT NOT NULL REFERENCES book(book_id),
    collection_id TEXT NOT NULL REFERENCES collection(collection_id),
    added_date TEXT DEFAULT NULL,
    PRIMARY KEY (book_id, collection_id)
);

CREATE INDEX idx_book_collection_collection_id ON book_collection(collection_id);

-- 51. book_tag
CREATE TABLE book_tag (
    book_id TEXT NOT NULL REFERENCES book(book_id),
    tag_id TEXT NOT NULL REFERENCES tag(tag_id),
    PRIMARY KEY (book_id, tag_id)
);

CREATE INDEX idx_book_tag_tag_id ON book_tag(tag_id);

-- 52. book_keyword
CREATE TABLE book_keyword (
    book_id TEXT NOT NULL REFERENCES book(book_id),
    keyword_id TEXT NOT NULL REFERENCES keyword(keyword_id),
    PRIMARY KEY (book_id, keyword_id)
);

CREATE INDEX idx_book_keyword_keyword_id ON book_keyword(keyword_id);

-- 53. book_award
CREATE TABLE book_award (
    book_id TEXT NOT NULL REFERENCES book(book_id),
    award_id TEXT NOT NULL REFERENCES award(award_id),
    year INTEGER DEFAULT NULL,
    PRIMARY KEY (book_id, award_id)
);

CREATE INDEX idx_book_award_award_id ON book_award(award_id);

-- 54. book_event
CREATE TABLE book_event (
    book_id TEXT NOT NULL REFERENCES book(book_id),
    event_id TEXT NOT NULL REFERENCES event(event_id),
    participation_type TEXT NOT NULL DEFAULT 'featured',
    PRIMARY KEY (book_id, event_id)
);

CREATE INDEX idx_book_event_event_id ON book_event(event_id);

-- 55. edition_distributor
CREATE TABLE edition_distributor (
    edition_id TEXT NOT NULL REFERENCES edition(edition_id),
    distributor_id TEXT NOT NULL REFERENCES distributor(distributor_id),
    is_active INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (edition_id, distributor_id)
);

CREATE INDEX idx_edition_distributor_distributor_id ON edition_distributor(distributor_id);

-- 56. distributor_bookstore
CREATE TABLE distributor_bookstore (
    distributor_id TEXT NOT NULL REFERENCES distributor(distributor_id),
    bookstore_id TEXT NOT NULL REFERENCES bookstore(bookstore_id),
    contract_ref TEXT DEFAULT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (distributor_id, bookstore_id)
);

CREATE INDEX idx_distributor_bookstore_bookstore_id ON distributor_bookstore(bookstore_id);

-- 57. bookstore_inventory
CREATE TABLE bookstore_inventory (
    bookstore_id TEXT NOT NULL REFERENCES bookstore(bookstore_id),
    edition_id TEXT NOT NULL REFERENCES edition(edition_id),
    quantity_on_hand INTEGER DEFAULT NULL,
    price_bdt REAL DEFAULT NULL,
    PRIMARY KEY (bookstore_id, edition_id)
);

CREATE INDEX idx_bookstore_inventory_edition_id ON bookstore_inventory(edition_id);

-- 58. contract_party
CREATE TABLE contract_party (
    contract_id TEXT NOT NULL REFERENCES contract(contract_id),
    entity_type TEXT DEFAULT NULL,
    entity_id TEXT DEFAULT NULL,
    party_role TEXT DEFAULT NULL,
    PRIMARY KEY (contract_id, entity_type, entity_id)
);

CREATE INDEX idx_contract_party_entity ON contract_party(entity_type, entity_id);

-- 59. contract_book
CREATE TABLE contract_book (
    contract_id TEXT NOT NULL REFERENCES contract(contract_id),
    book_id TEXT NOT NULL REFERENCES book(book_id),
    PRIMARY KEY (contract_id, book_id)
);

CREATE INDEX idx_contract_book_book_id ON contract_book(book_id);

-- 60. submission_author
CREATE TABLE submission_author (
    submission_id TEXT NOT NULL REFERENCES submission(submission_id),
    person_id TEXT NOT NULL REFERENCES person(person_id),
    is_primary_contact INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (submission_id, person_id)
);

CREATE INDEX idx_submission_author_person_id ON submission_author(person_id);

-- 61. event_participant
CREATE TABLE event_participant (
    event_id TEXT NOT NULL REFERENCES event(event_id),
    person_id TEXT NOT NULL REFERENCES person(person_id),
    participant_role TEXT NOT NULL DEFAULT 'attendee',
    PRIMARY KEY (event_id, person_id)
);

CREATE INDEX idx_event_participant_person_id ON event_participant(person_id);

-- 62. organization_member
CREATE TABLE organization_member (
    organization_id TEXT NOT NULL REFERENCES organization(organization_id),
    entity_type TEXT DEFAULT NULL,
    entity_id TEXT DEFAULT NULL,
    membership_role TEXT NOT NULL DEFAULT 'member',
    join_date TEXT DEFAULT NULL,
    PRIMARY KEY (organization_id, entity_type, entity_id)
);

CREATE INDEX idx_organization_member_entity ON organization_member(entity_type, entity_id);

-- 63. entity_tag
CREATE TABLE entity_tag (
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    tag_id TEXT NOT NULL REFERENCES tag(tag_id),
    PRIMARY KEY (entity_type, entity_id, tag_id)
);

CREATE INDEX idx_entity_tag_tag_id ON entity_tag(tag_id);

-- 64. entity_source
CREATE TABLE entity_source (
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    source_id TEXT NOT NULL REFERENCES source(source_id),
    PRIMARY KEY (entity_type, entity_id, source_id)
);

CREATE INDEX idx_entity_source_source_id ON entity_source(source_id);

-- 65. role_permission
CREATE TABLE role_permission (
    role_id TEXT NOT NULL REFERENCES role(role_id),
    permission_id TEXT NOT NULL REFERENCES permission(permission_id),
    PRIMARY KEY (role_id, permission_id)
);

CREATE INDEX idx_role_permission_permission_id ON role_permission(permission_id);
