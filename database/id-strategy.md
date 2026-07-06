# ID Strategy

**Version:** 1.0.0\
**Status:** Approved

---

## 1. Principle

All database entities use a prefixed, human-readable, URL-safe identifier as the primary key. IDs are generated at the application layer and are not database-auto-incremented.

## 2. ID Format

```
XXXX-XXXXXXXXXX
```

- **Prefix (4 chars):** Entity type identifier, uppercase
- **Separator:** Hyphen
- **Suffix (10 chars):** Random or sequential alphanumeric (base-62)

Total length: 15 characters.

## 3. Prefix Table

| Entity | Prefix | Example |
|---|---|---|
| Publisher | PUB | PUB-A1B2C3D4E5 |
| Imprint | IMP | IMP-F6G7H8I9J0 |
| Author | AUT | AUT-K1L2M3N4O5 |
| Person | PER | PER-P6Q7R8S9T0 |
| Book | BOK | BOK-U1V2W3X4Y5 |
| Edition | EDN | EDN-Z1A2B3C4D5 |
| ISBN | IBN | IBN-E6F7G8H9I0 |
| Language | LNG | LNG-J1K2L3M4N5 |
| Category | CAT | CAT-O6P7Q8R9S0 |
| Series | SER | SER-T1U2V3W4X5 |
| Collection | COL | COL-Y6Z7A8B9C0 |
| Printer | PRN | PRN-D1E2F3G4H5 |
| Printing | PRT | PRT-I6J7K8L9M0 |
| Print Batch | PBH | PBH-N1O2P3Q4R5 |
| Warehouse | WAR | WAR-S6T7U8V9W0 |
| Inventory | INV | INV-X1Y2Z3A4B5 |
| Distributor | DST | DST-C6D7E8F9G0 |
| Bookstore | BST | BST-H1I2J3K4L5 |
| Reader | RDR | RDR-M6N7O8P9Q0 |
| Review | RVW | RVW-R1S2T3U4V5 |
| Award | AWD | AWD-W6X7Y8Z9A0 |
| Event | EVT | EVT-B1C2D3E4F5 |
| Organization | ORG | ORG-G6H7I8J9K0 |
| License | LIC | LIC-L1M2N3O4P5 |
| Contract | CNT | CNT-Q6R7S8T9U0 |
| Submission | SUB | SUB-V1W2X3Y4Z5 |
| Media Asset | MDA | MDA-A6B7C8D9E0 |
| Digital Asset | DGA | DGA-F1G2H3I4J5 |
| Tag | TAG | TAG-K6L7M8N9O0 |
| Keyword | KWD | KWD-P1Q2R3S4T5 |
| Dataset | DST | DST-U6V7W8X9Y0 |
| Source | SRC | SRC-Z1A2B3C4D5 |
| Verification | VRF | VRF-E6F7G8H9I0 |
| Role | ROL | ROL-J1K2L3M4N5 |
| Permission | PRM | PRM-O6P7Q8R9S0 |
| User | USR | USR-T1U2V3W4X5 |
| Audit Log | ALG | ALG-Y6Z7A8B9C0 |
| Notification | NTF | NTF-D1E2F3G4H5 |
| Search Index | SIX | SIX-I6J7K8L9M0 |
| API Client | APC | APC-N1O2P3Q4R5 |
| Country | CTR | CTR-S6T7U8V9W0 |
| City | CTY | CTY-X1Y2Z3A4B5 |
| Address | ADR | ADR-C6D7E8F9G0 |
| Contact Method | CNM | CNM-H1I2J3K4L5 |
| Contribution Role | CRL | CRL-M6N7O8P9Q0 |

## 4. Generation Strategy

IDs are generated using a cryptographically random alphanumeric string (0-9, A-Z, a-z) for the suffix portion. The application layer generates the ID before inserting the row. IDs are not sequential and are not predictable.

## 5. Uniqueness

IDs are unique per entity type. Cross-entity ID collision is acceptable because the prefix differs. IDs are globally unique when combined with the prefix.

## 6. Immutability

Once assigned, an ID must never change. Soft-deleted entities retain their ID. No ID is ever reused.

## 7. Alternatives Considered

- **Auto-increment integer:** Rejected — exposes record count, creates merge conflicts, not portable.
- **UUID:** Rejected — not human-readable, difficult to reference in communication.
- **ULID:** Rejected — adds sorting dependency not required by the domain.
- **Natural key:** Rejected — ISBN and other natural keys change or may not be available at creation time.
