# Data Quality Standard

## Purpose

Define measurable quality standards for all data in the tProkash publishing ecosystem, establish quality targets, and provide a framework for continuous quality monitoring and improvement. This standard ensures that data consumers can rely on the accuracy, completeness, and consistency of the information they access.

## Scope

This standard applies to all data in the production database, including publisher records, book listings, author profiles, edition metadata, translations, and any supplementary data. It covers both newly ingested data and existing historical data. Quality metrics are calculated at the record level and aggregated for system-wide reporting.

## Definitions

- **Accuracy**: The degree to which data correctly reflects the real-world entity it represents, as confirmed by an authoritative source.
- **Completeness**: The extent to which all required and recommended fields are populated with non-null values.
- **Consistency**: The degree to which data conforms to defined naming conventions, formats, and structural rules across the database.
- **Timeliness**: The proportion of records that have been updated or verified within a defined time window after a real-world change occurred.
- **Uniqueness**: The absence of duplicate records representing the same real-world entity.
- **Uniqueness**: The absence of duplicate records representing the same real-world entity.
- **Validity**: The proportion of records that pass all defined constraint and format validation rules.

## Quality Dimensions with Metrics

### Accuracy

- **Metric**: Percentage of sampled records whose values match the authoritative source.
- **Target**: >95%
- **Measurement Method**: Monthly random sampling of 500 records, cross-referenced against official sources. Automated accuracy checks where authoritative APIs are available.
- **Enforcement**: Data entry validation on core fields (ISBN, publisher name).

### Completeness

- **Metric**: Percentage of required fields populated across all records.
- **Target**: >90%
- **Required Fields**: `name_bn`, `name_en`, `slug` on all major entities. `isbn` on book records. `publisher_id` on edition records.
- **Measurement Method**: Automated query calculating null rate for required fields.
- **Enforcement**: System prevents submission of records missing required fields (draft allowed, but submission to pending blocked).

### Consistency

- **Metric**: Percentage of records following naming conventions and format standards.
- **Target**: >98%
- **Conventions**: Bengali names in Unicode, English names in ASCII, slugs in kebab-case, dates in ISO 8601.
- **Measurement Method**: Automated pattern matching and format validation.
- **Enforcement**: Validation rules at entry and import time.

### Timeliness

- **Metric**: Percentage of records updated or re-verified within 30 days of a confirmed real-world change.
- **Target**: >85%
- **Measurement Method**: Comparison of record `updated_at` dates against known change events captured through monitoring sources.
- **Enforcement**: Quarterly review of stale records; automated notifications for records that have not been updated in 12+ months.

### Uniqueness

- **Metric**: Percentage of records without confirmed duplicates.
- **Target**: >99%
- **Measurement Method**: Automated duplicate detection based on fuzzy matching of names, ISBN exact match, and cross-field similarity scoring.
- **Enforcement**: Duplicate detection runs on every new record creation; operators are prompted when a potential duplicate is detected.

### Validity

- **Metric**: Percentage of records passing all constraint validations.
- **Target**: 100%
- **Constraints**: ISBN check digit, email format, slug uniqueness, numeric range enforcement, date format.
- **Measurement Method**: Automated constraint checks run on every write operation.
- **Enforcement**: Writes that violate constraints are rejected with error messages.

## Rules

1. **Required fields: `name_bn`, `name_en`, `slug` on all major entities.** These three fields must be populated for a record to be submitted from `draft` to `pending`. Partial records may exist in `draft` but cannot progress without these fields.

2. **Bilingual requirement: every named entity must have both Bengali and English names.** If only one language name is available from the source, the other may be left blank temporarily, but must be populated before the record can reach `verified` status. Transliteration is not permitted as a substitute for authentic names.

3. **ISBN must pass check digit validation.** The system implements the standard ISBN-13 check digit algorithm. Any ISBN that fails validation is rejected at the point of entry. Operators may enter an ISBN with a note if they suspect it is a valid but unknown ISBN variant.

4. **Email fields must contain @.** Email validation checks for the presence of exactly one `@` symbol and a valid domain part. Invalid email addresses are rejected.

5. **Slug must be URL-safe and unique.** Slugs are auto-generated from the English name but may be manually overridden. Duplicate slug detection is enforced globally across all entity types.

6. **Numeric ranges must be enforced.** Rating fields are constrained to 1-5. Quantity fields must be >= 0. Page counts must be > 0. Year fields must be within a reasonable range (1800 to current year + 1).

7. **Consistency checks across related records.** If a book references a publisher, the publisher's name in the book record should match the publisher's canonical name. Discrepancies are flagged for review.

## Quality Reporting

- **Monthly Quality Dashboard**: A report published on the first business day of each month showing aggregate scores for each quality dimension, trend lines, and top improvement opportunities.
- **Automated Constraint Checks**: Every write operation (create, update, import) triggers constraint validation. Violations are logged and reported to the operator in real time.
- **Quality Score per Record**: Each record has a computed quality score (0-100) based on a weighted combination of the six quality dimensions. Records below a configurable threshold (default: 60) are flagged for review.
- **Quarterly Quality Review**: A comprehensive review of data quality processes, targets, and performance, conducted by the data governance team.

## Examples

### Quality Score Calculation for a Publisher Record

Record: Publisher "Bangla Academy"

| Dimension | Score | Weight | Weighted Score |
|---|---|---|---|
| Accuracy | 100 (confirmed via government registry) | 30% | 30.0 |
| Completeness | 80 (10 of 12 fields populated) | 20% | 16.0 |
| Consistency | 100 (follows all naming conventions) | 15% | 15.0 |
| Timeliness | 90 (updated within last 30 days) | 15% | 13.5 |
| Uniqueness | 100 (no duplicates found) | 10% | 10.0 |
| Validity | 100 (all constraints pass) | 10% | 10.0 |
| **Total** | | **100%** | **94.5** |

Quality Score: 94.5 / 100 (Excellent)

### Field Validation Examples

| Field | Valid Value | Invalid Value | Rejection Reason |
|---|---|---|---|
| isbn | 9789841234567 | 9789841234568 | Check digit mismatch (last digit should be 7, got 8) |
| slug | bangla-academy | Bangla Academy | Contains uppercase letters and spaces; must be kebab-case |
| email | info@banglaacademy.gov.bd | info @ banglaacademy | Multiple spaces and missing domain |
| rating | 4 | 6 | Out of range (1-5) |
| publication_year | 2026 | 1799 | Below minimum year threshold (1800) |

## Future Considerations

- **Automated data quality monitoring**: Deploy continuous monitoring systems that track quality metrics in real time and send alerts when scores fall below thresholds.
- **ML-based anomaly detection**: Train machine learning models on historical data patterns to detect anomalous values (e.g., a publisher name that doesn't match the expected pattern for its geographic region).
- **Data quality SLAs**: Define service-level agreements for data quality with external data consumers, including guaranteed minimum scores for specific data sets.
- **Quality-driven data pricing**: If tProkash offers paid data access, implement pricing tiers based on data quality scores, with higher-quality data commanding premium pricing.
