# Data Provenance Standard

## Purpose

Ensure every published fact within the tProkash publishing ecosystem can be traced to its origin. Provenance tracking guarantees that all data is attributable, auditable, and verifiable by any authorized party. No fact shall exist in the database without a clear, documented source.

## Scope

This standard applies to all data entering the tProkash database, including publisher records, book listings, author profiles, edition metadata, translations, distribution data, and any supplementary information contributed through manual entry, bulk import, community submission, or automated collection.

## Definitions

- **Provenance**: The documented chain of custody and origin for a piece of data, including who collected it, when, and from which source.
- **Source**: The origin from which a fact was obtained. Every source has a type, a reference identifier (URL, document ID, communication log), and a timestamp.
- **Primary Source**: The original, firsthand source of information. Examples include an official publisher website, a government registry, or a direct communication from the publisher.
- **Secondary Source**: A source that reports or cites primary sources. Examples include news articles summarizing a publisher announcement or a book fair catalog that references ISBN agency data.
- **Hearsay**: Information obtained indirectly with no confirmed primary source. Hearsay may be recorded as provisional data only and must be clearly marked with a confidence level of 20 or below.

## Source Types

Every source reference in tProkash must be classified into exactly one of the following types:

| Source Type | Description | Examples |
|---|---|---|
| `official_website` | Official publisher or organization website | www.prokashpub.com, www.kendrapustak.gov.bd |
| `government_registry` | Government registration or ISBN agency data | National Book Centre registry, Registrar of Newspapers |
| `publisher_email` | Direct email communication from publisher | Email from publisher confirming ISBN or title |
| `phone_confirmation` | Verbal confirmation via phone call | Phone call log with publisher representative |
| `isbn_agency` | ISBN allocation agency records | International ISBN Agency, Bangladesh ISBN Agency |
| `book_fair_catalog` | Printed or digital book fair catalog | Ekushey Boi Mela catalog, Frankfurt Book Fair catalog |
| `publisher_document` | Physical document provided by publisher | Signed letter, brochure, promotional material |
| `social_media` | Social media post or profile | Facebook page, Twitter/X post, LinkedIn profile |
| `news_article` | News media coverage | Newspaper article, online news report |
| `manual_entry` | Manual data entry by authorized operator | Operator data entry with no specific external URL |
| `community_submission` | Community-contributed data | User-submitted book information via web form |
| `other` | Any other source type not covered above | Library catalog, third-party database (with permission) |

## Rules

1. **Every record must have at least one source link.** No record may be created without a corresponding entry in the `sources` table.

2. **Source must be captured at time of entry.** The source reference (type, identifier, timestamp, collector identity) must be recorded in the same transaction as the fact itself. Retroactive source attribution is not permitted except through formal correction workflows.

3. **Source cannot be deleted if referenced.** A source record is immutable once at least one fact references it. Deletion of an unreferenced source is permitted only by database administrators.

4. **Primary sources take precedence.** When conflicting information exists, the fact attributed to a primary source overrides secondary sources unless overwhelming evidence supports the secondary claim.

5. **Source URLs must be stable.** Where possible, capture permalinks, archive.org snapshots, or uploaded document copies rather than ephemeral URLs.

6. **Hearsay must be explicitly flagged.** Any fact derived from hearsay must have its source typed as `community_submission` or `other` and must have a confidence level of 20 or below.

## Examples

### Publisher Record with Official Website Source

```json
{
  "publisher": {
    "name_bn": "প্রকাশনী",
    "name_en": "Prokashoni",
    "slug": "prokashoni"
  },
  "sources": [
    {
      "type": "official_website",
      "reference": "https://www.prokashoni.com",
      "captured_at": "2026-06-15T10:30:00Z",
      "captured_by": "operator_aj"
    }
  ]
}
```

### Book Record with ISBN Agency Source

```json
{
  "book": {
    "title_bn": "আমার দেখা বাংলা",
    "title_en": "Amar Dekha Bangla",
    "isbn": "9789841234567",
    "publisher_slug": "prokashoni"
  },
  "sources": [
    {
      "type": "isbn_agency",
      "reference": "https://isbn.bangladesh.gov.bd/details/9789841234567",
      "captured_at": "2026-06-20T14:00:00Z",
      "captured_by": "operator_bk"
    }
  ]
}
```

### Phone Confirmation Source

```json
{
  "source": {
    "type": "phone_confirmation",
    "reference": "call_log_20260615_aj_prokashoni",
    "notes": "Spoke with Mr. Rahman, General Manager. Confirmed publisher address and phone number.",
    "captured_at": "2026-06-15T11:45:00Z",
    "captured_by": "operator_aj"
  }
}
```

## Future Considerations

- **Blockchain-based provenance tracking**: Implement an immutable audit trail using distributed ledger technology to provide cryptographic proof of data origin and history.
- **Automated source verification**: Develop automated systems that verify source URLs are still accessible, validate domain ownership, and flag stale or broken references.
- **Source reputation scoring**: Assign reputation scores to source types and specific sources over time based on historical accuracy, enabling automated trust weighting.
- **Provenance API**: Expose provenance data through a public API so that downstream consumers can independently verify the chain of custody for any fact in the system.
