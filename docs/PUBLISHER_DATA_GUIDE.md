# Publisher Data Guide

**Version:** 1.0.0\
**Status:** Approved

---

## Purpose

A practical guide for data operators who collect, enter, and maintain Publisher records. This guide explains what each field means and how to populate it correctly.

## Field-by-Field Guide

### publisher_id

System-generated. Do not invent. The format is `PUB-` followed by 10 random alphanumeric characters. Example: `PUB-A1B2C3D4E5`.

### legal_name_bn (Required)

The publisher's full legal name in Bengali as registered with the government or trade license. This is not necessarily the name on the book cover (use display_name for that).

- **Source:** Trade license, government registry, official website
- **Example:** "সময় প্রকাশন"
- **Rules:** Must contain at least one Bengali character

### legal_name_en (Required)

The publisher's full legal name in English. If the publisher has no official English name, provide a transliteration.

- **Source:** Trade license, official website
- **Example:** "Somoy Prokash"
- **Rules:** Must contain Latin characters only

### display_name (Required)

The name shown publicly in the directory. Usually matches the trade name. May differ from legal name if the publisher trades under a different brand.

- **Source:** Book covers, publisher website, common usage
- **Example:** "সময় প্রকাশন" or "Somoy Prokash"
- **Rules:** Choose the most commonly used name

### trade_name_bn / trade_name_en (Recommended)

The name the publisher uses for business. May differ from legal name. Example: a publisher registered as "ABC Publications Ltd." might trade as "ABC Prokash".

### slug (Recommended)

URL-friendly version of the display_name. Auto-generated from display_name_en. Lowercase with hyphens.

- **Example:** `somoy-prokash`
- **Rules:** Must be unique

### registration_number (Optional)

The publisher's trade license or government registration number issued by the appropriate authority in Bangladesh.

### bin (Optional)

Business Identification Number issued by the Bangladesh National Board of Revenue. 9 or 13 digits.

### tin (Optional)

Tax Identification Number issued by the Bangladesh National Board of Revenue. 11 or 13 digits.

### isbn_prefix (Optional)

The publisher prefix assigned by the ISBN Agency Bangladesh. This is used when registering ISBNs for books.

### website_url (Recommended)

The publisher's official website. Always use HTTPS if available.

- **Format:** `https://example.com`
- **Normalization:** Remove trailing slash, lowercase domain

### founded_year (Recommended)

The year the publisher was founded. Use the year from the trade license or official records. Do not guess.

### status (Recommended)

One of: active, inactive, defunct, suspended. Default is active. Change only when confirmed.

### description_bn / description_en (Recommended)

A brief description of the publisher: what they publish, specialties, history. 2-3 sentences. Written in third person.

### logo_url (Recommended)

URL to the publisher's logo image. Supported formats: JPG, PNG, GIF, SVG, WebP.

### services (Recommended)

Comma-separated list of services from the approved services list (see publisher-services.md). Only include services the publisher explicitly offers.

### verification_status (Required)

Set to "draft" for new entries. Changes through the verification workflow.

### primary_contact / primary_email / primary_phone (Recommended)

Main contact information. Use business contact details, not personal. Obtain permission before publishing contact information.

### address fields (Recommended / Optional)

The publisher's physical business address. Use the head office address. City and country are recommended; street address is optional.

### social_media_links (Optional)

JSON object of social media platform URLs:

```json
{
  "facebook": "https://facebook.com/example",
  "twitter": "https://twitter.com/example"
}
```

## Common Mistakes

1. **Using display_name for legal_name:** The legal name must match the government registration.
2. **Leaving name_en blank:** English transliteration is required even for Bengali-only publishers.
3. **Fabricating founded_year:** Leave blank rather than guessing.
4. **Copying from other databases:** Always verify against the original source.
5. **Mixing active and defunct:** Verify the publisher is still operating before marking active.

## Related

- Collection checklist: `docs/PUBLISHER_COLLECTION_CHECKLIST.md`
- Publisher standard: `specifications/publisher-standard.md`
