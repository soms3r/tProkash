# Publisher Services

**Version:** 1.0.0\
**Status:** Approved

---

## Purpose

Define the standard list of services a Publisher may offer. This controlled vocabulary ensures consistent service reporting across the ecosystem.

## Service Definitions

| Service ID | Service Name | Description | Category |
|---|---|---|---|
| PUB-SVC-001 | Self Publishing | Author-published works where the author bears production costs | Publishing |
| PUB-SVC-002 | Traditional Publishing | Publisher bears costs and pays author royalties | Publishing |
| PUB-SVC-003 | Editing | Manuscript editing services including developmental, copy, and line editing | Editorial |
| PUB-SVC-004 | Proofreading | Final error review before publication | Editorial |
| PUB-SVC-005 | Translation | Book translation between languages | Editorial |
| PUB-SVC-006 | Cover Design | Book cover design and artwork | Design |
| PUB-SVC-007 | Interior Layout | Typesetting and interior page design | Design |
| PUB-SVC-008 | Illustration | Book illustration services | Design |
| PUB-SVC-009 | Printing | Physical book production | Production |
| PUB-SVC-010 | Binding | Book binding services | Production |
| PUB-SVC-011 | ISBN Assistance | ISBN registration and management | Administrative |
| PUB-SVC-012 | Distribution | Book distribution to retailers | Distribution |
| PUB-SVC-013 | Marketing | Book marketing and promotion | Marketing |
| PUB-SVC-014 | Publicity | Media relations and author publicity | Marketing |
| PUB-SVC-015 | eBook Publishing | Digital book production and distribution | Digital |
| PUB-SVC-016 | Audiobook Publishing | Audiobook production and distribution | Digital |
| PUB-SVC-017 | Print on Demand | Print-on-demand services | Production |
| PUB-SVC-018 | Warehousing | Book storage and inventory management | Logistics |
| PUB-SVC-019 | Rights Management | Copyright and rights licensing management | Legal |
| PUB-SVC-020 | Author Consultation | Author advisory and manuscript evaluation | Consulting |

## Service Categories

| Category | Services |
|---|---|
| Publishing | Self Publishing, Traditional Publishing |
| Editorial | Editing, Proofreading, Translation |
| Design | Cover Design, Interior Layout, Illustration |
| Production | Printing, Binding, Print on Demand |
| Distribution | Distribution, Warehousing |
| Marketing | Marketing, Publicity |
| Digital | eBook Publishing, Audiobook Publishing |
| Administrative | ISBN Assistance |
| Legal | Rights Management |
| Consulting | Author Consultation |

## Storage

Services are stored as a comma-separated list in the `services` field of the Publisher record, or as a JSON array:

```json
["Traditional Publishing", "Editing", "Printing", "Distribution"]
```

## Validation

Service names must exactly match the defined service names (case-sensitive). Unknown service names are rejected.

## Future Services

New services may be added to this list through the ADR process. Proposed services must be demonstrably distinct from existing ones.
