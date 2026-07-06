-- ============================================================
-- tProkash Publishing Ecosystem - PostgreSQL 15+ Schema
-- ============================================================

-- ============================================================
-- LOOKUP / REFERENCE TABLES
-- ============================================================

-- 1. language
CREATE TABLE language (
    language_id VARCHAR(15) PRIMARY KEY,
    code VARCHAR(255) NOT NULL UNIQUE,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

COMMENT ON TABLE language IS 'Supported publication languages';
COMMENT ON COLUMN language.language_id IS 'Primary key, e.g. LANG-A1B2C3D4E5';
COMMENT ON COLUMN language.code IS 'ISO 639-1 or custom language code';
COMMENT ON COLUMN language.name_bn IS 'Language name in Bengali';
COMMENT ON COLUMN language.name_en IS 'Language name in English';

CREATE INDEX idx_language_code ON language(code) WHERE deleted_at IS NULL;
CREATE INDEX idx_language_is_active ON language(is_active) WHERE deleted_at IS NULL;

-- 2. category
CREATE TABLE category (
    category_id VARCHAR(15) PRIMARY KEY,
    parent_id VARCHAR(15) DEFAULT NULL,
    slug TEXT NOT NULL UNIQUE,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT DEFAULT NULL,
    level INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES category(category_id)
);

COMMENT ON TABLE category IS 'Book categories with hierarchical parent support';

CREATE INDEX idx_category_parent_id ON category(parent_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_category_slug ON category(slug) WHERE deleted_at IS NULL;

-- 3. contribution_role
CREATE TABLE contribution_role (
    contribution_role_id VARCHAR(15) PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

COMMENT ON TABLE contribution_role IS 'Roles for book contributors (editor, translator, illustrator, etc.)';

CREATE INDEX idx_contribution_role_slug ON contribution_role(slug) WHERE deleted_at IS NULL;

-- 4. country
CREATE TABLE country (
    country_id VARCHAR(15) PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

COMMENT ON TABLE country 'Country reference data';

CREATE INDEX idx_country_code ON country(code) WHERE deleted_at IS NULL;
CREATE INDEX idx_country_is_active ON country(is_active) WHERE deleted_at IS NULL;

-- 5. city
CREATE TABLE city (
    city_id VARCHAR(15) PRIMARY KEY,
    country_id VARCHAR(15) NOT NULL,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    is_capital BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_city_country FOREIGN KEY (country_id) REFERENCES country(country_id)
);

COMMENT ON TABLE city 'Cities within countries';

CREATE INDEX idx_city_country_id ON city(country_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_city_is_active ON city(is_active) WHERE deleted_at IS NULL;

-- 6. address
CREATE TABLE address (
    address_id VARCHAR(15) PRIMARY KEY,
    city_id VARCHAR(15) NOT NULL,
    line_1 TEXT NOT NULL,
    line_2 TEXT DEFAULT NULL,
    postal_code TEXT DEFAULT NULL,
    latitude NUMERIC(10,7) DEFAULT NULL,
    longitude NUMERIC(10,7) DEFAULT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    entity_type TEXT DEFAULT NULL,
    entity_id TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_address_city FOREIGN KEY (city_id) REFERENCES city(city_id)
);

COMMENT ON TABLE address 'Polymorphic addresses linked to various entities';

CREATE INDEX idx_address_city_id ON address(city_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_address_entity ON address(entity_type, entity_id);

-- 7. tag
CREATE TABLE tag (
    tag_id VARCHAR(15) PRIMARY KEY,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

COMMENT ON TABLE tag 'Freely assignable tags for books and entities';

CREATE INDEX idx_tag_slug ON tag(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_tag_is_active ON tag(is_active) WHERE deleted_at IS NULL;

-- 8. keyword
CREATE TABLE keyword (
    keyword_id VARCHAR(15) PRIMARY KEY,
    word TEXT NOT NULL UNIQUE,
    language_code TEXT DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

COMMENT ON TABLE keyword 'Search keywords for books';

CREATE INDEX idx_keyword_word ON keyword(word) WHERE deleted_at IS NULL;
CREATE INDEX idx_keyword_is_active ON keyword(is_active) WHERE deleted_at IS NULL;

-- 9. role
CREATE TABLE role (
    role_id VARCHAR(15) PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

COMMENT ON TABLE role 'System user roles and permissions groups';

CREATE INDEX idx_role_name ON role(name) WHERE deleted_at IS NULL;
CREATE INDEX idx_role_is_active ON role(is_active) WHERE deleted_at IS NULL;

-- 10. permission
CREATE TABLE permission (
    permission_id VARCHAR(15) PRIMARY KEY,
    resource TEXT NOT NULL,
    action TEXT NOT NULL,
    description TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    UNIQUE (resource, action)
);

COMMENT ON TABLE permission 'Individual permissions for role-based access control';

CREATE INDEX idx_permission_resource ON permission(resource) WHERE deleted_at IS NULL;

-- ============================================================
-- CORE ENTITY TABLES
-- ============================================================

-- 11. publisher
CREATE TABLE publisher (
    publisher_id VARCHAR(15) PRIMARY KEY,
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
    address_id VARCHAR(15) DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_publisher_address FOREIGN KEY (address_id) REFERENCES address(address_id)
);

COMMENT ON TABLE publisher 'Publishing houses and independent publishers';

CREATE INDEX idx_publisher_slug ON publisher(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_publisher_address_id ON publisher(address_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_publisher_status ON publisher(status) WHERE deleted_at IS NULL;

-- 12. imprint
CREATE TABLE imprint (
    imprint_id VARCHAR(15) PRIMARY KEY,
    publisher_id VARCHAR(15) NOT NULL,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_imprint_publisher FOREIGN KEY (publisher_id) REFERENCES publisher(publisher_id)
);

COMMENT ON TABLE imprint 'Imprints (sub-brands) of publishers';

CREATE INDEX idx_imprint_publisher_id ON imprint(publisher_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_imprint_slug ON imprint(slug) WHERE deleted_at IS NULL;

-- 13. person
CREATE TABLE person (
    person_id VARCHAR(15) PRIMARY KEY,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    birth_year INTEGER DEFAULT NULL,
    death_year INTEGER DEFAULT NULL,
    biography_bn TEXT DEFAULT NULL,
    biography_en TEXT DEFAULT NULL,
    website_url TEXT DEFAULT NULL,
    pseudonym_of_id VARCHAR(15) DEFAULT NULL,
    verification_level TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_person_pseudonym FOREIGN KEY (pseudonym_of_id) REFERENCES person(person_id)
);

COMMENT ON TABLE person 'Authors, translators, editors, illustrators, and other persons';

CREATE INDEX idx_person_slug ON person(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_person_pseudonym_of_id ON person(pseudonym_of_id) WHERE deleted_at IS NULL;

-- 14. book
CREATE TABLE book (
    book_id VARCHAR(15) PRIMARY KEY,
    title_bn TEXT NOT NULL,
    title_en TEXT NOT NULL,
    subtitle_bn TEXT DEFAULT NULL,
    subtitle_en TEXT DEFAULT NULL,
    slug TEXT NOT NULL UNIQUE,
    description_bn TEXT DEFAULT NULL,
    description_en TEXT DEFAULT NULL,
    imprint_id VARCHAR(15) DEFAULT NULL,
    series_id VARCHAR(15) DEFAULT NULL,
    series_number INTEGER DEFAULT NULL,
    num_pages INTEGER DEFAULT NULL,
    publication_year INTEGER DEFAULT NULL,
    verification_level TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_book_imprint FOREIGN KEY (imprint_id) REFERENCES imprint(imprint_id)
);

COMMENT ON TABLE book 'Core book records';

CREATE INDEX idx_book_slug ON book(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_book_imprint_id ON book(imprint_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_book_series_id ON book(series_id) WHERE deleted_at IS NULL;

-- Full-text search on book
ALTER TABLE book ADD COLUMN book_tsv tsvector
    GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(title_en, '') || ' ' || coalesce(description_en, ''))
    ) STORED;

CREATE INDEX idx_book_fts ON book USING GIN (book_tsv) WHERE deleted_at IS NULL;

-- 15. edition
CREATE TABLE edition (
    edition_id VARCHAR(15) PRIMARY KEY,
    book_id VARCHAR(15) NOT NULL,
    language_id VARCHAR(15) NOT NULL,
    edition_number INTEGER NOT NULL,
    edition_name TEXT DEFAULT NULL,
    format TEXT NOT NULL DEFAULT 'paperback',
    publication_date DATE DEFAULT NULL,
    num_copies INTEGER NOT NULL DEFAULT 0,
    price_bdt NUMERIC(12,2) DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'planned',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_edition_book FOREIGN KEY (book_id) REFERENCES book(book_id),
    CONSTRAINT fk_edition_language FOREIGN KEY (language_id) REFERENCES language(language_id)
);

COMMENT ON TABLE edition 'Specific editions/versions of books';

CREATE INDEX idx_edition_book_id ON edition(book_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_edition_language_id ON edition(language_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_edition_status ON edition(status) WHERE deleted_at IS NULL;

-- 16. isbn
CREATE TABLE isbn (
    isbn_id VARCHAR(15) PRIMARY KEY,
    edition_id VARCHAR(15) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    format TEXT NOT NULL,
    issued_date DATE DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_isbn_edition FOREIGN KEY (edition_id) REFERENCES edition(edition_id)
);

COMMENT ON TABLE isbn 'ISBN numbers assigned to editions';

CREATE INDEX idx_isbn_edition_id ON isbn(edition_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_isbn_code ON isbn(code) WHERE deleted_at IS NULL;
CREATE INDEX idx_isbn_is_active ON isbn(is_active) WHERE deleted_at IS NULL;

-- 17. series
CREATE TABLE series (
    series_id VARCHAR(15) PRIMARY KEY,
    publisher_id VARCHAR(15) DEFAULT NULL,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_series_publisher FOREIGN KEY (publisher_id) REFERENCES publisher(publisher_id)
);

COMMENT ON TABLE series 'Book series';

CREATE INDEX idx_series_slug ON series(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_series_publisher_id ON series(publisher_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_series_is_active ON series(is_active) WHERE deleted_at IS NULL;

-- Add FK for book -> series (forward reference)
ALTER TABLE book ADD CONSTRAINT fk_book_series FOREIGN KEY (series_id) REFERENCES series(series_id);

-- 18. collection
CREATE TABLE collection (
    collection_id VARCHAR(15) PRIMARY KEY,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

COMMENT ON TABLE collection 'Curated book collections/lists';

CREATE INDEX idx_collection_slug ON collection(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_collection_is_public ON collection(is_public) WHERE deleted_at IS NULL;

-- 19. printer
CREATE TABLE printer (
    printer_id VARCHAR(15) PRIMARY KEY,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    website_url TEXT DEFAULT NULL,
    address_id VARCHAR(15) DEFAULT NULL,
    services TEXT DEFAULT NULL,
    verification_level TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_printer_address FOREIGN KEY (address_id) REFERENCES address(address_id)
);

COMMENT ON TABLE printer 'Printing press/service providers';

CREATE INDEX idx_printer_slug ON printer(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_printer_address_id ON printer(address_id) WHERE deleted_at IS NULL;

-- 20. printing
CREATE TABLE printing (
    printing_id VARCHAR(15) PRIMARY KEY,
    edition_id VARCHAR(15) NOT NULL,
    printer_id VARCHAR(15) NOT NULL,
    print_batch_id VARCHAR(15) DEFAULT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    quantity_delivered INTEGER NOT NULL DEFAULT 0,
    start_date DATE DEFAULT NULL,
    completion_date DATE DEFAULT NULL,
    cost_bdt NUMERIC(12,2) DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled',
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_printing_edition FOREIGN KEY (edition_id) REFERENCES edition(edition_id),
    CONSTRAINT fk_printing_printer FOREIGN KEY (printer_id) REFERENCES printer(printer_id)
);

COMMENT ON TABLE printing 'Printing runs for editions';

CREATE INDEX idx_printing_edition_id ON printing(edition_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_printing_printer_id ON printing(printer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_printing_print_batch_id ON printing(print_batch_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_printing_status ON printing(status) WHERE deleted_at IS NULL;

-- 21. print_batch
CREATE TABLE print_batch (
    print_batch_id VARCHAR(15) PRIMARY KEY,
    batch_name TEXT DEFAULT NULL,
    description TEXT DEFAULT NULL,
    scheduled_date DATE DEFAULT NULL,
    completed_date DATE DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'planned',
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

COMMENT ON TABLE print_batch 'Batched print jobs across multiple titles';

CREATE INDEX idx_print_batch_status ON print_batch(status) WHERE deleted_at IS NULL;

-- Add FK for printing -> print_batch (forward reference)
ALTER TABLE printing ADD CONSTRAINT fk_printing_print_batch FOREIGN KEY (print_batch_id) REFERENCES print_batch(print_batch_id);

-- 22. warehouse
CREATE TABLE warehouse (
    warehouse_id VARCHAR(15) PRIMARY KEY,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    address_id VARCHAR(15) DEFAULT NULL,
    capacity INTEGER DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_warehouse_address FOREIGN KEY (address_id) REFERENCES address(address_id)
);

COMMENT ON TABLE warehouse 'Inventory storage locations';

CREATE INDEX idx_warehouse_slug ON warehouse(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_warehouse_address_id ON warehouse(address_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_warehouse_is_active ON warehouse(is_active) WHERE deleted_at IS NULL;

-- 23. inventory
CREATE TABLE inventory (
    inventory_id VARCHAR(15) PRIMARY KEY,
    edition_id VARCHAR(15) NOT NULL,
    warehouse_id VARCHAR(15) NOT NULL,
    quantity_on_hand INTEGER NOT NULL DEFAULT 0 CHECK (quantity_on_hand >= 0),
    quantity_reserved INTEGER NOT NULL DEFAULT 0 CHECK (quantity_reserved >= 0),
    reorder_threshold INTEGER NOT NULL DEFAULT 10,
    last_restocked_date DATE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    UNIQUE (edition_id, warehouse_id),
    CONSTRAINT fk_inventory_edition FOREIGN KEY (edition_id) REFERENCES edition(edition_id),
    CONSTRAINT fk_inventory_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouse(warehouse_id)
);

COMMENT ON TABLE inventory 'Stock levels per edition per warehouse';

CREATE INDEX idx_inventory_edition_id ON inventory(edition_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_inventory_warehouse_id ON inventory(warehouse_id) WHERE deleted_at IS NULL;

-- 24. distributor
CREATE TABLE distributor (
    distributor_id VARCHAR(15) PRIMARY KEY,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    website_url TEXT DEFAULT NULL,
    address_id VARCHAR(15) DEFAULT NULL,
    service_areas TEXT DEFAULT NULL,
    verification_level TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_distributor_address FOREIGN KEY (address_id) REFERENCES address(address_id)
);

COMMENT ON TABLE distributor 'Book distributors and wholesalers';

CREATE INDEX idx_distributor_slug ON distributor(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_distributor_address_id ON distributor(address_id) WHERE deleted_at IS NULL;

-- 25. bookstore
CREATE TABLE bookstore (
    bookstore_id VARCHAR(15) PRIMARY KEY,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    website_url TEXT DEFAULT NULL,
    address_id VARCHAR(15) DEFAULT NULL,
    store_type TEXT NOT NULL DEFAULT 'physical',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    verification_level TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_bookstore_address FOREIGN KEY (address_id) REFERENCES address(address_id)
);

COMMENT ON TABLE bookstore 'Retail bookstores (physical and online)';

CREATE INDEX idx_bookstore_slug ON bookstore(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_bookstore_address_id ON bookstore(address_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_bookstore_is_active ON bookstore(is_active) WHERE deleted_at IS NULL;

-- 26. reader
CREATE TABLE reader (
    reader_id VARCHAR(15) PRIMARY KEY,
    person_id VARCHAR(15) DEFAULT NULL,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT DEFAULT NULL,
    join_date DATE DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_reader_person FOREIGN KEY (person_id) REFERENCES person(person_id)
);

COMMENT ON TABLE reader 'Reader/reviewer accounts';

CREATE INDEX idx_reader_person_id ON reader(person_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_reader_email ON reader(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_reader_is_active ON reader(is_active) WHERE deleted_at IS NULL;

-- 27. review
CREATE TABLE review (
    review_id VARCHAR(15) PRIMARY KEY,
    book_id VARCHAR(15) NOT NULL,
    reader_id VARCHAR(15) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT DEFAULT NULL,
    body TEXT DEFAULT NULL,
    is_verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    UNIQUE (book_id, reader_id),
    CONSTRAINT fk_review_book FOREIGN KEY (book_id) REFERENCES book(book_id),
    CONSTRAINT fk_review_reader FOREIGN KEY (reader_id) REFERENCES reader(reader_id)
);

COMMENT ON TABLE review 'Book reviews and ratings by readers';

CREATE INDEX idx_review_book_id ON review(book_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_review_reader_id ON review(reader_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_review_status ON review(status) WHERE deleted_at IS NULL;

-- 28. award
CREATE TABLE award (
    award_id VARCHAR(15) PRIMARY KEY,
    organization_id VARCHAR(15) DEFAULT NULL,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    category_name TEXT DEFAULT NULL,
    year INTEGER DEFAULT NULL,
    description TEXT DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

COMMENT ON TABLE award 'Literary awards and honors';

CREATE INDEX idx_award_organization_id ON award(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_award_is_active ON award(is_active) WHERE deleted_at IS NULL;

-- 29. event
CREATE TABLE event (
    event_id VARCHAR(15) PRIMARY KEY,
    organization_id VARCHAR(15) DEFAULT NULL,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    event_type TEXT DEFAULT NULL,
    start_date DATE DEFAULT NULL,
    end_date DATE DEFAULT NULL,
    venue TEXT DEFAULT NULL,
    address_id VARCHAR(15) DEFAULT NULL,
    website_url TEXT DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_event_address FOREIGN KEY (address_id) REFERENCES address(address_id)
);

COMMENT ON TABLE event 'Book fairs, launches, signings, and literary events';

CREATE INDEX idx_event_organization_id ON event(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_event_slug ON event(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_event_address_id ON event(address_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_event_is_active ON event(is_active) WHERE deleted_at IS NULL;

-- 30. organization
CREATE TABLE organization (
    organization_id VARCHAR(15) PRIMARY KEY,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    organization_type TEXT DEFAULT NULL,
    website_url TEXT DEFAULT NULL,
    address_id VARCHAR(15) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    founded_year INTEGER DEFAULT NULL,
    verification_level TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_organization_address FOREIGN KEY (address_id) REFERENCES address(address_id)
);

COMMENT ON TABLE organization 'Organizations (award bodies, event hosts, etc.)';

CREATE INDEX idx_organization_slug ON organization(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_organization_address_id ON organization(address_id) WHERE deleted_at IS NULL;

-- Add FK for award -> organization (forward reference)
ALTER TABLE award ADD CONSTRAINT fk_award_organization FOREIGN KEY (organization_id) REFERENCES organization(organization_id);

-- Add FK for event -> organization (forward reference)
ALTER TABLE event ADD CONSTRAINT fk_event_organization FOREIGN KEY (organization_id) REFERENCES organization(organization_id);

-- 31. license
CREATE TABLE license (
    license_id VARCHAR(15) PRIMARY KEY,
    publisher_id VARCHAR(15) NOT NULL,
    license_type TEXT DEFAULT NULL,
    rights_granted TEXT DEFAULT NULL,
    territory TEXT NOT NULL DEFAULT 'Bangladesh',
    start_date DATE DEFAULT NULL,
    end_date DATE DEFAULT NULL,
    is_exclusive BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_license_publisher FOREIGN KEY (publisher_id) REFERENCES publisher(publisher_id)
);

COMMENT ON TABLE license 'Publishing licenses and rights agreements';

CREATE INDEX idx_license_publisher_id ON license(publisher_id) WHERE deleted_at IS NULL;

-- 32. contract
CREATE TABLE contract (
    contract_id VARCHAR(15) PRIMARY KEY,
    contract_number TEXT NOT NULL UNIQUE,
    contract_type TEXT DEFAULT NULL,
    start_date DATE DEFAULT NULL,
    end_date DATE DEFAULT NULL,
    publisher_id VARCHAR(15) NOT NULL,
    license_id VARCHAR(15) DEFAULT NULL,
    royalty_percentage NUMERIC(12,2) DEFAULT NULL,
    advance_amount_bdt NUMERIC(12,2) DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_contract_publisher FOREIGN KEY (publisher_id) REFERENCES publisher(publisher_id),
    CONSTRAINT fk_contract_license FOREIGN KEY (license_id) REFERENCES license(license_id)
);

COMMENT ON TABLE contract 'Author/publisher contracts';

CREATE INDEX idx_contract_contract_number ON contract(contract_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_contract_publisher_id ON contract(publisher_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_contract_license_id ON contract(license_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_contract_status ON contract(status) WHERE deleted_at IS NULL;

-- 33. submission
CREATE TABLE submission (
    submission_id VARCHAR(15) PRIMARY KEY,
    publisher_id VARCHAR(15) NOT NULL,
    title TEXT NOT NULL,
    submission_type TEXT NOT NULL DEFAULT 'manuscript',
    abstract TEXT DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    submitted_date DATE DEFAULT NULL,
    decision_date DATE DEFAULT NULL,
    decision_notes TEXT DEFAULT NULL,
    contract_id VARCHAR(15) DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_submission_publisher FOREIGN KEY (publisher_id) REFERENCES publisher(publisher_id),
    CONSTRAINT fk_submission_contract FOREIGN KEY (contract_id) REFERENCES contract(contract_id)
);

COMMENT ON TABLE submission 'Manuscript and proposal submissions';

CREATE INDEX idx_submission_publisher_id ON submission(publisher_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_submission_contract_id ON submission(contract_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_submission_status ON submission(status) WHERE deleted_at IS NULL;

-- 34. media_asset
CREATE TABLE media_asset (
    media_asset_id VARCHAR(15) PRIMARY KEY,
    entity_type TEXT DEFAULT NULL,
    entity_id TEXT DEFAULT NULL,
    media_type TEXT DEFAULT NULL,
    title TEXT DEFAULT NULL,
    url TEXT NOT NULL,
    published_date DATE DEFAULT NULL,
    source_name TEXT DEFAULT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

COMMENT ON TABLE media_asset 'Media coverage and press mentions';

CREATE INDEX idx_media_asset_entity ON media_asset(entity_type, entity_id);

-- 35. digital_asset
CREATE TABLE digital_asset (
    digital_asset_id VARCHAR(15) PRIMARY KEY,
    book_id VARCHAR(15) NOT NULL,
    asset_type TEXT DEFAULT NULL,
    filename TEXT DEFAULT NULL,
    mime_type TEXT DEFAULT NULL,
    file_size_bytes INTEGER DEFAULT NULL,
    url TEXT DEFAULT NULL,
    description TEXT DEFAULT NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_digital_asset_book FOREIGN KEY (book_id) REFERENCES book(book_id)
);

COMMENT ON TABLE digital_asset 'Digital files (ebooks, covers, samples)';

CREATE INDEX idx_digital_asset_book_id ON digital_asset(book_id) WHERE deleted_at IS NULL;

-- 36. dataset
CREATE TABLE dataset (
    dataset_id VARCHAR(15) PRIMARY KEY,
    publisher_id VARCHAR(15) DEFAULT NULL,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    version TEXT DEFAULT NULL,
    description TEXT DEFAULT NULL,
    license_type TEXT NOT NULL DEFAULT 'ODbL 1.0',
    file_url TEXT DEFAULT NULL,
    row_count INTEGER DEFAULT NULL,
    published_date DATE DEFAULT NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_dataset_publisher FOREIGN KEY (publisher_id) REFERENCES publisher(publisher_id)
);

COMMENT ON TABLE dataset 'Open data datasets published by the ecosystem';

CREATE INDEX idx_dataset_slug ON dataset(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_dataset_publisher_id ON dataset(publisher_id) WHERE deleted_at IS NULL;

-- 37. source
CREATE TABLE source (
    source_id VARCHAR(15) PRIMARY KEY,
    source_type TEXT DEFAULT NULL,
    title TEXT DEFAULT NULL,
    url TEXT DEFAULT NULL,
    reference_number TEXT DEFAULT NULL,
    published_date DATE DEFAULT NULL,
    author_name TEXT DEFAULT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    confidence_score INTEGER NOT NULL DEFAULT 0 CHECK (confidence_score >= 0 AND confidence_score <= 100),
    verification_status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

COMMENT ON TABLE source 'Verification sources and references';
COMMENT ON COLUMN source.confidence_score IS 'Confidence score (0-100) for source reliability';
COMMENT ON COLUMN source.verification_status IS 'Verification status of the source e.g. draft, verified, rejected';

-- 38. verification
CREATE TABLE verification (
    verification_id VARCHAR(15) PRIMARY KEY,
    entity_type TEXT DEFAULT NULL,
    entity_id TEXT DEFAULT NULL,
    verification_status TEXT NOT NULL,
    confidence_score INTEGER NOT NULL DEFAULT 0 CHECK (confidence_score >= 0 AND confidence_score <= 100),
    verified_by VARCHAR(15) NOT NULL,
    source_id VARCHAR(15) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    verified_date DATE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_verification_source FOREIGN KEY (source_id) REFERENCES source(source_id)
);

COMMENT ON TABLE verification 'Entity verification/approval records';
COMMENT ON COLUMN verification.verification_status IS 'Current verification status';
COMMENT ON COLUMN verification.confidence_score IS 'Confidence score (0-100) for verification';

CREATE INDEX idx_verification_entity ON verification(entity_type, entity_id);
CREATE INDEX idx_verification_verified_by ON verification(verified_by) WHERE deleted_at IS NULL;
CREATE INDEX idx_verification_source_id ON verification(source_id) WHERE deleted_at IS NULL;

-- 39. change_history
CREATE TABLE change_history (
    change_history_id VARCHAR(15) PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    field_name TEXT NOT NULL,
    old_value TEXT DEFAULT NULL,
    new_value TEXT DEFAULT NULL,
    changed_by VARCHAR(15) DEFAULT NULL,
    change_reason TEXT DEFAULT NULL,
    source_id VARCHAR(15) DEFAULT NULL,
    changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE change_history IS 'Track field-level changes to any entity';

CREATE INDEX idx_change_history_entity ON change_history(entity_type, entity_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_change_history_changed_by ON change_history(changed_by) WHERE deleted_at IS NULL;
CREATE INDEX idx_change_history_source_id ON change_history(source_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_change_history_changed_at ON change_history(changed_at) WHERE deleted_at IS NULL;

-- 40. "user"
CREATE TABLE "user" (
    user_id VARCHAR(15) PRIMARY KEY,
    person_id VARCHAR(15) DEFAULT NULL,
    role_id VARCHAR(15) NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name TEXT DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_user_person FOREIGN KEY (person_id) REFERENCES person(person_id),
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES role(role_id)
);

COMMENT ON TABLE "user" 'System user accounts';

CREATE INDEX idx_user_person_id ON "user"(person_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_role_id ON "user"(role_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_email ON "user"(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_is_active ON "user"(is_active) WHERE deleted_at IS NULL;

-- Add FK for verification -> user (forward reference)
ALTER TABLE verification ADD CONSTRAINT fk_verification_user FOREIGN KEY (verified_by) REFERENCES "user"(user_id);

-- Add FK for change_history -> user (forward reference)
ALTER TABLE change_history ADD CONSTRAINT fk_change_history_user FOREIGN KEY (changed_by) REFERENCES "user"(user_id);

-- Add FK for change_history -> source (forward reference)
ALTER TABLE change_history ADD CONSTRAINT fk_change_history_source FOREIGN KEY (source_id) REFERENCES source(source_id);

-- 41. audit_log
CREATE TABLE audit_log (
    audit_log_id VARCHAR(15) PRIMARY KEY,
    actor_id VARCHAR(15) DEFAULT NULL,
    action TEXT NOT NULL,
    entity_type TEXT DEFAULT NULL,
    entity_id TEXT DEFAULT NULL,
    old_values JSONB DEFAULT NULL,
    new_values JSONB DEFAULT NULL,
    ip_address TEXT DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_audit_log_user FOREIGN KEY (actor_id) REFERENCES "user"(user_id)
);

COMMENT ON TABLE audit_log 'Audit trail for all entity changes';
COMMENT ON COLUMN audit_log.old_values IS 'JSONB snapshot of previous values';
COMMENT ON COLUMN audit_log.new_values IS 'JSONB snapshot of new values';

CREATE INDEX idx_audit_log_actor_id ON audit_log(actor_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);

-- 42. notification
CREATE TABLE notification (
    notification_id VARCHAR(15) PRIMARY KEY,
    user_id VARCHAR(15) NOT NULL,
    notification_type TEXT DEFAULT NULL,
    subject TEXT DEFAULT NULL,
    body TEXT DEFAULT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    sent_via TEXT NOT NULL DEFAULT 'in_app',
    sent_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES "user"(user_id)
);

COMMENT ON TABLE notification 'In-app and email notifications';

CREATE INDEX idx_notification_user_id ON notification(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_notification_is_read ON notification(is_read) WHERE deleted_at IS NULL;

-- 43. search_index
CREATE TABLE search_index (
    search_index_id VARCHAR(15) PRIMARY KEY,
    entity_type TEXT DEFAULT NULL,
    entity_id TEXT DEFAULT NULL,
    searchable_text TEXT DEFAULT NULL,
    weight INTEGER NOT NULL DEFAULT 1,
    language_code TEXT DEFAULT NULL,
    last_indexed TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    UNIQUE (entity_type, entity_id)
);

COMMENT ON TABLE search_index 'Unified search index across entity types';

CREATE INDEX idx_search_index_entity ON search_index(entity_type, entity_id);

-- Full-text search on search_index
ALTER TABLE search_index ADD COLUMN search_index_tsv tsvector
    GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(searchable_text, ''))
    ) STORED;

CREATE INDEX idx_search_index_fts ON search_index USING GIN (search_index_tsv);

-- 44. api_client
CREATE TABLE api_client (
    api_client_id VARCHAR(15) PRIMARY KEY,
    user_id VARCHAR(15) NOT NULL,
    client_id TEXT NOT NULL UNIQUE,
    client_secret_hash TEXT NOT NULL,
    name TEXT DEFAULT NULL,
    description TEXT DEFAULT NULL,
    rate_limit INTEGER NOT NULL DEFAULT 1000,
    scope TEXT DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT fk_api_client_user FOREIGN KEY (user_id) REFERENCES "user"(user_id)
);

COMMENT ON TABLE api_client 'API client credentials for integrations';

CREATE INDEX idx_api_client_user_id ON api_client(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_api_client_client_id ON api_client(client_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_api_client_is_active ON api_client(is_active) WHERE deleted_at IS NULL;

-- 45. contact_method
CREATE TABLE contact_method (
    contact_method_id VARCHAR(15) PRIMARY KEY,
    entity_type TEXT DEFAULT NULL,
    entity_id TEXT DEFAULT NULL,
    contact_type TEXT DEFAULT NULL,
    value TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

COMMENT ON TABLE contact_method 'Polymorphic contact details (phone, email, social)';

CREATE INDEX idx_contact_method_entity ON contact_method(entity_type, entity_id);

-- ============================================================
-- JUNCTION TABLES
-- ============================================================

-- 46. book_author
CREATE TABLE book_author (
    book_id VARCHAR(15) NOT NULL,
    person_id VARCHAR(15) NOT NULL,
    author_order INTEGER DEFAULT NULL,
    PRIMARY KEY (book_id, person_id),
    CONSTRAINT fk_book_author_book FOREIGN KEY (book_id) REFERENCES book(book_id),
    CONSTRAINT fk_book_author_person FOREIGN KEY (person_id) REFERENCES person(person_id)
);

COMMENT ON TABLE book_author 'Maps authors to their books with ordering';

CREATE INDEX idx_book_author_person_id ON book_author(person_id);

-- 47. book_contributor
CREATE TABLE book_contributor (
    book_id VARCHAR(15) NOT NULL,
    person_id VARCHAR(15) NOT NULL,
    contribution_role_id VARCHAR(15) NOT NULL,
    PRIMARY KEY (book_id, person_id, contribution_role_id),
    CONSTRAINT fk_book_contributor_book FOREIGN KEY (book_id) REFERENCES book(book_id),
    CONSTRAINT fk_book_contributor_person FOREIGN KEY (person_id) REFERENCES person(person_id),
    CONSTRAINT fk_book_contributor_role FOREIGN KEY (contribution_role_id) REFERENCES contribution_role(contribution_role_id)
);

COMMENT ON TABLE book_contributor 'Non-author contributors with specific roles';

CREATE INDEX idx_book_contributor_person_id ON book_contributor(person_id);
CREATE INDEX idx_book_contributor_role_id ON book_contributor(contribution_role_id);

-- 48. book_publisher
CREATE TABLE book_publisher (
    book_id VARCHAR(15) NOT NULL,
    publisher_id VARCHAR(15) NOT NULL,
    role TEXT NOT NULL DEFAULT 'publisher',
    PRIMARY KEY (book_id, publisher_id),
    CONSTRAINT fk_book_publisher_book FOREIGN KEY (book_id) REFERENCES book(book_id),
    CONSTRAINT fk_book_publisher_publisher FOREIGN KEY (publisher_id) REFERENCES publisher(publisher_id)
);

COMMENT ON TABLE book_publisher 'Maps books to publishers with role';

CREATE INDEX idx_book_publisher_publisher_id ON book_publisher(publisher_id);

-- 49. book_category
CREATE TABLE book_category (
    book_id VARCHAR(15) NOT NULL,
    category_id VARCHAR(15) NOT NULL,
    PRIMARY KEY (book_id, category_id),
    CONSTRAINT fk_book_category_book FOREIGN KEY (book_id) REFERENCES book(book_id),
    CONSTRAINT fk_book_category_category FOREIGN KEY (category_id) REFERENCES category(category_id)
);

COMMENT ON TABLE book_category 'Book-to-category assignments';

CREATE INDEX idx_book_category_category_id ON book_category(category_id);

-- 50. book_collection
CREATE TABLE book_collection (
    book_id VARCHAR(15) NOT NULL,
    collection_id VARCHAR(15) NOT NULL,
    added_date DATE DEFAULT NULL,
    PRIMARY KEY (book_id, collection_id),
    CONSTRAINT fk_book_collection_book FOREIGN KEY (book_id) REFERENCES book(book_id),
    CONSTRAINT fk_book_collection_collection FOREIGN KEY (collection_id) REFERENCES collection(collection_id)
);

COMMENT ON TABLE book_collection 'Maps books to curated collections';

CREATE INDEX idx_book_collection_collection_id ON book_collection(collection_id);

-- 51. book_tag
CREATE TABLE book_tag (
    book_id VARCHAR(15) NOT NULL,
    tag_id VARCHAR(15) NOT NULL,
    PRIMARY KEY (book_id, tag_id),
    CONSTRAINT fk_book_tag_book FOREIGN KEY (book_id) REFERENCES book(book_id),
    CONSTRAINT fk_book_tag_tag FOREIGN KEY (tag_id) REFERENCES tag(tag_id)
);

COMMENT ON TABLE book_tag 'Maps books to tags';

CREATE INDEX idx_book_tag_tag_id ON book_tag(tag_id);

-- 52. book_keyword
CREATE TABLE book_keyword (
    book_id VARCHAR(15) NOT NULL,
    keyword_id VARCHAR(15) NOT NULL,
    PRIMARY KEY (book_id, keyword_id),
    CONSTRAINT fk_book_keyword_book FOREIGN KEY (book_id) REFERENCES book(book_id),
    CONSTRAINT fk_book_keyword_keyword FOREIGN KEY (keyword_id) REFERENCES keyword(keyword_id)
);

COMMENT ON TABLE book_keyword 'Maps books to search keywords';

CREATE INDEX idx_book_keyword_keyword_id ON book_keyword(keyword_id);

-- 53. book_award
CREATE TABLE book_award (
    book_id VARCHAR(15) NOT NULL,
    award_id VARCHAR(15) NOT NULL,
    year INTEGER DEFAULT NULL,
    PRIMARY KEY (book_id, award_id),
    CONSTRAINT fk_book_award_book FOREIGN KEY (book_id) REFERENCES book(book_id),
    CONSTRAINT fk_book_award_award FOREIGN KEY (award_id) REFERENCES award(award_id)
);

COMMENT ON TABLE book_award 'Maps books to awards received';

CREATE INDEX idx_book_award_award_id ON book_award(award_id);

-- 54. book_event
CREATE TABLE book_event (
    book_id VARCHAR(15) NOT NULL,
    event_id VARCHAR(15) NOT NULL,
    participation_type TEXT NOT NULL DEFAULT 'featured',
    PRIMARY KEY (book_id, event_id),
    CONSTRAINT fk_book_event_book FOREIGN KEY (book_id) REFERENCES book(book_id),
    CONSTRAINT fk_book_event_event FOREIGN KEY (event_id) REFERENCES event(event_id)
);

COMMENT ON TABLE book_event 'Maps books to events';

CREATE INDEX idx_book_event_event_id ON book_event(event_id);

-- 55. edition_distributor
CREATE TABLE edition_distributor (
    edition_id VARCHAR(15) NOT NULL,
    distributor_id VARCHAR(15) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (edition_id, distributor_id),
    CONSTRAINT fk_edition_distributor_edition FOREIGN KEY (edition_id) REFERENCES edition(edition_id),
    CONSTRAINT fk_edition_distributor_distributor FOREIGN KEY (distributor_id) REFERENCES distributor(distributor_id)
);

COMMENT ON TABLE edition_distributor 'Maps editions to distributors';

CREATE INDEX idx_edition_distributor_distributor_id ON edition_distributor(distributor_id);

-- 56. distributor_bookstore
CREATE TABLE distributor_bookstore (
    distributor_id VARCHAR(15) NOT NULL,
    bookstore_id VARCHAR(15) NOT NULL,
    contract_ref TEXT DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (distributor_id, bookstore_id),
    CONSTRAINT fk_distributor_bookstore_distributor FOREIGN KEY (distributor_id) REFERENCES distributor(distributor_id),
    CONSTRAINT fk_distributor_bookstore_bookstore FOREIGN KEY (bookstore_id) REFERENCES bookstore(bookstore_id)
);

COMMENT ON TABLE distributor_bookstore 'Maps distributors to bookstores';

CREATE INDEX idx_distributor_bookstore_bookstore_id ON distributor_bookstore(bookstore_id);

-- 57. bookstore_inventory
CREATE TABLE bookstore_inventory (
    bookstore_id VARCHAR(15) NOT NULL,
    edition_id VARCHAR(15) NOT NULL,
    quantity_on_hand INTEGER DEFAULT NULL,
    price_bdt NUMERIC(12,2) DEFAULT NULL,
    PRIMARY KEY (bookstore_id, edition_id),
    CONSTRAINT fk_bookstore_inventory_bookstore FOREIGN KEY (bookstore_id) REFERENCES bookstore(bookstore_id),
    CONSTRAINT fk_bookstore_inventory_edition FOREIGN KEY (edition_id) REFERENCES edition(edition_id)
);

COMMENT ON TABLE bookstore_inventory 'Per-bookstore stock and pricing';

CREATE INDEX idx_bookstore_inventory_edition_id ON bookstore_inventory(edition_id);

-- 58. contract_party
CREATE TABLE contract_party (
    contract_id VARCHAR(15) NOT NULL,
    entity_type TEXT DEFAULT NULL,
    entity_id TEXT DEFAULT NULL,
    party_role TEXT DEFAULT NULL,
    PRIMARY KEY (contract_id, entity_type, entity_id),
    CONSTRAINT fk_contract_party_contract FOREIGN KEY (contract_id) REFERENCES contract(contract_id)
);

COMMENT ON TABLE contract_party 'Parties involved in a contract';

CREATE INDEX idx_contract_party_entity ON contract_party(entity_type, entity_id);

-- 59. contract_book
CREATE TABLE contract_book (
    contract_id VARCHAR(15) NOT NULL,
    book_id VARCHAR(15) NOT NULL,
    PRIMARY KEY (contract_id, book_id),
    CONSTRAINT fk_contract_book_contract FOREIGN KEY (contract_id) REFERENCES contract(contract_id),
    CONSTRAINT fk_contract_book_book FOREIGN KEY (book_id) REFERENCES book(book_id)
);

COMMENT ON TABLE contract_book 'Maps contracts to covered books';

CREATE INDEX idx_contract_book_book_id ON contract_book(book_id);

-- 60. submission_author
CREATE TABLE submission_author (
    submission_id VARCHAR(15) NOT NULL,
    person_id VARCHAR(15) NOT NULL,
    is_primary_contact BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (submission_id, person_id),
    CONSTRAINT fk_submission_author_submission FOREIGN KEY (submission_id) REFERENCES submission(submission_id),
    CONSTRAINT fk_submission_author_person FOREIGN KEY (person_id) REFERENCES person(person_id)
);

COMMENT ON TABLE submission_author 'Maps submissions to authors';

CREATE INDEX idx_submission_author_person_id ON submission_author(person_id);

-- 61. event_participant
CREATE TABLE event_participant (
    event_id VARCHAR(15) NOT NULL,
    person_id VARCHAR(15) NOT NULL,
    participant_role TEXT NOT NULL DEFAULT 'attendee',
    PRIMARY KEY (event_id, person_id),
    CONSTRAINT fk_event_participant_event FOREIGN KEY (event_id) REFERENCES event(event_id),
    CONSTRAINT fk_event_participant_person FOREIGN KEY (person_id) REFERENCES person(person_id)
);

COMMENT ON TABLE event_participant 'Maps persons to event participation';

CREATE INDEX idx_event_participant_person_id ON event_participant(person_id);

-- 62. organization_member
CREATE TABLE organization_member (
    organization_id VARCHAR(15) NOT NULL,
    entity_type TEXT DEFAULT NULL,
    entity_id TEXT DEFAULT NULL,
    membership_role TEXT NOT NULL DEFAULT 'member',
    join_date DATE DEFAULT NULL,
    PRIMARY KEY (organization_id, entity_type, entity_id),
    CONSTRAINT fk_organization_member_organization FOREIGN KEY (organization_id) REFERENCES organization(organization_id)
);

COMMENT ON TABLE organization_member 'Maps entities to organization membership';

CREATE INDEX idx_organization_member_entity ON organization_member(entity_type, entity_id);

-- 63. entity_tag
CREATE TABLE entity_tag (
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    tag_id VARCHAR(15) NOT NULL,
    PRIMARY KEY (entity_type, entity_id, tag_id),
    CONSTRAINT fk_entity_tag_tag FOREIGN KEY (tag_id) REFERENCES tag(tag_id)
);

COMMENT ON TABLE entity_tag 'Polymorphic tags for any entity type';

CREATE INDEX idx_entity_tag_tag_id ON entity_tag(tag_id);

-- 64. entity_source
CREATE TABLE entity_source (
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    source_id VARCHAR(15) NOT NULL,
    PRIMARY KEY (entity_type, entity_id, source_id),
    CONSTRAINT fk_entity_source_source FOREIGN KEY (source_id) REFERENCES source(source_id)
);

COMMENT ON TABLE entity_source 'Maps verification sources to entities';

CREATE INDEX idx_entity_source_source_id ON entity_source(source_id);

-- 65. role_permission
CREATE TABLE role_permission (
    role_id VARCHAR(15) NOT NULL,
    permission_id VARCHAR(15) NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permission_role FOREIGN KEY (role_id) REFERENCES role(role_id),
    CONSTRAINT fk_role_permission_permission FOREIGN KEY (permission_id) REFERENCES permission(permission_id)
);

COMMENT ON TABLE role_permission 'Maps roles to granted permissions';

CREATE INDEX idx_role_permission_permission_id ON role_permission(permission_id);
