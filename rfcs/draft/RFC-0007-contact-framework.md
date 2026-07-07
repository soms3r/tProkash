---
title: Contact Framework
status: Draft
number: RFC-0007
version: 0.1
authors:
  - tbd
created: 2026-07-06
---

# RFC-0007: Contact Framework

## 1. Vision

A **Contact** inside tProkash is a person, role, or function associated
with a domain entity, reachable through one or more communication
methods. Contacts are the human face of every Organization, Publisher,
Printer, Distributor, Bookstore, Library, User, and institution in the
platform.

The Contact Framework separates **who** the contact is from **how** they
are reached. A single contact may have unlimited communication methods
(email, phone, WhatsApp, Signal, Telegram, fax, website, postal address,
social media, API endpoint), each with its own verification status,
privacy level, and availability schedule.

This framework ensures that every contact in the system is:

- Structured as a reusable value object, not embedded in entity tables.
- Privacy-controlled per method (some methods public, others private).
- Verified independently per method (email verified, phone unverified).
- Historically preserved (contact changes create new versions).
- Internationally compatible (E.164 for phone, Unicode for names).
- Role-aware (billing contact, editorial contact, emergency contact).

## 2. Goals

- Define a universal Contact model that separates the person/role
  (Contact entity) from the communication channel (ContactMethod value
  object).
- Support unlimited contacts per entity and unlimited methods per
  contact.
- Provide a comprehensive set of contact types (primary, billing,
  editorial, rights, sales, media, support, legal, emergency, technical,
  archive, other) and contact methods (email, phone, mobile, WhatsApp,
  Signal, Telegram, fax, website, postal address, social media, API
  endpoint, other).
- Enable privacy controls per contact method, not just per contact.
- Support per-method verification (verified, unverified, expired).
- Define preferred communication channels and availability schedules
  (business hours, timezone, language).
- Support international standards: E.164 for phone numbers, ISO 3166
  for country codes, BCP-47 for language preferences, IANA timezone
  identifiers.
- Preserve contact history immutably.
- Define a contact lifecycle with audit trail.

## 3. Non-Goals

- Implement database schema, migrations, or repositories.
- Define REST endpoints or GraphQL resolvers.
- Create UI components or contact management panels.
- Implement messaging, email delivery, or notification services.
- Integrate with third-party contact synchronisation services.
- Implement phone number validation libraries (designed to reference
  them, not build them).
- Define a full contact verification service (verification framework
  will handle this).
- Implement contact deduplication or merge logic (merge strategy is
  defined, implementation deferred).
- Store communication history or message logs.

## 4. Contact Model

The Contact model has two distinct layers: the **Contact entity** (the
person or role) and the **ContactMethod value object** (the
communication channel). This separation is fundamental to the framework.

### Contact Entity

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Internal system identifier. |
| `type` | ContactType | The role or function of this contact (see Section 6). |
| `label` | String? | Human-readable label (e.g., "Rights Manager", "24/7 Support"). |
| `primary` | Boolean | Whether this is the primary contact for the entity. |
| `name` | ContactName | The contact's name and title (see below). |
| `organization` | String? | The organisation or department the contact belongs to. |
| `title` | String? | Job title or role description. |
| `language` | String? | BCP-47 language tag for preferred communication language. |
| `timezone` | String? | IANA timezone identifier. |
| `availability` | Availability? | Business hours and availability schedule (see Section 14). |
| `notes` | String? | Internal notes about this contact (private). |
| `status` | ContactStatus | Active, inactive, archived (see Section 18). |
| `audit` | AuditMetadata | Creation and modification audit trail. |

### ContactName

```jsonc
{
  "givenName": "string?",
  "familyName": "string?",
  "middleName": "string?",
  "prefix": "string?",
  "suffix": "string?",
  "fullName": "string",
  "nativeScript": "string?",
  "romanized": "string?"
}
```

| Field | Description |
|-------|-------------|
| `givenName` | First name or given name. |
| `familyName` | Last name or family name. |
| `middleName` | Middle name or patronymic. |
| `prefix` | Honorific prefix (Dr., Prof., Mr., Ms.). |
| `suffix` | Honorific suffix (Jr., Sr., III, PhD). |
| `fullName` | Complete name as it should be displayed. **Required.** |
| `nativeScript` | The name in the contact's native writing system. |
| `romanized` | Transliteration into Latin script. |

Names support full Unicode. At least `fullName` is required. All other
name fields are optional.

## 5. Contact Entity vs. Contact Method

This is the central architectural decision of the framework.

### Separation Principle

```
Contact (entity)                   ContactMethod (value object)
──────────────                     ─────────────────────────────
Who is the person?                 How do we reach them?
What is their role?                What channel do we use?
When are they available?           Is the channel verified?
What language do they prefer?      Is the channel public?
                                   What is the actual address/value?
```

### Examples

```
Contact: "Sarah Ahmed" (Rights Manager)
    ├── ContactMethod: EMAIL   → sarah@example.com       (VERIFIED, PUBLIC)
    ├── ContactMethod: PHONE   → +8801712345678           (VERIFIED, PRIVATE)
    ├── ContactMethod: WHATSAPP → +8801712345678          (VERIFIED, PRIVATE)
    └── ContactMethod: SIGNAL  → sarah.ahmed.01           (UNVERIFIED, PRIVATE)

Contact: "Penguin Random House Legal Dept" (Legal)
    ├── ContactMethod: EMAIL   → legal@penguin.com        (VERIFIED, PUBLIC)
    └── ContactMethod: POSTAL  → 1745 Broadway, NY        (UNVERIFIED, PUBLIC)
```

### Rationale

- A single contact may have multiple methods of the same type (e.g., two
  email addresses).
- Verification is per-method. An email may be verified while a phone
  number for the same contact is not.
- Privacy is per-method. A work email may be public while a personal
  mobile number is private.
- Methods can be added, removed, or verified independently of the
  contact entity.
- The same phone number may serve as both PHONE and WHATSAPP for the
  same contact.

## 6. Contact Types

| Type | Description |
|------|-------------|
| **Primary** | The primary or default contact for the entity. |
| **General** | General inquiry contact. |
| **Billing** | Billing, invoicing, and accounting contact. |
| **Editorial** | Editorial department contact. |
| **Rights** | Rights, permissions, and licensing contact. |
| **Sales** | Sales, distribution, and retail contact. |
| **Media** | Press, media, and public relations contact. |
| **Support** | Customer or technical support contact. |
| **Legal** | Legal department or legal representative contact. |
| **Emergency** | Emergency contact person (after-hours, urgent matters). |
| **Technical** | Technical or IT contact. |
| **Archive** | Historical or archival contact (past role, retained for reference). |
| **Management** | Executive or senior management contact. |
| **Operations** | Operational contact (facilities, logistics, HR). |
| **Compliance** | Regulatory and compliance contact. |
| **Other** | Any type not covered by the above list. |

Contact types are represented as an extensible string union. An entity
may have multiple contacts of the same type. Exactly one contact may be
designated primary per entity.

## 7. Contact Methods

| Method | Identifier Format | Verification Method |
|--------|-------------------|---------------------|
| **Email** | RFC 5322 email address | Email confirmation with verification link. |
| **Phone** | E.164 (e.g., +8801712345678) | SMS verification code. |
| **Mobile** | E.164 | SMS verification code. |
| **WhatsApp** | E.164 or WhatsApp ID | WhatsApp message with verification code. |
| **Signal** | Signal username or phone number | Signal message with verification code. |
| **Telegram** | Telegram username | Telegram message with verification code. |
| **Fax** | E.164 | Manual verification. |
| **Website** | URL | Domain ownership check or meta tag. |
| **Postal Address** | Address reference or raw string | Postcard verification. |
| **Social Media** | Platform URL or handle | Platform-specific verification. |
| **API Endpoint** | URL | Automated handshake or token exchange. |
| **Other** | String | Configurable. |

### ContactMethod Model

```jsonc
{
  "id": "uuid",
  "type": "ContactMethodType",
  "value": "string",
  "label": "string?",
  "primary": "boolean",
  "verified": "boolean",
  "verifiedAt": "datetime?",
  "verificationMethod": "string?",
  "privacy": "PUBLIC | PRIVATE | INTERNAL",
  "preferred": "boolean",
  "preferredOrder": "number?",
  "availability": "Availability?",
  "notes": "string?",
  "status": "ACTIVE | INACTIVE | EXPIRED",
  "audit": "AuditMetadata"
}
```

| Field | Description |
|-------|-------------|
| `id` | Internal identifier for this method record. |
| `type` | The method type (email, phone, WhatsApp, etc.). |
| `value` | The actual contact value (email address, phone number, URL, etc.). |
| `label` | Optional label (e.g., "Work mobile", "Emergency line"). |
| `primary` | Whether this is the primary method of its type for the contact. |
| `verified` | Whether the method has been verified. |
| `verifiedAt` | When verification was last completed. |
| `verificationMethod` | How verification was performed. |
| `privacy` | Privacy level for this specific method. |
| `preferred` | Whether this is a preferred channel for this contact. |
| `preferredOrder` | Order of preference (lower = more preferred). |
| `availability` | Availability schedule for this specific method. |
| `notes` | Internal notes. |
| `status` | Active, inactive, or expired. |
| `audit` | Audit metadata. |

## 8. Multiple Contacts per Entity

Every entity may have multiple contacts of different types.

### Rules

- An entity may have 0..N contacts in total.
- An entity may have 0..N contacts of any given type (e.g., multiple
  billing contacts).
- Exactly one contact may be designated **primary** per entity. The
  primary contact is the default for unspecified communication.
- Each contact type may optionally have a primary (e.g., primary billing
  contact, primary media contact).
- When an entity is created, at least one contact is recommended but not
  required.

### Example

```
Organization: Penguin Random House
    ├── Contact: "Jane Doe" (Primary, Public)
    │   ├── Email: jane@penguin.com (VERIFIED, PUBLIC)
    │   └── Phone: +12125551234 (VERIFIED, PRIVATE)
    ├── Contact: "Rights Dept" (Rights, Public)
    │   ├── Email: rights@penguin.com (VERIFIED, PUBLIC)
    │   └── Fax: +12125555678 (UNVERIFIED, PRIVATE)
    ├── Contact: "Legal Dept" (Legal, Private)
    │   └── Email: legal@penguin.com (VERIFIED, PRIVATE)
    └── Contact: "Emergency Line" (Emergency, Private)
        └── Phone: +12125559999 (VERIFIED, PRIVATE)
```

## 9. Multiple Contact Methods per Contact

Each contact may have unlimited contact methods.

### Rules

- A contact may have 0..N methods in total.
- A contact may have 0..N methods of any given type (e.g., two email
  addresses, three phone numbers).
- Exactly one method per type may be designated **primary** (e.g.,
  primary email, primary phone).
- A method may be marked as **preferred** across all types, with an
  optional preference order.
- Methods are independently verifiable and privacy-controllable.

### Example

```
Contact: "Sarah Ahmed" (Rights Manager)
    ├── Email: sarah@work.com       (VERIFIED, PUBLIC,    PRIMARY EMAIL)
    ├── Email: sarah.personal@...   (VERIFIED, PRIVATE,   SECONDARY EMAIL)
    ├── Phone: +8801712345678       (VERIFIED, PRIVATE,   PRIMARY PHONE)
    ├── WhatsApp: +8801712345678    (VERIFIED, PRIVATE,   PREFERRED)
    ├── Signal: sarah.ahmed.01      (UNVERIFIED, PRIVATE)
    └── Telegram: @sarah_ahmed      (UNVERIFIED, PRIVATE)
```

## 10. Contact Roles and Responsibilities

Beyond the contact type, a contact may have a structured description of
their role and responsibilities.

| Field | Description |
|-------|-------------|
| `title` | Job title (e.g., "Head of Rights and Permissions"). |
| `department` | Department or unit (e.g., "Rights Department"). |
| `responsibilities` | Free-text description of responsibilities. |
| `region` | Geographic region the contact covers (e.g., "South Asia"). |
| `subjects` | Subject areas the contact handles (e.g., "Medical, Engineering"). |

These fields are optional and free-form. They are searchable metadata.

## 11. Preferred Communication Channels

A contact may express preferences for how they should be contacted.

### Preference Model

```jsonc
{
  "preferredChannels": [
    { "method": "WHATSAPP", "order": 1, "label": "Preferred for urgent" },
    { "method": "EMAIL", "order": 2, "label": "Preferred for non-urgent" },
    { "method": "PHONE", "order": 3, "label": "Only if urgent and WhatsApp unavailable" }
  ],
  "preferredLanguage": "en",
  "preferredTimezone": "Asia/Dhaka",
  "availability": { ... }
}
```

### Principles

- Preference is per-contact, not per-entity. Different contacts within
  the same entity may have different preferences.
- Preference order is a simple numeric ranking (1 = most preferred).
- A method may be marked as `preferred: true` without specifying an
  order.
- Availability and language preferences refine when and how a channel
  should be used.

## 12. Verification Model

Each contact method is verified independently. Verification follows the
Verification Framework (future RFC) with contact-specific extensions.

### Verification Methods

| Method | Description |
|--------|-------------|
| **EMAIL_CONFIRMATION** | Verification link sent to the email address. |
| **SMS_CODE** | Verification code sent via SMS. |
| **WHATSAPP_CODE** | Verification code sent via WhatsApp message. |
| **SIGNAL_CODE** | Verification code sent via Signal. |
| **TELEGRAM_CODE** | Verification code sent via Telegram. |
| **CALL_BACK** | Phone call with automated verification code. |
| **POSTCARD** | Physical postcard with verification code. |
| **DOMAIN_OWNERSHIP** | DNS record, meta tag, or file upload for website. |
| **TOKEN_EXCHANGE** | Automated handshake for API endpoints. |
| **PLATFORM_VERIFICATION** | Platform-specific verification (Twitter blue check, etc.). |
| **MANUAL_REVIEW** | Manual verification by an Administrator or Verifier. |

### Verification States

| State | Description |
|-------|-------------|
| **UNVERIFIED** | No verification has been attempted. |
| **PENDING** | Verification is in progress (code sent, awaiting confirmation). |
| **VERIFIED** | Successfully verified. |
| **EXPIRED** | Previous verification has expired and must be renewed. |
| **FAILED** | Verification attempt failed. |
| **REVOKED** | Previously verified method has been revoked. |

### Principles

- Verification is per-method, not per-contact. A contact may have
  VERIFIED email and UNVERIFIED phone.
- Verification history is immutable and append-only.
- Verification may expire (e.g., email re-confirmation every 12 months).

## 13. Privacy and Visibility Levels

Each contact method has its own privacy level.

| Level | Visibility | Example Use |
|-------|------------|-------------|
| **PUBLIC** | Visible to all actors (including Visitors). The method value is exposed in public API responses. | General inquiry email, media contact phone. |
| **PRIVATE** | Visible only to the entity owner and Administrators. Method value is never exposed through public APIs. | Personal mobile number, direct email. |
| **INTERNAL** | Visible only to Administrators. Not visible to the entity owner. Method value is never exposed outside authorised internal systems. | Emergency contact for internal use, security contact. |

### Default Levels by Contact Type

| Contact Type | Default Privacy |
|--------------|----------------|
| Primary | PUBLIC (method-level configurable) |
| General | PUBLIC |
| Billing | PRIVATE |
| Editorial | PUBLIC |
| Rights | PUBLIC |
| Sales | PUBLIC |
| Media | PUBLIC |
| Support | PUBLIC |
| Legal | PRIVATE |
| Emergency | PRIVATE |
| Technical | PRIVATE |
| Archive | INTERNAL |
| Management | PRIVATE |
| Operations | PRIVATE |
| Compliance | PRIVATE |

Defaults are configurable per entity type and per deployment.

## 14. Availability and Business Hours

Each contact and each contact method may have an availability schedule.

### Availability Model

```jsonc
{
  "timezone": "Asia/Dhaka",
  "businessHours": [
    {
      "days": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"],
      "start": "09:00",
      "end": "17:00"
    },
    {
      "days": ["FRIDAY"],
      "start": "09:00",
      "end": "12:00"
    }
  ],
  "holidays": [
    { "date": "2026-03-26", "label": "Independence Day" },
    { "date": "2026-04-14", "label": "Pohela Boishakh" }
  ],
  "outOfOffice": [
    { "from": "2026-07-01", "to": "2026-07-15", "label": "Annual leave" }
  ],
  "responseTime": "24h",
  "availabilityNote": "Available during business hours. Emergency line is 24/7."
}
```

### Principles

- Availability is optional. Most contacts will not specify it.
- Availability may be specified at the contact level (general
  availability) or overridden at the method level (e.g., email is
  monitored 24/7 but phone is business hours only).
- Business hours reference the contact's timezone.
- Holidays and out-of-office periods suppress preferred-channel
  routing.
- `responseTime` is a descriptive string, not an SLA guarantee.

## 15. Language Preferences

Each contact may specify a preferred communication language.

- Language is stored as a BCP-47 tag (e.g., "bn-BD", "en-US", "ar-SA").
- The preferred language influences automated communications (email
  templates, SMS messages).
- Language preference is per-contact, not per-method. A single contact
  is assumed to prefer one language for all communications.
- If no language is specified, the entity's default language is used.

## 16. Regional and Timezone Considerations

Contacts may operate across regions and timezones.

- Each contact has an optional timezone (IANA identifier).
- Timezone affects availability calculations and scheduling.
- A contact may serve multiple regions (see Section 10, `region`
  field).
- When a contact covers multiple timezones, the primary timezone is used
  for availability calculations.
- Regional contact information (local phone numbers, local-language
  names) is supported through multiple contact methods.

## 17. Historical Contact Records

Contact history is immutable and append-only.

### Principles

- When a contact entity is updated, the previous version is preserved as
  a historical record.
- When a contact method is added, removed, or modified, the change is
  recorded in the contact's audit history.
- Historical contacts are linked to the current contact via a
  `supersededBy` / `supersedes` relationship.
- A contact may have 0..N historical versions in a chain.
- Historical records carry the effective date range (from, until) and an
  audit entry.
- Contact methods are never physically deleted. An `INACTIVE` or
  `EXPIRED` status is used instead (see Section 18).
- Historical contact records are accessible to Administrators and the
  entity owner only.

### Example Chain

```
Contact V1: "John Smith" (jan@oldcompany.com) (2020-01-01 → 2023-06-30)
    superseded by
Contact V2: "John Smith" (john@newcompany.com) (2023-07-01 → present)
```

## 18. Contact Lifecycle

Both the Contact entity and individual ContactMethod have lifecycles.

### Contact Entity States

```
ACTIVE → INACTIVE → ARCHIVED
                └──→ DELETED (from INACTIVE only)
```

| State | Description |
|-------|-------------|
| **ACTIVE** | The contact is currently reachable and in use. |
| **INACTIVE** | The contact is no longer actively used but retained for historical reference. |
| **ARCHIVED** | Archived for long-term retention. Not visible in active queries. |
| **DELETED** | Logically deleted. Retained for audit only. Administrator-only. |

### ContactMethod States

```
ACTIVE → INACTIVE → EXPIRED
```

| State | Description |
|-------|-------------|
| **ACTIVE** | The method is currently usable. |
| **INACTIVE** | The method is no longer in use (e.g., former email address). |
| **EXPIRED** | The method's verification has expired. It must be re-verified to become ACTIVE. |

### Rules

- An entity must always have at least one ACTIVE contact of type PRIMARY
  if it requires contacts.
- The primary contact cannot be transitioned to INACTIVE without
  designating a new primary.
- Lifecycle transitions are audited.

## 19. Relationships

A Contact is referenced by domain entities but does not own them.

```
Contact (entity)
    ├── 0..N  Organizations         — contact of organization
    ├── 0..N  Publishers            — contact of publisher
    ├── 0..N  Authors               — contact of author
    ├── 0..N  Printers              — contact of printer
    ├── 0..N  Distributors          — contact of distributor
    ├── 0..N  Bookstores            — contact of bookstore
    ├── 0..N  Libraries             — contact of library
    ├── 0..N  Users                 — contact of user
    ├── 0..N  Events                — event organizer contact
    ├── 0..N  Government Agencies   — contact of agency
    └── 0..N  Educational Insts     — contact of institution
```

Each relationship records:

- The entity type and ID.
- The contact type (primary, billing, editorial, etc.).
- Whether it is the primary contact for that entity.
- Effective date range.
- Audit metadata.

### Design Principle

A Contact entity may be shared across multiple domain entities (e.g., a
person who serves as both the billing contact for a Publisher and the
legal contact for a Distributor). Alternatively, a Contact may be
exclusively scoped to a single entity. The relationship model supports
both.

## 20. Search Requirements

Contact search must support:

### Structured Search

- **Filter by contact type** (primary, billing, editorial, etc.).
- **Filter by contact method type** (email, phone, WhatsApp, etc.).
- **Filter by verification status** (verified, unverified, expired).
- **Filter by privacy level** (public, private, internal).
- **Filter by lifecycle status** (active, inactive, archived).
- **Filter by language** (BCP-47 tag).
- **Filter by timezone.**
- **Filter by entity type** (find all contacts for a publisher, etc.).
- **Filter by department or title.**
- **Filter by region.**

### Full-text Search

- Search across contact name (all variants), label, title, department,
  organization, notes, and contact method values.
- Autocomplete on contact name.

### Limitations

- Private and internal contact methods are excluded from public search
  results.
- Only PUBLIC contact method values are returned in public search
  results.
- INTERNAL contacts are not discoverable by entity owners.

## 21. Import/Export Requirements

### Import

- **Format**: JSON, CSV, XML.
- **Fields**: All contact entity fields and contact method fields.
- **Validation**: Contact methods are validated for format (E.164 phone,
  RFC 5322 email, valid URL). Invalid methods are reported.
- **Duplicate detection**: Matched on a combination of entity + contact
  type + method value. Duplicates are flagged.
- **Verification**: Imported methods start as UNVERIFIED. Verification
  must be completed after import.
- **Privacy**: Imported methods inherit the default privacy level for
  their contact type unless explicitly set.
- **Audit**: Every import batch creates an audit record.

### Export

- **Format**: JSON, CSV, XML.
- **Scope**:
  - Public export — Contact name, type, and PUBLIC methods only.
  - Full export — All contact data. Restricted to Administrators and
    the entity owner.
- **Filtering**: Same filters as Search.
- **Privacy**: Export respects per-method privacy levels.

## 22. API Resource Shapes

The following shapes describe the Contact resource. Actual endpoints are
deferred to implementation RFCs.

### Contact

```jsonc
{
  "id": "uuid",
  "type": "ContactType",
  "label": "string?",
  "primary": "boolean",
  "name": {
    "givenName": "string?",
    "familyName": "string?",
    "middleName": "string?",
    "prefix": "string?",
    "suffix": "string?",
    "fullName": "string",
    "nativeScript": "string?",
    "romanized": "string?"
  },
  "organization": "string?",
  "department": "string?",
  "title": "string?",
  "responsibilities": "string?",
  "region": "string?",
  "language": "string?",
  "timezone": "string?",
  "availability": {
    "timezone": "string?",
    "businessHours": [
      {
        "days": ["MONDAY", "TUESDAY"],
        "start": "09:00",
        "end": "17:00"
      }
    ],
    "responseTime": "string?"
  },
  "preferredChannels": [
    { "method": "EMAIL", "order": 1 }
  ],
  "methods": ["ContactMethod"],
  "notes": "string?",
  "status": "ACTIVE | INACTIVE | ARCHIVED | DELETED",
  "lifecycle": "WorkflowStatus",
  "audit": "AuditMetadata"
}
```

### ContactSummary

```jsonc
{
  "id": "uuid",
  "type": "ContactType",
  "label": "string?",
  "primary": "boolean",
  "name": {
    "fullName": "string"
  },
  "title": "string?",
  "language": "string?",
  "status": "ACTIVE | INACTIVE | ARCHIVED"
}
```

### ContactMethod

```jsonc
{
  "id": "uuid",
  "type": "ContactMethodType",
  "value": "string",
  "label": "string?",
  "primary": "boolean",
  "verified": "boolean",
  "verifiedAt": "datetime?",
  "verificationMethod": "string?",
  "privacy": "PUBLIC | PRIVATE | INTERNAL",
  "preferred": "boolean",
  "preferredOrder": "number?",
  "availability": {
    "businessHours": [...],
    "responseTime": "string?"
  },
  "status": "ACTIVE | INACTIVE | EXPIRED",
  "audit": "AuditMetadata"
}
```

### ContactInput (create/update)

```jsonc
{
  "type": "ContactType",
  "label": "string?",
  "primary": "boolean?",
  "name": {
    "givenName": "string?",
    "familyName": "string?",
    "middleName": "string?",
    "prefix": "string?",
    "suffix": "string?",
    "fullName": "string",
    "nativeScript": "string?",
    "romanized": "string?"
  },
  "organization": "string?",
  "department": "string?",
  "title": "string?",
  "responsibilities": "string?",
  "region": "string?",
  "language": "string?",
  "timezone": "string?",
  "availability": {
    "businessHours": [...],
    "responseTime": "string?"
  },
  "preferredChannels": [...],
  "methods": ["ContactMethodInput"],
  "notes": "string?"
}
```

### ContactMethodInput

```jsonc
{
  "type": "ContactMethodType",
  "value": "string",
  "label": "string?",
  "primary": "boolean?",
  "privacy": "PUBLIC | PRIVATE | INTERNAL?",
  "preferred": "boolean?",
  "preferredOrder": "number?",
  "availability": {
    "businessHours": [...]
  }
}
```

## 23. Permissions

| Action | Visitor | Entity Owner | Verifier | Administrator |
|--------|---------|--------------|----------|---------------|
| View public contact info (name, PUBLIC methods) | ✅ | ✅ | ✅ | ✅ |
| View full contact info (PRIVATE methods) | ❌ | ✅ | ✅ | ✅ |
| View INTERNAL contact info | ❌ | ❌ | ❌ | ✅ |
| View contact history | ❌ | ✅ (own) | ✅ | ✅ |
| Search contacts (PUBLIC only) | ✅ | ✅ | ✅ | ✅ |
| Add contact | ❌ | ✅ (own) | ✅ | ✅ |
| Update own contact | ❌ | ✅ | ❌ | ❌ |
| Update any contact | ❌ | ❌ | ✅ | ✅ |
| Verify contact method | ❌ | ❌ | ✅ | ✅ |
| Import contacts | ❌ | ❌ | ❌ | ✅ |
| Export contacts (public) | ✅ | ✅ | ✅ | ✅ |
| Export contacts (full) | ❌ | ✅ (own) | ✅ | ✅ |
| Archive/delete contact | ❌ | ❌ | ❌ | ✅ |

## 24. Security Considerations

- **Privacy enforcement** — Privacy level is enforced at the data access
  layer. PRIVATE and INTERNAL method values are never returned by public
  APIs regardless of how they are queried.
- **Verification abuse** — Verification code delivery is rate-limited
  per contact method to prevent abuse (SMS flooding, email spam).
- **Data minimisation** — Contact methods are collected only when
  necessary. Personal contact information (mobile, personal email) is
  never required unless the contact type demands it.
- **Export control** — Full contact exports are logged and monitored.
  Bulk export of PRIVATE contact methods triggers an alert.
- **Rate limiting** — Contact mutation endpoints are rate-limited per
  authenticated actor.
- **Contact method validation** — Contact method values are validated
  and sanitised on input. Email addresses are checked for common
  patterns indicative of temporary or disposable addresses.
- **Historical data** — Historical contact records are immutable. They
  cannot be modified or deleted.
- **Cross-entity sharing** — When a Contact entity is shared across
  multiple domain entities, updates by one entity's authorised
  representative must not silently modify the contact as seen by another
  entity. Contact records are versioned; changes create new versions.

## 25. Future Extensions

### Contact Directory

A searchable directory of contacts across all entities, filtered by
privacy and entity ownership.

### Bulk Contact Update

A service for updating contact information in bulk across multiple
entities (e.g., when a distributor changes its sales team).

### Contact Verification Scheduler

A scheduled service that periodically re-verifies contact methods whose
verification has expired or is about to expire.

### Preferred Channel Routing

A routing service that selects the best contact method based on
preference, availability, timezone, and urgency.

### Contact Merge

A service for merging duplicate contacts across entities, preserving
history and relationship integrity.

### vCard / VCF Export

A standard vCard export format for contact data.

### Contact Import from External Sources

Integration with external contact management systems (Google Contacts,
Microsoft 365, CRM systems) for synchronisation.

## 26. Open Questions

1. Should a Contact entity be globally unique (same person across
   multiple entities is one Contact) or per-entity (each entity has its
   own copy)? Global uniqueness enables a single source of truth but
   introduces privacy and data-sharing complexity.

2. How is consent managed for contact methods? Should each method carry
   a consent timestamp and consent source?

3. Should contact methods support expiration dates independently of
   verification expiration (e.g., a temporary phone number valid for 6
   months)?

4. How should preferred channels interact with automated notification
   systems? Should the system automatically select the highest-ranked
   available method, or should it always use a type-specific default?

5. What is the maximum number of contact methods per contact before
   performance or usability concerns arise?

6. Should contact names support multiple given names, compound family
   names, and mononyms (single-name individuals)?

7. How are contacts linked to User accounts? Is a User automatically a
   Contact of their own profile?

8. Should contact method verification support a "trust on first use"
   (TOFU) model where internal methods are auto-verified?

9. What is the retention period for EXPIRED contact methods before they
   are automatically transitioned to INACTIVE?

10. How should the system handle phone number portability (a number
    moving from one carrier to another)?

## 27. Acceptance Criteria

- [ ] Contact **Vision**, **Goals**, and **Non-Goals** are documented
      and reviewed.
- [ ] The **Contact Model** separates Contact entity (who, what role)
      from ContactMethod (how to reach them), with full field
      definitions for both layers.
- [ ] **ContactName** defines givenName, familyName, middleName, prefix,
      suffix, fullName (required), nativeScript, and romanized with
      Unicode support.
- [ ] All **Contact Types** (16 types) are listed and described as an
      extensible string union.
- [ ] All **Contact Methods** (12 methods) are listed with identifier
      formats and verification methods.
- [ ] **Multiple Contacts per Entity** documents 0..N contacts, 0..N
      per type, exactly one primary per entity, and optional
      type-specific primaries with examples.
- [ ] **Multiple Contact Methods per Contact** documents 0..N methods,
      0..N per type, exactly one primary per type, independent
      verification, and independent privacy with examples.
- [ ] **Contact Roles and Responsibilities** documents title,
      department, responsibilities, region, and subjects.
- [ ] **Preferred Communication Channels** defines per-contact
      preferences with ordered channel list, language, timezone, and
      availability.
- [ ] **Verification Model** defines 11 verification methods and 6
      verification states with per-method independence and immutable
      history.
- [ ] **Privacy and Visibility Levels** defines PUBLIC, PRIVATE, and
      INTERNAL per-method with default levels by contact type.
- [ ] **Availability and Business Hours** defines per-contact and
      per-method availability with timezone, business hours, holidays,
      out-of-office periods, and response time.
- [ ] **Language Preferences** documents BCP-47 language tags at the
      contact level.
- [ ] **Historical Contact Records** documents immutable append-only
      history with supersededBy/supersedes chains and effective date
      ranges.
- [ ] **Contact Lifecycle** defines ACTIVE, INACTIVE, ARCHIVED, DELETED
      for entities and ACTIVE, INACTIVE, EXPIRED for methods with
      transition rules.
- [ ] **Relationships** lists all entity types that reference contacts
      with cardinality and relationship metadata, supporting both shared
      and exclusive contacts.
- [ ] **Search Requirements** documents structured search, full-text
      search, and privacy limitations.
- [ ] **Import/Export Requirements** document format, validation,
      duplicate detection, verification, and privacy enforcement.
- [ ] **API Resource Shapes** define Contact (full), ContactSummary,
      ContactMethod, ContactInput, and ContactMethodInput with all
      documented fields.
- [ ] **Permissions** are defined for all 4 actor classes across 13
      actions.
- [ ] **Security Considerations** address privacy enforcement,
      verification abuse, data minimisation, export control, rate
      limiting, validation, historical immutability, and cross-entity
      sharing.
- [ ] **Future Extensions** (Contact Directory, Bulk Update,
      Verification Scheduler, Channel Routing, Contact Merge, vCard
      Export, External Import) are identified.
- [ ] **Open Questions** are documented (10 questions) and awaiting
      resolution.
