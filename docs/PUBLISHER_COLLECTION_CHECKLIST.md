# Publisher Collection Checklist

**Version:** 1.0.0\
**Status:** Approved

---

## Purpose

Step-by-step checklist for data operators collecting a new Publisher record. Complete all items before submitting for verification.

## Pre-Collection

- [ ] Confirm the entity is a book publisher (not a printing press only, not a bookstore)
- [ ] Identify the source type (see source types in DATA_PROVENANCE_STANDARD.md)
- [ ] Open the source and confirm it is accessible
- [ ] Prepare the publisher template: `data/templates/publisher.template.json`

## Required Fields

- [ ] publisher_id — system-generated or use import tool
- [ ] legal_name_bn — verified against source
- [ ] legal_name_en — verified against source
- [ ] display_name — entered
- [ ] verification_status — set to "draft"
- [ ] created_at — auto-populated
- [ ] updated_at — auto-populated

## Source Attachment

- [ ] Source record created in `data/sources/`
- [ ] Entity-source link established
- [ ] Source type correctly classified
- [ ] Source URL or document reference recorded

## Bilingual Check

- [ ] Bengali name contains Bengali script characters
- [ ] English name is proper transliteration
- [ ] Both names refer to the same entity

## Contact Information

- [ ] At least one contact method collected (email or phone)
- [ ] Permission obtained if contact will be public
- [ ] Contact recorded in `contact_method` format

## Address (if available)

- [ ] City recorded
- [ ] Country recorded (default BD)
- [ ] Street address recorded (if available)

## Business Details

- [ ] website_url collected (if exists)
- [ ] founded_year collected from reliable source (not guessed)
- [ ] status determined (default: active)
- [ ] services identified from approved list
- [ ] registration_number or BIN/TIN collected (if available)
- [ ] ISBN publisher prefix collected (if known)

## Verification of Website

- [ ] Website loads successfully
- [ ] Website clearly identifies the publisher
- [ ] Website domain matches publisher name
- [ ] Website has HTTPS (note if not)

## Duplicate Check

- [ ] Searched existing records for same legal_name_en
- [ ] Searched existing records for same website_url
- [ ] Fuzzy-matched similar names in same city
- [ ] Confirmed this is not a duplicate

## Final Checks

- [ ] All fields reviewed for accuracy
- [ ] Source reference complete
- [ ] Notes field populated with any caveats
- [ ] File saved correctly in JSON format
- [ ] Ready to submit for verification

## Post-Collection

- [ ] Import the record following `scripts/import-workflow.md`
- [ ] Set verification_status to "pending" for review
- [ ] Record collection in the daily log

## Related

- Data guide: `docs/PUBLISHER_DATA_GUIDE.md`
- Import workflow: `scripts/import-workflow.md`
- Publisher standard: `specifications/publisher-standard.md`
