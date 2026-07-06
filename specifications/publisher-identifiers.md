# Publisher Identifiers

**Version:** 1.0.0\
**Status:** Approved

---

## Purpose

Define all identifier types associated with a Publisher. Multiple identifier systems coexist to support different business contexts.

## Identifier Types

### 1. Internal ID (publisher_id)

| Property | Value |
|---|---|
| Format | `PUB-XXXXXXXXXX` |
| Pattern | `^PUB-[A-Z0-9]{10}$` |
| Uniqueness | Globally unique |
| Assigner | System |
| Mutability | Never changes |
| Purpose | Primary key in the tProkash database |

### 2. Trade Name

| Property | Value |
|---|---|
| Field | trade_name_bn, trade_name_en |
| Uniqueness | Should be unique (fuzzy check) |
| Source | Publisher's official business name |
| Purpose | The name under which the publisher operates commercially |

### 3. Legal Name

| Property | Value |
|---|---|
| Field | legal_name_bn, legal_name_en |
| Uniqueness | Must be unique (exact match check) |
| Source | Government registration / trade license |
| Purpose | The legally registered name of the entity |

### 4. Display Name

| Property | Value |
|---|---|
| Field | display_name |
| Uniqueness | Should be unique |
| Source | Derived from trade or legal name |
| Purpose | Human-readable label shown in UI and exports |

### 5. Registration Number

| Property | Value |
|---|---|
| Field | registration_number |
| Format | Varies by issuing authority |
| Source | Government trade license or business registry |
| Purpose | Official business registration ID |

### 6. BIN (Business Identification Number) — Optional

| Property | Value |
|---|---|
| Field | bin |
| Format | 9 or 13 digits |
| Source | Bangladesh National Board of Revenue |
| Purpose | VAT registration identifier |
| Validation | Must pass BIN checksum |

### 7. TIN (Tax Identification Number) — Optional

| Property | Value |
|---|---|
| Field | tin |
| Format | 11 or 13 digits |
| Source | Bangladesh National Board of Revenue |
| Purpose | Income tax identifier |
| Validation | Must pass TIN checksum |

### 8. ISBN Publisher Prefix — Optional

| Property | Value |
|---|---|
| Field | isbn_prefix |
| Format | 1 to 7 digits |
| Source | ISBN Agency (Bangladesh) |
| Purpose | Identifies the publisher in ISBN registrations |
| Validation | Must be a valid ISBN group prefix |

## Identifier Hierarchy

```
Internal ID (system) ─── Trade Name (commercial)
                      │── Legal Name (legal)
                      │── Display Name (presentation)
                      │── Registration Number (government)
                      │── BIN (tax)
                      │── TIN (tax)
                      └── ISBN Prefix (industry)
```

## Uniqueness Constraints

| Identifier | Unique Across | Enforced |
|---|---|---|
| publisher_id | All publishers | Database PK |
| legal_name_en + address_city | Active publishers | Application |
| slug | All publishers | Database unique index |
| registration_number | (not guaranteed globally) | Not enforced |
