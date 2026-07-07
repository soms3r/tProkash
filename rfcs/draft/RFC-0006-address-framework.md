---
title: Address Framework
status: Draft
number: RFC-0006
version: 0.1
authors:
  - tbd
created: 2026-07-06
---

# RFC-0006: Address Framework

## 1. Vision

An **Address** inside tProkash is a structured, validated, and
privacy-aware representation of a physical or virtual location. Every
entity in the platform — Organization, Publisher, Author, Printer,
Distributor, Bookstore, Library, Warehouse, Event, User, Government
Agency, Educational Institution — references addresses rather than
embedding location fields.

The Address Framework is the single source of truth for all location
data. It ensures that every address in the system is:

- Internationally compatible (every country, every format)
- Validated against authoritative data where possible
- Privacy-controlled (public/private/internal per address)
- Historically preserved (never overwritten, never deleted)
- Searchable and geocodable

This framework must support every country in the world and be designed
for decades of reuse across every current and future domain module.

## 2. Goals

- Define a universal Address model that works for every country,
  territory, and administrative convention.
- Provide a structured geographic hierarchy that accommodates all
  international address formats without forcing a single template.
- Support multiple address types (HQ, billing, shipping, warehouse,
  registered office, branch, home, event, temporary, mailing, etc.)
  that any domain entity can reference.
- Enable privacy controls per address: public (country/city only),
  private (full address), internal (system-wide, never exposed).
- Support coordinates (latitude, longitude) and timezone metadata.
- Define address validation as a tiered system: format validation,
  existence validation, and verification.
- Preserve address history immutably — previous addresses are never
  overwritten or deleted.
- Define an address lifecycle (active → inactive → archived) with
  audit trail.
- Follow ISO standards (ISO 3166 for country codes, ISO 6709 for
  coordinates) where applicable.
- Support localized address rendering for any language and script.

## 3. Non-Goals

- Implement database schema, migrations, or repositories.
- Define REST endpoints or GraphQL resolvers.
- Create validation libraries, UI components, or geocoding services.
- Integrate with third-party address verification APIs (designed to
  accommodate them, not implement them).
- Implement address autocomplete or typeahead services.
- Define routing or navigation logic based on addresses.
- Store map tile data or render maps.
- Implement address normalization or transliteration engines.
- Define a full address verification service (verification framework
  will handle this).
- Support real-time location tracking or GPS monitoring.

## 4. Address Model

The Address model is designed to accommodate every known address format
in the world. It uses a flexible, hierarchical structure that does not
force every field to be populated.

### Core Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Internal system identifier. |
| `type` | AddressType | The kind of address (see Section 5). |
| `label` | String? | Human-readable label (e.g., "Head Office", "Warehouse B"). |
| `primary` | Boolean | Whether this is the primary address for the owning entity. |
| `timezone` | String? | IANA timezone identifier (e.g., "Asia/Dhaka"). |
| `coordinates` | Coordinates? | Latitude and longitude (see Section 9). |
| `language` | String? | BCP-47 language tag for this address record. |
| `status` | AddressStatus | Active, inactive, archived (see Section 17). |
| `audit` | AuditMetadata | Creation and modification audit trail. |

### Geographic Fields

| Field | Type | Description |
|-------|------|-------------|
| `country` | String | ISO 3166-1 alpha-2 country code. **Required.** |
| `state` | String? | State, province, region, emirate, or division. |
| `district` | String? | District, county, or parish. |
| `city` | String? | City, town, village, or municipality. |
| `postalCode` | String? | Postal code, ZIP code, or postcode. |
| `locality` | String? | Locality, suburb, or neighbourhood. |
| `street` | String? | Street name, street number, building name. |
| `street2` | String? | Additional street line (apartment, suite, unit). |
| `building` | String? | Building name or number. |
| `unit` | String? | Unit, apartment, suite, floor, or room. |
| `postOfficeBox` | String? | PO Box or private bag. |

### Flexibility Principles

- Only `country` is required. All other geographic fields are optional.
- The model does not assume a fixed hierarchy. Different countries use
  different subsets of fields.
- Fields are stored in their original script. No transliteration is
  assumed.
- A separate `localized` block (see Section 11) stores translations and
  alternative renderings.

### Raw Address

For addresses that cannot be decomposed into structured fields:

| Field | Type | Description |
|-------|------|-------------|
| `raw` | String? | The full address as a single unstructured string. |
| `rawFormat` | String? | The format or source of the raw address (e.g., "freeform", "OCR", "import"). |

A raw address may be provided alongside or instead of structured fields.
The system stores both when available.

## 5. Address Types

| Type | Description |
|------|-------------|
| **Head Office** | Primary registered or executive office. |
| **Registered Office** | Legal address of record for official correspondence. |
| **Billing** | Address for invoices and billing correspondence. |
| **Shipping** | Address for physical shipments and deliveries. |
| **Warehouse** | Physical warehouse or distribution centre. |
| **Branch** | Geographic branch or regional office. |
| **Home** | Residential address (for individuals). |
| **Event** | Temporary address for an event, book fair, or conference. |
| **Temporary** | Short-term or seasonal address. |
| **Mailing** | Address for postal correspondence (may differ from registered office). |
| **Work** | Workplace address (for individuals). |
| **Virtual** | Virtual office or co-working space. |
| **Legal** | Address for legal service of process. |
| **Venue** | Venue address for events, launches, or signings. |
| **Studio** | Studio or creative workspace. |
| **Other** | Any type not covered by the above list. |

Address types are represented as an extensible string union. An entity
may have multiple addresses of the same type (e.g., multiple warehouses).
Exactly one address may be primary per entity.

## 6. Geographic Hierarchy

The Address model supports a flexible geographic hierarchy that
accommodates every country's administrative divisions. The hierarchy is
not strictly enforced — different countries skip different levels.

### Standard Levels

```
Country (ISO 3166-1 alpha-2)
    └── State / Province / Region / Emirate / Prefecture / Department
            └── District / County / Parish / Commune
                    └── City / Town / Village / Municipality
                            └── Postal Code / ZIP / Postcode
                                    └── Locality / Suburb / Neighbourhood
                                            └── Street
                                                    └── Building
                                                            └── Unit
```

### Country-specific Variations

| Country/Region | Levels Used |
|----------------|-------------|
| United States | Country → State → County → City → ZIP → Street → Building → Unit |
| United Kingdom | Country → County → District → City → Postcode → Street → Building |
| Bangladesh | Country → Division → District → Sub-district → City → Postal Code → Street → Building |
| Japan | Country → Prefecture → City → Ward → District → Building |
| UAE | Country → Emirate → City → Street → Building |
| Most of Europe | Country → Region → Department → City → Postal Code → Street → Building |

### Design Principle

The model stores all levels as independent fields. No level is required
except country. The rendering layer (not this RFC) determines how to
concatenate fields based on the country's convention.

## 7. International Address Compatibility

Every country has its own address conventions. The framework accommodates
this through:

### Principles

- **No single template** — The model does not force every address into a
  Western-style street/city/state/ZIP format.
- **Required fields are minimal** — Only `country` is required. All
  other fields are optional.
- **Script preservation** — Addresses are stored in their original
  script. No transliteration is assumed or required.
- **PO Box support** — Post office boxes and private bags are a
  first-class field (`postOfficeBox`), not forced into the street field.
- **Raw fallback** — When decomposition is impossible or unreliable, the
  raw address string is preserved.

### Country-specific Formats

The following formats must be renderable from the model:

- **Western** (US, UK, Europe): Street + City + State + Postal Code
- **East Asian** (Japan, China, Korea): Large → small (Prefecture →
  City → Ward → District → Building)
- **Middle Eastern** (UAE, Saudi Arabia): PO Box + City + Country
- **South Asian** (Bangladesh, India): Area/Locality + Street + City +
  Postal Code
- **Latin American**: Street + Number + Neighborhood + City + State +
  Postal Code

## 8. ISO Standards

| Standard | Usage |
|----------|-------|
| **ISO 3166-1 alpha-2** | Country codes (e.g., "BD", "US", "JP"). Two-letter codes are the canonical identifier. |
| **ISO 3166-2** | Subdivision codes (e.g., "US-CA", "BD-3"). Optional, stored alongside the subdivision name. |
| **ISO 6709** | Coordinate representation (latitude, longitude). |
| **ISO 8601** | Date and time format for audit metadata and effective dates. |
| **BCP-47** | Language tags for localized address records (e.g., "bn-BD", "ja-JP"). |
| **IANA Timezone Database** | Timezone identifiers (e.g., "Asia/Dhaka", "America/New_York"). |
| **UN/LOCODE** | United Nations location codes for ports, airports, and logistics hubs (optional, future). |

Country codes must always be stored in ISO 3166-1 alpha-2 format. Other
standards are used where applicable but not required for basic operation.

## 9. Coordinate Support

Coordinates enable geocoding, mapping, geo-search, and location-based
features.

### Coordinate Model

```jsonc
{
  "latitude": 23.8103,
  "longitude": 90.4125,
  "altitude": 4.0,
  "accuracy": "ROOFTOP",       // ROOFTOP, RANGE, APPROXIMATE, CENTROID
  "source": "GOOGLE",          // The geocoding provider or method
  "lastGeocoded": "2026-01-15T10:30:00Z"
}
```

| Field | Description |
|-------|-------------|
| `latitude` | Latitude in decimal degrees (WGS84). |
| `longitude` | Longitude in decimal degrees (WGS84). |
| `altitude` | Altitude in metres above sea level (optional). |
| `accuracy` | The accuracy level of the coordinates. |
| `source` | The provider or method that supplied the coordinates. |
| `lastGeocoded` | When the coordinates were last obtained or refreshed. |

### Principles

- Coordinates are optional. Many addresses will not have them.
- Coordinates are derived from the structured address fields, not
  entered manually.
- Geocoding is an async, non-blocking operation. Addresses are stored
  first; coordinates are populated later.
- The geocoding provider is abstracted. The model can accommodate any
  provider (Google, Nominatim, ArcGIS, etc.).
- Coordinates are re-geocodable when the address is updated.

## 10. Time Zone Considerations

Each address may have an associated timezone. This is essential for
events, deadlines, and operational schedules.

- Timezone is stored as an IANA timezone identifier (e.g.,
  "Asia/Dhaka", "America/New_York", "Europe/London").
- Timezone may be derived from country and coordinates, or explicitly
  set.
- When an address covers a large area with multiple timezones (e.g., a
  distributor covering all of the US), the timezone of the primary
  location is used.
- Entities may override the address-level timezone with their own
  timezone preference.

## 11. Language and Localized Address Rendering

Addresses are stored in their original script. For multi-lingual
operation, addresses may have localized representations.

### Localization Block

```jsonc
{
  "localized": {
    "bn-BD": {
      "country": "বাংলাদেশ",
      "state": "ঢাকা বিভাগ",
      "city": "ঢাকা",
      "street": "গুলশান এভিনিউ, ১২৩",
      "postalCode": "১২১২"
    },
    "en-US": {
      "country": "Bangladesh",
      "state": "Dhaka Division",
      "city": "Dhaka",
      "street": "123 Gulshan Avenue",
      "postalCode": "1212"
    }
  }
}
```

### Principles

- The primary address fields store the original script.
- The `localized` block stores translations for any number of languages.
- Localization is optional. Most addresses will only have the original.
- When rendering an address, the system checks for a localized version
  in the user's preferred language. If none exists, the original is
  used.
- Transliteration (e.g., Arabic → Latin) may be derived by a future
  service but is not required by the framework.

## 12. Address Validation Strategy

Address validation operates at three tiers:

### Tier 1: Format Validation

Performed at input time. Checks:

- Country code is a valid ISO 3166-1 alpha-2 code.
- Postal code matches the country's format (where known).
- Required fields for the selected country are present.
- Field lengths do not exceed maximums.
- No obviously invalid characters or patterns.

Format validation is synchronous and always performed.

### Tier 2: Existence Validation

Checks whether the address corresponds to a real location. Methods:

- Postal code lookup against authoritative databases.
- Street name and number verification via external APIs.
- Coordinate-based reverse geocode confirmation.

Existence validation is asynchronous and may be deferred. Results are
stored as validation metadata on the address record.

### Tier 3: Verification

Confirms that the address is actually associated with the owning entity.
Methods:

- Postcard or letter mail with a verification code.
- Physical visit confirmation.
- Document submission (utility bill, lease agreement).

Verification is part of the Verification Framework (future RFC).
Address verification status is tracked independently of entity
verification status.

### Validation Metadata

```jsonc
{
  "formatValidated": true,
  "formatValidatedAt": "2026-01-15T10:30:00Z",
  "existenceValidated": true,
  "existenceValidationMethod": "POSTAL_CODE_LOOKUP",
  "existenceValidatedAt": "2026-01-15T10:35:00Z",
  "verificationStatus": "VERIFIED",
  "verificationMethod": "POSTCARD",
  "verifiedAt": "2026-01-20T14:00:00Z"
}
```

## 13. Verification Model

Address verification is a sub-domain of the larger Verification
Framework (future RFC). This section defines address-specific
verification requirements.

### Verification Methods

| Method | Description |
|--------|-------------|
| **POSTCARD** | Physical postcard with verification code sent to address. |
| **LETTER** | Official letter with verification instructions. |
| **DOCUMENT** | Utility bill, lease, or bank statement showing address. |
| **GEOLOCATION** | GPS-based confirmation from a mobile device at the location. |
| **VISIT** | Physical visit by an authorised representative. |
| **EXTERNAL_API** | Verification via a third-party address verification service. |
| **EXISTING_RELATIONSHIP** | Address confirmed through an existing verified relationship. |

### Verification States

| State | Description |
|-------|-------------|
| **UNVERIFIED** | No verification has been attempted. |
| **PENDING** | Verification is in progress. |
| **VERIFIED** | Address has been successfully verified. |
| **EXPIRED** | Previous verification has expired and must be renewed. |
| **FAILED** | Verification attempt failed. |
| **REVOKED** | Previous verification has been revoked. |

### Principles

- Address verification is independent of entity verification. A
  VERIFIED organization may have UNVERIFIED addresses.
- Verification history is immutable and append-only.
- Verification may expire (e.g., proof of residence older than 12
  months).

## 14. Privacy Levels

Every address has a privacy level that controls who can see which parts
of the address.

| Level | Visibility | Example |
|-------|------------|---------|
| **PUBLIC** | Country and city visible to all actors. Full address visible to entity owner and Administrators. | "Dhaka, Bangladesh" in public profile. Full address stored. |
| **PRIVATE** | Only the country visible to unauthenticated actors. Full address visible to entity owner and Administrators. | "Bangladesh" in public profile. City and street hidden. |
| **INTERNAL** | Nothing visible publicly or to the entity owner. Full address visible only to Administrators and authorised internal systems. | Used for addresses that must exist in the system but must never be exposed (e.g., safe houses, protected persons). |

### Default Levels by Address Type

| Type | Default Privacy |
|------|----------------|
| Head Office | PUBLIC |
| Registered Office | PUBLIC |
| Billing | PRIVATE |
| Shipping | PRIVATE |
| Warehouse | PUBLIC (country/city only) |
| Branch | PUBLIC |
| Home | PRIVATE |
| Event | PUBLIC (during event), PRIVATE (after) |
| Temporary | PRIVATE |
| Mailing | PUBLIC |
| Legal | PRIVATE |
| Virtual | PUBLIC (country/city only) |

Defaults are configurable per entity type and per deployment.

## 15. Multiple Addresses per Entity

Every entity may have multiple addresses of different types.

### Rules

- An entity may have 0..N addresses in total.
- An entity may have 0..N addresses of any given type (e.g., multiple
  warehouses).
- Exactly one address may be designated **primary** per entity. The
  primary address is the default for unspecified operations.
- Each address type may optionally have a primary (e.g., primary billing
  address, primary shipping address).
- When an entity is created, at least one address is recommended but not
  required.

### Example

```
Publisher: Penguin Random House
    ├── Head Office (PRIMARY) — 1745 Broadway, New York, US (PUBLIC)
    ├── Registered Office — 1745 Broadway, New York, US (PUBLIC)
    ├── Warehouse 1 — Edison, NJ, US (PRIVATE)
    ├── Warehouse 2 — Reno, NV, US (PRIVATE)
    ├── Billing — same as Head Office (PRIVATE)
    └── Branch: PRH Canada — Toronto, ON, CA (PUBLIC)
```

## 16. Historical Addresses

Address history is immutable and append-only.

### Principles

- When an address is updated, the previous version is preserved as a
  historical record.
- Historical addresses are linked to the current address via a
  `supersededBy` / `supersedes` relationship.
- An address may have 0..N historical versions in a chain.
- Historical addresses carry the effective date range (from, until) and
  an audit entry.
- Addresses are never physically deleted. A `DELETED` lifecycle state is
  used instead (see Section 17).
- Historical addresses are accessible to Administrators and the entity
  owner only.

### Example Chain

```
Address V1: 123 Old Street, New York (2020-01-01 → 2023-06-30)
    superseded by
Address V2: 456 New Avenue, New York (2023-07-01 → present)
```

## 17. Address Lifecycle

Addresses have their own lifecycle, independent of the entity they
belong to.

### States

```
ACTIVE → INACTIVE → ARCHIVED
                └──→ DELETED (from INACTIVE only)
```

| State | Description |
|-------|-------------|
| **ACTIVE** | The address is currently in use by the entity. |
| **INACTIVE** | The address is no longer actively used but is retained for historical reference. |
| **ARCHIVED** | The address is archived for long-term retention. Not visible in active queries. |
| **DELETED** | The address is logically deleted. Retained for audit purposes only. Accessible only to Administrators. |

### Transitions

- ACTIVE → INACTIVE: Triggered when the entity stops using the address.
- INACTIVE → ACTIVE: Reactivation is allowed.
- INACTIVE → ARCHIVED: Automatic after a configurable period.
- INACTIVE → DELETED: Manual, Administrator-only.

### Rules

- An entity must always have at least one ACTIVE address if it requires
  an address of a specific type.
- The primary address cannot be transitioned to INACTIVE without
  designating a new primary.
- Lifecycle transitions are audited.

## 18. Relationships

An Address is referenced by domain entities but does not own them.

```
Address
    ├── 0..N  Organizations      — address of organization
    ├── 0..N  Publishers          — address of publisher
    ├── 0..N  Authors             — address of author
    ├── 0..N  Printers            — address of printer
    ├── 0..N  Distributors        — address of distributor
    ├── 0..N  Bookstores          — address of bookstore
    ├── 0..N  Libraries           — address of library
    ├── 0..N  Warehouses          — address of warehouse
    ├── 0..N  Events              — event venue address
    ├── 0..N  Users               — residential or work address
    ├── 0..N  Government Agencies — address of agency
    └── 0..N  Educational Insts   — address of institution
```

Each relationship records:

- The entity type and ID.
- The address type (HQ, billing, shipping, etc.).
- Whether it is the primary address for that entity.
- Effective date range.
- Audit metadata.

### Design Principle

Address is a value object with identity. It can be shared across
entities (e.g., multiple departments at the same HQ address) or
exclusively owned by a single entity. The relationship model supports
both.

## 19. Search Requirements

Address search must support:

### Structured Search

- **Filter by country** (one or more ISO 3166-1 alpha-2 codes).
- **Filter by state/province/region.**
- **Filter by city.**
- **Filter by postal code** or postal code prefix.
- **Filter by address type** (HQ, billing, shipping, etc.).
- **Filter by privacy level** (public, private, internal).
- **Filter by verification status.**
- **Filter by lifecycle status** (active, inactive, archived).
- **Filter by timezone.**
- **Filter by entity type** (find all addresses for a publisher, etc.).

### Geo-search (Future)

- **Proximity search** — Find addresses within a given radius of a
  coordinate.
- **Bounding box search** — Find addresses within a geographic
  rectangle.
- **Polygon search** — Find addresses within an arbitrary geographic
  boundary.

### Full-text Search

- Search across all address fields including the raw address string.
- Autocomplete on city, state, country, and postal code.

### Limitations

- Private and internal addresses are excluded from public search
  results.
- Only the public portion of an address (country, city) is returned in
  public search results.

## 20. Import/Export Requirements

### Import

- **Format**: JSON, CSV, XML.
- **Fields**: All address fields (structured and raw).
- **Validation**: Every address is validated (Tier 1 format validation)
  during import. Invalid addresses are reported, not silently skipped.
- **Duplicate detection**: Matched on a combination of entity + address
  type + geographic fields. Duplicates are flagged.
- **Geocoding**: Not performed during import. Coordinates are populated
  asynchronously after import.
- **Privacy**: Imported addresses inherit the default privacy level for
  their type unless explicitly set.
- **Audit**: Every import batch creates an audit record.

### Export

- **Format**: JSON, CSV, XML.
- **Scope**:
  - Public export — Country and city only.
  - Full export — All address fields. Restricted to Administrators and
    the entity owner.
- **Filtering**: Same filters as Search.
- **Privacy**: Export respects privacy levels. Private and internal
  address fields are omitted from public exports.

## 21. API Resource Shapes

The following shapes describe the Address resource as it would appear
in API responses and requests. Actual endpoints are deferred to
implementation RFCs.

### Address

```jsonc
{
  "id": "uuid",
  "type": "AddressType",
  "label": "string?",
  "primary": "boolean",
  "country": "string",
  "state": "string?",
  "district": "string?",
  "city": "string?",
  "postalCode": "string?",
  "locality": "string?",
  "street": "string?",
  "street2": "string?",
  "building": "string?",
  "unit": "string?",
  "postOfficeBox": "string?",
  "raw": "string?",
  "timezone": "string?",
  "coordinates": {
    "latitude": "number",
    "longitude": "number",
    "accuracy": "string?"
  },
  "localized": {
    "bn-BD": { ... },
    "en-US": { ... }
  },
  "privacy": "PUBLIC | PRIVATE | INTERNAL",
  "status": "ACTIVE | INACTIVE | ARCHIVED | DELETED",
  "verification": {
    "status": "UNVERIFIED | PENDING | VERIFIED | EXPIRED | FAILED | REVOKED",
    "method": "POSTCARD | LETTER | DOCUMENT | GEOLOCATION | VISIT | EXTERNAL_API",
    "verifiedAt": "datetime?"
  },
  "validation": {
    "formatValidated": "boolean",
    "existenceValidated": "boolean"
  },
  "lifecycle": "WorkflowStatus",
  "audit": "AuditMetadata"
}
```

### AddressSummary

```jsonc
{
  "id": "uuid",
  "type": "AddressType",
  "label": "string?",
  "primary": "boolean",
  "country": "string",
  "state": "string?",
  "city": "string?",
  "privacy": "PUBLIC | PRIVATE | INTERNAL",
  "status": "ACTIVE | INACTIVE | ARCHIVED"
}
```

### AddressInput (create/update)

```jsonc
{
  "type": "AddressType",
  "label": "string?",
  "primary": "boolean?",
  "country": "string",
  "state": "string?",
  "district": "string?",
  "city": "string?",
  "postalCode": "string?",
  "locality": "string?",
  "street": "string?",
  "street2": "string?",
  "building": "string?",
  "unit": "string?",
  "postOfficeBox": "string?",
  "raw": "string?",
  "timezone": "string?",
  "coordinates": {
    "latitude": "number",
    "longitude": "number"
  },
  "localized": {
    "...": { ... }
  },
  "privacy": "PUBLIC | PRIVATE | INTERNAL?"
}
```

## 22. Permissions

| Action | Visitor | Entity Owner | Verifier | Administrator |
|--------|---------|--------------|----------|---------------|
| View public portion of address (country/city) | ✅ | ✅ | ✅ | ✅ |
| View full address (if PUBLIC) | ❌ | ✅ | ✅ | ✅ |
| View full address (if PRIVATE) | ❌ | ✅ | ✅ | ✅ |
| View full address (if INTERNAL) | ❌ | ❌ | ❌ | ✅ |
| View address history | ❌ | ✅ (own) | ✅ | ✅ |
| Add address | ❌ | ✅ (own) | ✅ | ✅ |
| Update own address | ❌ | ✅ | ❌ | ❌ |
| Update any address | ❌ | ❌ | ✅ | ✅ |
| Verify address | ❌ | ❌ | ✅ | ✅ |
| Import addresses | ❌ | ❌ | ❌ | ✅ |
| Export addresses (public) | ✅ | ✅ | ✅ | ✅ |
| Export addresses (full) | ❌ | ✅ (own) | ✅ | ✅ |
| Archive/delete address | ❌ | ❌ | ❌ | ✅ |
| Geocode address | ❌ | ✅ (own) | ✅ | ✅ |

## 23. Security Considerations

- **Privacy enforcement** — The privacy level is enforced at the data
  access layer, not the application layer. Private and INTERNAL address
  fields are never returned by public APIs regardless of how they are
  queried.
- **Geocoding privacy** — Coordinates derived from a PRIVATE or INTERNAL
  address inherit the same privacy level. They must not be exposed in
  public geo-search results.
- **Data minimisation** — Address fields are collected only when
  necessary for the entity's operational requirements.
- **Verification evidence** — Address verification documents are stored
  as encrypted evidence, not as address fields.
- **Export control** — Full address exports are logged and monitored.
  Bulk export of private addresses triggers an alert.
- **Rate limiting** — Address mutation endpoints are rate-limited to
  prevent bulk harvesting.
- **Validation abuse** — Existence validation APIs are rate-limited to
  prevent address database scraping.
- **Historical data** — Historical addresses are immutable. They cannot
  be modified or deleted by any actor.
- **Cross-entity sharing** — When an address is shared across entities,
  updates by one entity must not silently affect another entity's view
  of the address. Address records are immutable after creation; changes
  create new versions.

## 24. Future Extensions

### Address Autocomplete

A typeahead service that suggests addresses as the user types, powered
by the platform's address database and external providers.

### Address Normalization Service

A service that normalizes and standardizes address fields to a canonical
form, correcting common errors and inconsistencies.

### Address Verification Service

A dedicated service implementing Tier 2 and Tier 3 validation with
support for multiple external providers (Google, Loqate, UPS, etc.).

### Map Integration

A mapping service that displays address locations on interactive maps,
with privacy-aware rendering (country/city markers for public views,
precise markers for authorized views).

### Route Optimization

A service that optimizes multi-stop routes for shipping and distribution,
using address coordinates and timezone data.

### Address Health Monitoring

A scheduled service that periodically checks address validity:
re-geocoding, postal code validation, and verification expiration
tracking.

### Smart Address Splitting

A service that uses machine learning to decompose raw address strings
into structured fields for countries with complex or poorly documented
address formats.

## 25. Open Questions

1. Should addresses be globally unique (deduplicated) or per-entity?
   If deduplicated, how are privacy conflicts resolved when two entities
   share the same address but one marks it PUBLIC and the other marks it
   PRIVATE?

2. How are address format validation rules maintained for every country?
   Should this be a configuration file, a database table, or an external
   service?

3. Should the address model support military/diplomatic addresses
   (APO, FPO, DPO) as a special case or as part of the standard model?

4. What is the maximum field length for each geographic field across
   all countries? (Some countries have very long city or street names.)

5. Should coordinates support multiple coordinate reference systems
   (CRS) or is WGS84 sufficient?

6. How should seasonal or temporary addresses be handled? Should they
   have an automatic expiry that triggers a lifecycle transition?

7. Should the address model support "care of" (c/o) addresses?

8. What is the retention period for DELETED addresses before permanent
   purging?

9. Should address localization be user-contributed or system-generated?

10. How are address relationships maintained when an entity is deleted?
    Should the addresses be orphaned, reassigned, or deleted?

## 26. Acceptance Criteria

- [ ] Address **Vision**, **Goals**, and **Non-Goals** are documented
      and reviewed.
- [ ] The **Address Model** defines core fields (id, type, label,
      primary, timezone, coordinates, language, status, audit) and
      geographic fields (country through unit) with the flexibility
      principle: only country is required.
- [ ] All **Address Types** (16 types) are listed and described as an
      extensible string union.
- [ ] **Geographic Hierarchy** documents Country → State → District →
      City → Postal Code → Locality → Street → Building → Unit with
      country-specific variations.
- [ ] **International Address Compatibility** documents no single
      template, minimal required fields, script preservation, PO Box
      support, raw fallback, and renderable format examples (Western,
      East Asian, Middle Eastern, South Asian, Latin American).
- [ ] **ISO Standards** lists ISO 3166-1 alpha-2, ISO 3166-2, ISO 6709,
      ISO 8601, BCP-47, IANA Timezone Database, and UN/LOCODE with
      usage descriptions.
- [ ] **Coordinate Support** defines latitude, longitude, altitude,
      accuracy (ROOFTOP, RANGE, APPROXIMATE, CENTROID), source, and
      lastGeocoded, with principles for async geocoding.
- [ ] **Time Zone Considerations** documents IANA timezone identifiers
      and derivation strategies.
- [ ] **Language and Localized Rendering** defines the `localized` block
      with per-language address components, script preservation, and
      fallback rendering.
- [ ] **Address Validation Strategy** defines three tiers: Format
      Validation (synchronous), Existence Validation (asynchronous),
      and Verification (Verification Framework), with validation
      metadata schema.
- [ ] **Verification Model** defines 7 verification methods (POSTCARD,
      LETTER, DOCUMENT, GEOLOCATION, VISIT, EXTERNAL_API,
      EXISTING_RELATIONSHIP) and 6 verification states (UNVERIFIED,
      PENDING, VERIFIED, EXPIRED, FAILED, REVOKED) with independence
      from entity verification.
- [ ] **Privacy Levels** defines PUBLIC, PRIVATE, and INTERNAL with
      visibility rules and default levels by address type.
- [ ] **Multiple Addresses per Entity** documents 0..N addresses, 0..N
      per type, exactly one primary, and optional type-specific
      primaries.
- [ ] **Historical Addresses** documents immutable append-only history,
      supersededBy/supersedes chain, effective date ranges, and no
      physical deletion.
- [ ] **Address Lifecycle** defines ACTIVE, INACTIVE, ARCHIVED, and
      DELETED states with transition rules.
- [ ] **Relationships** lists all entity types that reference addresses
      with cardinality and relationship metadata.
- [ ] **Search Requirements** documents structured search, geo-search
      (future), full-text search, and privacy limitations.
- [ ] **Import/Export Requirements** document format, validation,
      duplicate detection, geocoding, and privacy enforcement.
- [ ] **API Resource Shapes** define Address (full), AddressSummary,
      and AddressInput with all documented fields.
- [ ] **Permissions** are defined for all 4 actor classes across 14
      actions.
- [ ] **Security Considerations** address privacy enforcement,
      geocoding privacy, data minimisation, verification evidence,
      export control, rate limiting, validation abuse, historical
      immutability, and cross-entity sharing.
- [ ] **Future Extensions** (Address Autocomplete, Normalization,
      Verification Service, Map Integration, Route Optimization, Health
      Monitoring, Smart Splitting) are identified.
- [ ] **Open Questions** are documented (10 questions) and awaiting
      resolution.
