# Publisher Fields

**Version:** 1.0.0\
**Status:** Approved

---

## Purpose

Complete field specification for the Publisher entity. Every field is documented with its type, classification, constraints, and description.

## Field Table

| # | Field | Type | Class | Constraints | Description |
|---|---|---|---|---|---|
| 1 | publisher_id | VARCHAR(15) | REQUIRED | PK, pattern `^PUB-[A-Z0-9]{10}$` | Unique internal identifier |
| 2 | legal_name_bn | TEXT | REQUIRED | NOT NULL | Full legal name in Bengali |
| 3 | legal_name_en | TEXT | REQUIRED | NOT NULL | Full legal name in English (or transliteration) |
| 4 | display_name | VARCHAR(255) | REQUIRED | NOT NULL | Preferred display name (may match trade name) |
| 5 | trade_name_bn | TEXT | RECOMMENDED | | Business/trade name in Bengali, if different from legal name |
| 6 | trade_name_en | TEXT | RECOMMENDED | | Business/trade name in English, if different from legal name |
| 7 | slug | VARCHAR(255) | RECOMMENDED | UNIQUE, pattern `^[a-z0-9-]+$` | URL-safe identifier generated from display_name |
| 8 | registration_number | VARCHAR(100) | OPTIONAL | | Government registration or trade license number |
| 9 | bin | VARCHAR(20) | OPTIONAL | | Business Identification Number (Bangladesh) |
| 10 | tin | VARCHAR(20) | OPTIONAL | | Tax Identification Number |
| 11 | isbn_prefix | VARCHAR(20) | OPTIONAL | | Publisher prefix assigned by ISBN agency |
| 12 | website_url | TEXT | RECOMMENDED | format URI | Official website URL |
| 13 | founded_year | INTEGER | RECOMMENDED | minimum 1800, maximum 2100 | Year the publisher was founded |
| 14 | status | VARCHAR(50) | RECOMMENDED | DEFAULT 'active' | Operational status |
| 15 | description_bn | TEXT | RECOMMENDED | | Description of the publisher in Bengali |
| 16 | description_en | TEXT | RECOMMENDED | | Description of the publisher in English |
| 17 | logo_url | TEXT | RECOMMENDED | format URI | URL to publisher logo image |
| 18 | services | TEXT | RECOMMENDED | | Comma-separated list of offered services |
| 19 | verification_status | VARCHAR(50) | REQUIRED | NOT NULL, DEFAULT 'draft' | Current verification state |
| 20 | confidence_score | INTEGER | RECOMMENDED | 0-100 | Confidence in data accuracy |
| 21 | source_ids | TEXT | RECOMMENDED | | Reference IDs of data sources |
| 22 | parent_organization_id | VARCHAR(15) | OPTIONAL | FK to organization | Parent organization if publisher is a subsidiary |
| 23 | primary_contact | VARCHAR(255) | RECOMMENDED | | Primary contact person name |
| 24 | primary_email | VARCHAR(254) | RECOMMENDED | format email | Primary contact email |
| 25 | primary_phone | VARCHAR(50) | RECOMMENDED | | Primary contact phone number |
| 26 | address_line_1 | TEXT | OPTIONAL | | Street address line 1 |
| 27 | address_line_2 | TEXT | OPTIONAL | | Street address line 2 |
| 28 | address_city | VARCHAR(255) | RECOMMENDED | | City name |
| 29 | address_postal_code | VARCHAR(20) | OPTIONAL | | Postal code |
| 30 | address_country | VARCHAR(3) | RECOMMENDED | ISO 3166-1 alpha-2 | Country code (default: BD) |
| 31 | latitude | NUMERIC(10,7) | OPTIONAL | | Geographic latitude |
| 32 | longitude | NUMERIC(10,7) | OPTIONAL | | Geographic longitude |
| 33 | social_media_links | TEXT | OPTIONAL | | JSON object of platform URLs |
| 34 | alternate_names | TEXT | OPTIONAL | | JSON array of alternative names |
| 35 | notes | TEXT | OPTIONAL | | Internal notes (not for public display) |
| 36 | created_at | TIMESTAMP | SYSTEM | NOT NULL, DEFAULT NOW | Record creation timestamp |
| 37 | updated_at | TIMESTAMP | SYSTEM | NOT NULL, DEFAULT NOW | Record last update timestamp |
| 38 | deleted_at | TIMESTAMP | SYSTEM | NULL = active | Soft delete timestamp |

## Classification Summary

| Class | Count | Fields |
|---|---|---|
| REQUIRED | 7 | publisher_id, legal_name_bn, legal_name_en, display_name, verification_status, created_at, updated_at |
| RECOMMENDED | 17 | slug, trade_name_bn, trade_name_en, website_url, founded_year, status, description_bn, description_en, logo_url, services, confidence_score, source_ids, primary_contact, primary_email, primary_phone, address_city, address_country |
| OPTIONAL | 11 | registration_number, bin, tin, isbn_prefix, parent_organization_id, address_line_1, address_line_2, address_postal_code, latitude, longitude, social_media_links, alternate_names, notes |
| SYSTEM | 3 | created_at, updated_at, deleted_at |
