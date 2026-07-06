# Data Collection Guide

## Purpose

Provide standard procedures for data collection across all entry points into the tProkash publishing ecosystem. This guide ensures consistency, accuracy, and completeness of all data contributed by operators, community members, and automated processes.

## Scope

This guide applies to all data entry operators, community contributors, bulk import processes, and automated collection scripts that add data to the tProkash database. All roles are expected to follow these procedures regardless of experience level.

## Definitions

- **Primary Research**: Collecting data directly from the original or authoritative source (e.g., visiting a publisher's official website, calling the publisher, checking government registry).
- **Secondary Research**: Collecting data from sources that report or compile information from primary sources (e.g., news articles, book fair catalogs, library databases).
- **Data Entry**: Manual input of data by a human operator through the tProkash data entry interface.
- **Bulk Import**: Programmatic ingestion of data from structured files (CSV, JSON, XML) or external databases, subject to import validation rules.

## Rules

1. **Prefer official sources over unofficial.** Always prioritize official publisher websites, government registries, and ISBN agency records over social media, forums, or third-party databases.

2. **Capture source URL or document reference at time of entry.** Every fact entered must have a corresponding source record. Do not defer source capture.

3. **Do not fabricate or guess data.** If you do not know a value, leave it blank rather than inventing it. Missing data is preferable to incorrect data.

4. **Mark uncertain values explicitly.** If you are unsure about a particular value, flag it with a note or mark it as uncertain in the entry form.

5. **Record bilingual names (Bengali + English) where available.** Every named entity must have both Bengali and English names when both are available from the source. If only one language is available, leave the other blank rather than using transliteration tools.

6. **Verify publisher name against official registry.** Before creating a new publisher record, check whether the publisher is already registered in the system or in the government publisher registry to avoid duplicates.

7. **ISBN must be validated for check digit.** The ISBN-13 check digit must be mathematically validated at the time of entry. Entries with invalid ISBNs will be rejected.

8. **Do not copy from other databases without permission.** Direct copying from proprietary databases, competitor platforms, or any source that does not grant redistribution rights is prohibited.

9. **Do not enter duplicate records.** Always search the database before creating a new record. If a match is found, update the existing record instead.

10. **Record access dates.** When collecting data from a website or online source, record the date and time of access.

## Collection Priorities

| Priority | Data Type | Rationale |
|---|---|---|
| **High** | ISBN, Publisher Name (official), Book Title | Core identifying data; errors here cause cascading failures |
| **Medium** | Book Title (bilingual), Author Name, Edition, Publication Date | Important for discovery and disambiguation |
| **Low** | Social Media Links, Price History, Cover Image URLs | Supplementary; can be added later without system impact |
| **Optional** | Translator, Editor, Illustrator, Format (paperback/hardcover), Page Count | Valuable but not blocking for publication |

## Examples

### Step-by-Step: Collecting a New Publisher Entry

1. **Search for existing publisher.** Use the search form with both English and Bengali name variants. If found, update the existing record instead of creating a duplicate.

2. **Identify the official website.** Search for the publisher's official website. Verify domain ownership through WHOIS or official publications.

3. **Collect name variants.**
   - Bengali name: Visit the publisher's Bengali-language page.
   - English name: Visit the publisher's English-language page or official correspondence.
   - If only one is found, enter that and leave the other blank.

4. **Capture address and contact information.**
   - Address: Copy exactly as listed on the official website.
   - Phone/Email: Verify by cross-referencing with multiple pages.

5. **Create source record.**
   ```json
   {
     "type": "official_website",
     "reference": "https://www.prokashoni.com/contact",
     "captured_at": "2026-07-06T14:30:00Z",
     "captured_by": "operator_aj"
   }
   ```

6. **Submit as draft.** The record enters as `draft` status. It will be reviewed by a verifier before publication.

### Step-by-Step: Collecting a New Book Entry

1. **Search for existing book.** Use ISBN if available. If no ISBN, use title + author combination.

2. **Validate ISBN.** Calculate the check digit. If the ISBN fails validation, flag it and do not enter it as authoritative.

3. **Determine source priority.**
   - If ISBN is from ISBN agency: high confidence.
   - If ISBN is from publisher website: medium confidence.
   - If ISBN is from user submission: low confidence.

4. **Collect bilingual title.**
   - Bengali title from the book cover or publisher site.
   - English title from copyright page or official listing.

5. **Enter edition information.** Check the copyright page for edition number, publication year, and printing information.

6. **Attach cover image (optional).** If permitted by the source, download the cover image and upload. Note the source URL.

7. **Create source record.**
   ```json
   {
     "type": "isbn_agency",
     "reference": "https://isbn.bangladesh.gov.bd/details/9789841234567",
     "captured_at": "2026-07-06T15:00:00Z",
     "captured_by": "operator_aj"
   }
   ```

8. **Submit as draft.**

## Future Considerations

- **Mobile collection app**: Develop a mobile application for collecting data at book fairs, publisher offices, and other physical locations, with offline support and photo capture.
- **OCR for book fair catalogs**: Automate extraction of book and publisher data from scanned book fair catalogs using optical character recognition.
- **Web scraper with validation**: Build automated web scrapers that collect data from authorized sources with built-in validation and confidence scoring.
- **Bulk import templates**: Provide standardized CSV/JSON templates with validation rules for publishers submitting their own catalog data.
