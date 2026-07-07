---
title: Media Asset Framework
status: Draft
number: RFC-0009
version: 0.1
authors:
  - tbd
created: 2026-07-06
---

# RFC-0009: Media Asset Framework

## 1. Vision

A **Media Asset** inside tProkash is any digital file — image, document,
audio, video, archive, dataset, or binary — that is referenced by one or
more domain entities. Assets are the visual, documentary, and creative
substance of the platform: logos, book covers, contracts, certificates,
manuscripts, marketing materials, and more.

The Media Asset Framework provides a unified system for storing,
serving, versioning, transforming, and securing every file in the
platform. It decouples file storage from domain logic so that any entity
— Organization, Publisher, Author, Book, Edition, Verification,
Documentation — can reference assets without worrying about where or how
they are stored.

Assets are:

- **Immutable by default** — Once stored, a file cannot be modified.
  Changes create new versions.
- **Content-addressed** — Files are identified and deduplicated by their
  cryptographic hash.
- **Storage-abstracted** — Local filesystem, object storage (S3,
  MinIO), cloud storage (GCS, Azure Blob), and CDN are pluggable
  backends behind a uniform interface.
- **Derivable** — Thumbnails, previews, and optimised variants are
  generated automatically and linked to the original.
- **Access-controlled** — Visibility is per-asset (public, private,
  internal) and enforced at the serving layer.
- **Metadata-rich** — Every asset carries extensible metadata that can
  be enhanced by future AI services without schema changes.

## 2. Goals

- Define a universal Media Asset model that any domain entity can
  reference.
- Support **7 asset categories** (Image, Document, Audio, Video,
  Archive, Dataset, Other) and **extensible asset types** within each
  category.
- Make assets **immutable and content-addressed**: each file is stored
  once, identified by its SHA-256 hash, and never overwritten.
- Support **versioning**: updated files create new asset versions. The
  version history is immutable and append-only.
- Define a **derivative system** for automatic generation of
  thumbnails, previews, and format-optimised variants.
- Provide a **storage abstraction** that supports local filesystem,
  S3-compatible object storage, Google Cloud Storage, Azure Blob
  Storage, and CDN distributions without changing domain code.
- Define **access control** at the asset level (public, private,
  internal) with signed URLs for controlled access to private assets.
- Support **extensible metadata** that can be enriched by AI services
  (content moderation, object detection, OCR text, embeddings) without
  schema changes.
- Define asset lifecycle, retention, archival, and compliance policies.

## 3. Non-Goals

- Implement storage drivers, CDN integrations, or file processing
  pipelines.
- Define REST endpoints or GraphQL resolvers for asset upload/download.
- Create UI components (file pickers, uploaders, galleries, viewers).
- Implement the derivative generation service (thumbnailer, transcoder).
- Define specific image processing libraries or video codecs.
- Implement malware scanning or content moderation (designed to
  accommodate them).
- Implement full-text search within document contents.
- Define file upload size limits or bandwidth quotas (deployment
  configuration).
- Implement real-time synchronisation between storage backends.
- Define a full digital rights management (DRM) system.

## 4. Media Asset Model

### Core Asset Record

```jsonc
{
  "id": "uuid",
  "category": "IMAGE | DOCUMENT | AUDIO | VIDEO | ARCHIVE | DATASET | OTHER",
  "type": "AssetType",
  "label": "string?",
  "description": "string?",
  "filename": "original_filename.pdf",
  "extension": "pdf",
  "mimeType": "application/pdf",
  "size": 1048576,
  "hash": {
    "algorithm": "SHA-256",
    "value": "abc123def456..."
  },
  "width": 1920,
  "height": 1080,
  "duration": 120.5,
  "language": "en",
  "metadata": {},
  "derivatives": ["AssetDerivative"],
  "versions": ["AssetVersion"],
  "currentVersion": 3,
  "storage": {
    "backend": "s3",
    "bucket": "tprokash-assets",
    "key": "ab/cd/abcdef...",
    "region": "us-east-1",
    "endpoint": "https://s3.amazonaws.com"
  },
  "cdn": {
    "url": "https://cdn.tprokash.com/assets/abcdef...",
    "enabled": true,
    "purgedAt": "datetime?"
  },
  "checksum": {
    "algorithm": "SHA-256",
    "value": "abc123def456..."
  },
  "status": "ACTIVE | ARCHIVED | DELETED",
  "visibility": "PUBLIC | PRIVATE | INTERNAL",
  "audit": "AuditMetadata"
}
```

| Field | Description |
|-------|-------------|
| `category` | High-level category of the asset. |
| `type` | Specific type within the category (extensible enum). |
| `filename` | Original filename at time of upload. |
| `hash` | SHA-256 hash of the file content. Used for deduplication and integrity. |
| `width` / `height` | Dimensions (images, video). |
| `duration` | Duration in seconds (audio, video). |
| `language` | BCP-47 language tag for document/text assets. |
| `metadata` | Extensible metadata object (see Section 11). |
| `derivatives` | Automatically generated variants (see Section 10). |
| `versions` | Version history (see Section 9). |
| `storage` | Storage backend and path (abstracted, see Section 16). |
| `cdn` | CDN serving information (optional, see Section 16). |
| `checksum` | Repeat of `hash` for clarity in API shapes. Both refer to the same value. |
| `status` | Current lifecycle state. |
| `visibility` | Access control level. |

## 5. Asset Categories

| Category | Code | Description |
|----------|------|-------------|
| **Image** | `IMAGE` | Raster images (JPEG, PNG, WebP, GIF, AVIF, TIFF). |
| **Document** | `DOCUMENT` | Documents (PDF, DOCX, XLSX, PPTX, TXT, RTF, ODF). |
| **Audio** | `AUDIO` | Audio files (MP3, WAV, FLAC, AAC, OGG). |
| **Video** | `VIDEO` | Video files (MP4, WebM, AVI, MOV, MKV). |
| **Archive** | `ARCHIVE` | Compressed archives (ZIP, TAR, GZ, 7Z, RAR). |
| **Dataset** | `DATASET` | Structured data files (CSV, JSON, XML, Parquet). |
| **Other** | `OTHER` | Any type not covered by the above categories. |

Categories are a closed enum (not extensible). Asset types within each
category are extensible (see Section 6).

## 6. Asset Types

Asset types are specific kinds of files within each category. The list
is extensible per deployment and per module.

| Category | Asset Type | Description |
|----------|------------|-------------|
| IMAGE | `LOGO` | Organization or publisher logo. |
| IMAGE | `COVER` | Book or edition cover image. |
| IMAGE | `PROFILE_PHOTO` | User or author profile photograph. |
| IMAGE | `BANNER` | Banner image for profiles, events, or promotions. |
| IMAGE | `THUMBNAIL` | Automatically generated thumbnail. |
| IMAGE | `PREVIEW` | Low-resolution preview. |
| IMAGE | `SCREENSHOT` | Screenshot of a website, application, or document. |
| IMAGE | `PHOTOGRAPH` | Photograph of a person, place, or event. |
| IMAGE | `ILLUSTRATION` | Illustration, drawing, or graphic. |
| IMAGE | `ICON` | Icon or favicon. |
| IMAGE | `QR_CODE` | QR code for ISBN, URL, or identifier. |
| IMAGE | `OTHER_IMAGE` | Other image type. |
| DOCUMENT | `CERTIFICATE` | Verification certificate, accreditation document. |
| DOCUMENT | `CONTRACT` | Signed contract or agreement. |
| DOCUMENT | `ISBN_DOCUMENT` | ISBN registration or prefix document. |
| DOCUMENT | `MANUSCRIPT` | Book manuscript or draft. |
| DOCUMENT | `MARKETING_MATERIAL` | Brochure, catalogue, promotional material. |
| DOCUMENT | `LICENCE` | Business licence or permit. |
| DOCUMENT | `REGISTRATION_DOC` | Business or organisation registration document. |
| DOCUMENT | `TAX_DOCUMENT` | Tax certificate, TIN document. |
| DOCUMENT | `LEGAL_DOCUMENT` | Legal filing, memorandum, article of incorporation. |
| DOCUMENT | `REPORT` | Annual report, audit report, compliance report. |
| DOCUMENT | `POLICY` | Policy document, terms of service, privacy policy. |
| DOCUMENT | `BRAND_GUIDELINE` | Brand style guide or asset usage guide. |
| DOCUMENT | `OTHER_DOCUMENT` | Other document type. |
| AUDIO | `AUDIOBOOK` | Full audiobook recording. |
| AUDIO | `SAMPLE` | Audio sample or excerpt. |
| AUDIO | `INTERVIEW` | Interview recording. |
| AUDIO | `PODCAST` | Podcast episode. |
| AUDIO | `OTHER_AUDIO` | Other audio type. |
| VIDEO | `TRAILER` | Book trailer or promotional video. |
| VIDEO | `INTERVIEW_VIDEO` | Video interview. |
| VIDEO | `EVENT_RECORDING` | Event, launch, or signing recording. |
| VIDEO | `TUTORIAL` | Instructional or tutorial video. |
| VIDEO | `OTHER_VIDEO` | Other video type. |
| ARCHIVE | `SOURCE_FILES` | Source files for a publication (InDesign, LaTeX, etc.). |
| ARCHIVE | `RAW_IMAGES` | Raw, unprocessed image files. |
| ARCHIVE | `BACKUP` | Backup archive. |
| ARCHIVE | `OTHER_ARCHIVE` | Other archive type. |
| DATASET | `METADATA_EXPORT` | Exported metadata (CSV, JSON). |
| DATASET | `ANALYTICS_DATA` | Analytics or usage data. |
| DATASET | `REFERENCE_DATA` | Reference or lookup data. |
| DATASET | `OTHER_DATASET` | Other dataset type. |

## 7. Ownership Model

An asset may belong to one or more entities.

### Principles

- **Many-to-many**: An asset may be referenced by multiple entities. A
  single logo image may be used by an Organization, a Publisher, and a
  Bookstore.
- **Owner-agnostic storage**: The asset record does not embed ownership.
  Ownership is recorded through relationship records (see Section 21).
- **Primary owner**: Each asset-reference relationship may designate a
  primary owner. The primary owner controls the asset's visibility and
  lifecycle.
- **Reference metadata**: Each relationship records the asset type as
  used by that entity (e.g., Organization uses logo as LOGO, Publisher
  uses the same logo as LOGO).
- **Orphaned assets**: Assets with no remaining references may be
  eligible for automatic archival or deletion after a configurable grace
  period.

### Example

```
Asset: penguin_logo.png (IMAGE/LOGO)
    ├── Organization: Penguin Random House (type: LOGO, primary: true)
    ├── Publisher: Penguin Books (type: LOGO, primary: false)
    └── Publisher: Puffin Books (type: LOGO, primary: false)
```

## 8. Asset Lifecycle

```
UPLOADED → ACTIVE → ARCHIVED → DELETED
                └──→ DELETED (from ACTIVE only in exceptional cases)
```

| State | Description |
|-------|-------------|
| **UPLOADED** | The file has been uploaded but is not yet fully processed. Derivative generation may be in progress. |
| **ACTIVE** | The asset is fully processed and available. |
| **ARCHIVED** | The asset is retained but not served through normal API responses. May be restored to ACTIVE. |
| **DELETED** | The file has been purged from storage. The asset record (metadata, hash) is retained for audit. |

### Transition Rules

- UPLOADED → ACTIVE: Automatic when all processing (derivative
  generation, malware scan) completes successfully.
- UPLOADED → DELETED: If processing fails irrecoverably or the upload
  is cancelled.
- ACTIVE → ARCHIVED: After a configurable period of no references, or
  by explicit Administrator action.
- ARCHIVED → ACTIVE: Restorable by Administrator.
- ACTIVE → DELETED: Administrator-only. Only when the file must be
  removed for legal or compliance reasons.
- ARCHIVED → DELETED: Administrator-only, after retention period
  expires.

## 9. Versioning Strategy

Assets are immutable by default. When a new version of an asset is
uploaded, it creates a new asset record linked to the previous version.

### Version Model

```jsonc
{
  "version": 3,
  "assetId": "uuid",
  "previousVersion": "uuid?",
  "nextVersion": "uuid?",
  "hash": "SHA-256:abc123...",
  "size": 2048576,
  "filename": "logo-v3.png",
  "createdAt": "datetime",
  "createdBy": "uuid",
  "reason": "REBRAND | UPDATE | CORRECTION | OTHER"
}
```

### Principles

- The asset record always points to the current version.
- Historical versions are accessible via the version chain.
- Versions are immutable. A version record is never modified after
  creation.
- An asset with multiple versions is considered the same logical asset
  for relationship purposes (all versions are accessible to referencing
  entities).
- Version history is append-only. Versions are never deleted.
- Previous versions of PUBLIC assets remain accessible at their
  specific version URL.

### Version Reasons

| Reason | Description |
|--------|-------------|
| `INITIAL` | The first version of the asset. |
| `UPDATE` | General update or replacement. |
| `REBRAND` | Branding or design change. |
| `CORRECTION` | Error correction (wrong file uploaded). |
| `FORMAT_CHANGE` | File format migration. |
| `RESIZE` | Resized or optimised version. |
| `OTHER` | Other reason. |

## 10. Derivative Assets

Derivatives are automatically generated variants of the original asset.

### Derivative Types

| Type | Source Category | Description |
|------|-----------------|-------------|
| `THUMBNAIL_SMALL` | IMAGE | Small thumbnail (e.g., 150×150). |
| `THUMBNAIL_MEDIUM` | IMAGE | Medium thumbnail (e.g., 300×300). |
| `THUMBNAIL_LARGE` | IMAGE | Large thumbnail (e.g., 600×600). |
| `PREVIEW` | IMAGE, DOCUMENT | Low-resolution preview for fast loading. |
| `OPTIMIZED` | IMAGE | Format-optimized variant (e.g., WebP from PNG). |
| `PDF_PREVIEW` | DOCUMENT | First-page preview image generated from PDF. |
| `AUDIO_SAMPLE` | AUDIO | Short audio clip preview (e.g., 30 seconds). |
| `VIDEO_THUMBNAIL` | VIDEO | Thumbnail image extracted from video frame. |
| `VIDEO_PREVIEW` | VIDEO | Low-resolution video preview. |
| `TRANSCODED` | AUDIO, VIDEO | Transcoding to alternative format or codec. |
| `OCR_TEXT` | DOCUMENT, IMAGE | Extracted text from OCR processing. |
| `CUSTOM` | ANY | Extensible custom derivative type. |

### Derivative Model

```jsonc
{
  "id": "uuid",
  "type": "DerivativeType",
  "sourceAssetId": "uuid",
  "sourceVersion": 3,
  "asset": "Asset (full record of the derivative)",
  "generatedAt": "datetime",
  "generatedBy": "system",
  "status": "PENDING | COMPLETED | FAILED"
}
```

### Principles

- Derivatives are themselves full Asset records with their own hashes,
  storage paths, and metadata.
- A derivative references its source asset and source version.
- Derivatives are generated asynchronously after the source asset is
  uploaded.
- If derivative generation fails, the source asset remains ACTIVE
  (derivative failure does not block the asset).
- Derivatives inherit the visibility of their source asset.
- Derivative records are immutable. If a new source version is created,
  new derivatives are generated.

## 11. Metadata Model

Metadata is an extensible key-value store attached to every asset.

### Structure

```jsonc
{
  "metadata": {
    "system": {
      "width": 1920,
      "height": 1080,
      "duration": 120.5,
      "colorSpace": "sRGB",
      "dpi": 300,
      "pages": 42,
      "bitrate": 192000
    },
    "descriptive": {
      "title": "Penguin Random House Logo 2026",
      "altText": "Penguin Random House corporate logo on white background",
      "caption": "Official logo as of January 2026",
      "credit": "Design by PRH Brand Studio",
      "copyright": "© 2026 Penguin Random House"
    },
    "ai": {
      "tags": ["logo", "penguin", "corporate", "blue", "white"],
      "objects": ["penguin", "text"],
      "textDetected": "Penguin Random House",
      "moderation": {
        "safe": true,
        "categories": {},
        "scores": {}
      },
      "embedding": "model:openai-v3,vector:[0.123, 0.456, ...]"
    },
    "custom": {
      "projectCode": "PRH-2026-001",
      "internalNotes": "Approved by legal on 2026-01-15"
    }
  }
}
```

### Metadata Sections

| Section | Description | Populated By |
|---------|-------------|--------------|
| `system` | Automatically extracted technical metadata (dimensions, duration, etc.). | System on upload. |
| `descriptive` | Human-curated descriptive metadata (title, alt text, caption, credit, copyright). | Uploader or Administrator. |
| `ai` | AI-generated metadata (tags, object detection, OCR, moderation scores, embeddings). | Future AI services (architecture placeholder). |
| `custom` | Arbitrary custom key-value pairs for deployment-specific or module-specific needs. | Any authorised actor. |

### Principles

- Metadata is extensible at all sections. New fields can be added
  without schema changes.
- The `ai` section is a placeholder for future AI services. No AI
  processing is required by the framework.
- Metadata is versioned alongside the asset. Each asset version may
  have different metadata.
- Metadata is searchable through the Search framework.

## 12. MIME Type Handling

MIME types are used to determine processing requirements and serving
headers.

### Storage Rules

- The MIME type is detected on upload (from file extension and/or
  content inspection).
- If the uploaded MIME type does not match the detected content, the
  detected content type takes precedence.
- Unknown or ambiguous MIME types are stored as provided with an
  `UNDETECTED` flag.

### Content Negotiation (Future)

The serving layer may support content negotiation:

- Accept image/avif → serve AVIF derivative.
- Accept image/webp → serve WebP derivative.
- Fallback → serve original.

### Allow List

Each deployment may configure a MIME type allow list for uploads.
Types not on the allow list are rejected.

## 13. File Naming Strategy

Files are stored using a content-addressed naming scheme.

### Storage Key Format

```
{prefix}/{hash[0:2]}/{hash[2:4]}/{hash}{.extension}
```

Example:
```
assets/ab/cd/abcdef1234567890abcdef1234567890abcdef12.pdf
```

### Principles

- The storage key is derived from the content hash, not the original
  filename.
- The original filename is preserved in the asset record metadata.
- The hash prefix directories (ab/cd/) prevent any single directory
  from containing too many files.
- The extension is preserved in the storage key for compatibility with
  storage backends and CDNs that use extension-based content type
  detection.
- The naming scheme is deterministic: the same file always has the same
  storage key. This enables deduplication (see Section 14).

## 14. Checksums and Integrity Verification

Every asset is checksummed at multiple points.

### Checksum Points

| Point | Algorithm | Purpose |
|-------|-----------|---------|
| **Upload** | SHA-256 | Computed client-side before upload (optional) and server-side on receipt. |
| **Storage** | SHA-256 | Verified after writing to storage backend. |
| **Serving** | SHA-256 | Optional: verified on read to detect storage corruption. |
| **Derivative Generation** | SHA-256 | Verified after each derivative is generated. |
| **Periodic Audit** | SHA-256 | Scheduled background job verifies stored files against their recorded hashes. |

### Integrity Verification Flow

1. Client computes SHA-256 hash of the file before upload (optional).
2. Server computes hash on receipt. If client hash was provided, they
   are compared.
3. Server stores the file using the hash as the storage key (see
   Section 13).
4. Server verifies that the stored file's hash matches the computed
   hash.
5. The hash is recorded in the asset record.
6. Periodic audit jobs re-compute hashes of stored files and compare
   them to the recorded hashes. Mismatches trigger alerts.

## 15. Deduplication Strategy

Content-addressed storage naturally deduplicates identical files.

### Deduplication Flow

1. On upload, the server computes the SHA-256 hash of the file content.
2. The server checks if an asset with the same hash already exists.
3. If it exists:
   - The existing asset record is returned. A new relationship is
     created between the requesting entity and the existing asset.
   - No new file is stored.
   - The existing asset's reference count is incremented.
4. If it does not exist:
   - A new asset record is created.
   - The file is stored at the hash-derived path.
   - The hash is recorded.

### Scope

- Deduplication is global across the entire platform.
- Two entities uploading the same file (e.g., the same logo PNG) will
  reference the same asset record.
- Deduplication respects versioning. Different versions of the same
  logical file have different hashes and are stored separately.

### Conflict Resolution

If two files have the same hash but different metadata (e.g., different
descriptions), the metadata from the first upload is preserved. The
second upload's metadata is discarded with a warning logged.

## 16. Storage Abstraction

The storage backend is abstracted behind a uniform interface. The asset
record stores the backend-specific location, not application-level paths.

### Backend Types

| Backend | Code | Description |
|---------|------|-------------|
| **Local Filesystem** | `local` | Development and single-server deployments. |
| **S3-compatible** | `s3` | Amazon S3, MinIO, DigitalOcean Spaces, Wasabi, etc. |
| **Google Cloud Storage** | `gcs` | GCS with uniform bucket-level access. |
| **Azure Blob Storage** | `azure` | Azure Blob with hierarchical namespace. |
| **CDN** | `cdn` | Content delivery network distribution (CloudFront, Cloudflare, Fastly). |

### Storage Record

```jsonc
{
  "backend": "s3",
  "bucket": "tprokash-assets",
  "key": "ab/cd/abcdef123456...",
  "region": "us-east-1",
  "endpoint": "https://s3.amazonaws.com",
  "storageClass": "STANDARD | INTELLIGENT_TIERING | GLACIER | DEEP_ARCHIVE"
}
```

### CDN Record

```jsonc
{
  "url": "https://cdn.tprokash.com/assets/abcdef123456...",
  "enabled": true,
  "distributionId": "E12345ABCDEF",
  "purgedAt": "datetime?"
}
```

### Abstraction Interface (Conceptual)

The framework defines a storage interface with these operations:

- `store(stream, hash, mimeType)` → `StorageRecord`
- `retrieve(storageRecord)` → `ReadableStream`
- `delete(storageRecord)` → `void`
- `exists(storageRecord)` → `boolean`
- `signedUrl(storageRecord, expiration)` → `URL`
- `copy(source, destination)` → `StorageRecord`

Different backends implement this interface. Application code never
interacts with backends directly.

### CDN Invalidation

When an asset is updated (new version), the CDN distribution is
invalidated for the specific asset path.

## 17. Access Control and Visibility

Every asset has a visibility level that controls who can access it.

### Visibility Levels

| Level | Description | Serving |
|-------|-------------|---------|
| **PUBLIC** | Accessible to any actor without authentication. | Direct URL or CDN URL. No signed URL required. |
| **PRIVATE** | Accessible only to the entity owner, Verifiers, and Administrators. | Signed URL with time-limited expiration. |
| **INTERNAL** | Accessible only to Administrators. Not accessible to entity owners or Verifiers. | Signed URL with strict expiration. Access is logged. |

### Visibility by Asset Type (Defaults)

| Asset Type | Default Visibility |
|------------|-------------------|
| LOGO | PUBLIC |
| COVER | PUBLIC |
| PROFILE_PHOTO | PUBLIC |
| BANNER | PUBLIC |
| THUMBNAIL | PUBLIC |
| CERTIFICATE | PUBLIC (metadata only) / PRIVATE (file content) |
| CONTRACT | PRIVATE |
| ISBN_DOCUMENT | PRIVATE |
| MANUSCRIPT | PRIVATE |
| LICENCE | PRIVATE |
| REGISTRATION_DOC | PRIVATE |
| TAX_DOCUMENT | PRIVATE |
| LEGAL_DOCUMENT | PRIVATE |
| BRAND_GUIDELINE | PUBLIC |
| AUDIOBOOK | PUBLIC (samples) / PRIVATE (full) |
| TRAILER | PUBLIC |

### Signed URLs

- PRIVATE assets are served through time-limited signed URLs.
- Default expiration: 1 hour. Configurable.
- Signed URL generation is logged.
- Signed URLs are single-use by default (configurable).

## 18. Search Requirements

Asset search must support:

- **Full-text search** across filename, label, description, alt text,
  caption, credit, copyright, and custom metadata text fields.
- **Filter by category** (IMAGE, DOCUMENT, AUDIO, VIDEO, ARCHIVE,
  DATASET, OTHER).
- **Filter by asset type** (LOGO, COVER, CONTRACT, etc.).
- **Filter by MIME type.**
- **Filter by file size range.**
- **Filter by dimensions** (width, height range for images).
- **Filter by duration range** (audio, video).
- **Filter by visibility** (PUBLIC, PRIVATE, INTERNAL).
- **Filter by status** (UPLOADED, ACTIVE, ARCHIVED, DELETED).
- **Filter by language** (BCP-47 tag).
- **Filter by hash** (find asset by content hash).
- **Filter by owning entity or entity type.**
- **Filter by version** (find assets with a specific version number).
- **Filter by derivative existence** (has thumbnails, has OCR).
- **Filter by AI tags** (future, when AI metadata is populated).
- **Sort by date uploaded, file size, filename, version number.**
- **Find duplicate assets** (by hash).
- **Find assets expiring or expirable** (for retention management).
- **Faceted counts** by category, asset type, MIME type, visibility,
  language.

## 19. Import/Export Requirements

### Import

- **Format**: Files are uploaded individually or in archives (ZIP,
  TAR). Archives are extracted and each file becomes a separate asset.
- **Validation**: Files are validated for MIME type, size, and malware
  on upload. Invalid files are rejected.
- **Metadata import**: Metadata may be provided alongside files as a
  sidecar JSON file, or as embedded metadata (EXIF, XMP, ID3).
- **Duplicate detection**: Content-addressed. Identical files are
  deduplicated automatically.
- **Relationship import**: Asset-to-entity relationships may be
  specified in the import manifest.
- **Audit**: Every import batch creates an audit record.

### Export

- **Format**: Files are exported individually or packaged as archives.
- **Scope**:
  - Public export — PUBLIC assets only. Originals or optimised
    variants.
  - Full export — All assets accessible to the requesting actor.
- **Filtering**: Same filters as Search.
- **Packaging**: Large exports are delivered as downloadable archives
  with a manifest file.
- **Rate limiting**: Exports are rate-limited.

## 20. Localization and Multilingual Metadata

Assets may have localized metadata for multi-lingual deployments.

### Localized Metadata

```jsonc
{
  "localized": {
    "bn-BD": {
      "label": "পেঙ্গুইন র্যান্ডম হাউসের লোগো",
      "description": "পেঙ্গুইন র্যান্ডম হাউসের কর্পোরেট লোগো",
      "altText": "সাদা ব্যাকগ্রাউন্ডে পেঙ্গুইন র্যান্ডম হাউসের লোগো"
    },
    "ar-SA": {
      "label": "شعار بينجوين راندوم هاوس",
      "description": "الشعار الرسمي لشركة بينجوين راندوم هاوس",
      "altText": "شعار بينجوين راندوم هاوس على خلفية بيضاء"
    }
  }
}
```

### Principles

- Localization is optional. Assets without localization may still be
  used in any locale.
- The primary metadata fields store the original language.
- The `localized` block stores translations for any number of languages.
- Each asset version has its own localization block.
- Alt text and captions are localizable, ensuring accessibility
  requirements are met in each locale.

## 21. Relationships

An Asset is referenced by domain entities through relationship records.

### Relationship Model

```jsonc
{
  "id": "uuid",
  "assetId": "uuid",
  "entityType": "PUBLISHER",
  "entityId": "uuid",
  "assetType": "LOGO",
  "primary": true,
  "order": 0,
  "label": "string?",
  "effectiveFrom": "datetime?",
  "effectiveUntil": "datetime?",
  "audit": "AuditMetadata"
}
```

### Relationship Types (Illustrative)

```
Asset
    ├── 0..N  Organizations         — logo, banner, contract, certificate
    ├── 0..N  Publishers            — logo, cover, banner, marketing
    ├── 0..N  Authors               — profile photo, manuscript
    ├── 0..N  Books                 — cover, preview, manuscript
    ├── 0..N  Editions              — cover, preview, sample
    ├── 0..N  Printers              — logo, contract, certification
    ├── 0..N  Distributors          — logo, contract
    ├── 0..N  Bookstores            — logo, banner
    ├── 0..N  Libraries             — logo
    ├── 0..N  Users                 — profile photo
    ├── 0..N  Verification Events   — evidence document
    └── 0..N  Documentation         — guide, policy, screenshot
```

## 22. API Resource Shapes

The following shapes describe the Media Asset resource. Actual endpoints
are deferred to implementation RFCs.

### Asset

```jsonc
{
  "id": "uuid",
  "category": "IMAGE | DOCUMENT | AUDIO | VIDEO | ARCHIVE | DATASET | OTHER",
  "type": "string",
  "label": "string?",
  "description": "string?",
  "filename": "string",
  "extension": "string",
  "mimeType": "string",
  "size": "number",
  "hash": {
    "algorithm": "SHA-256",
    "value": "string"
  },
  "width": "number?",
  "height": "number?",
  "duration": "number?",
  "language": "string?",
  "metadata": {},
  "derivatives": ["AssetSummary"],
  "currentVersion": "number",
  "versionCount": "number",
  "versions": ["AssetVersion"],
  "url": "string?",
  "signedUrl": "string?",
  "cdnUrl": "string?",
  "visibility": "PUBLIC | PRIVATE | INTERNAL",
  "status": "UPLOADED | ACTIVE | ARCHIVED | DELETED",
  "localized": {},
  "lifecycle": "WorkflowStatus",
  "audit": "AuditMetadata"
}
```

### AssetSummary

```jsonc
{
  "id": "uuid",
  "category": "IMAGE | DOCUMENT | AUDIO | VIDEO | ARCHIVE | DATASET | OTHER",
  "type": "string",
  "label": "string?",
  "filename": "string",
  "mimeType": "string",
  "size": "number",
  "hash": {
    "algorithm": "SHA-256",
    "value": "string"
  },
  "width": "number?",
  "height": "number?",
  "url": "string?",
  "thumbnailUrl": "string?",
  "visibility": "PUBLIC | PRIVATE | INTERNAL",
  "status": "ACTIVE | ARCHIVED"
}
```

### AssetVersion

```jsonc
{
  "version": "number",
  "assetId": "uuid",
  "hash": {
    "algorithm": "SHA-256",
    "value": "string"
  },
  "size": "number",
  "filename": "string",
  "createdAt": "datetime",
  "createdBy": "uuid",
  "reason": "INITIAL | UPDATE | REBRAND | CORRECTION | FORMAT_CHANGE | OTHER"
}
```

### AssetUpload (input)

```jsonc
{
  "type": "string",
  "label": "string?",
  "description": "string?",
  "language": "string?",
  "visibility": "PUBLIC | PRIVATE | INTERNAL?",
  "metadata": {},
  "localized": {},
  "entityType": "string",
  "entityId": "uuid",
  "relationshipType": "string"
}
```

### AssetUpdate (input)

```jsonc
{
  "label": "string?",
  "description": "string?",
  "language": "string?",
  "visibility": "PUBLIC | PRIVATE | INTERNAL?",
  "metadata": {},
  "localized": {},
  "versionReason": "string?"
}
```

## 23. Permissions

| Action | Visitor | Entity Owner | Verifier | Administrator |
|--------|---------|--------------|----------|---------------|
| View PUBLIC asset | ✅ | ✅ | ✅ | ✅ |
| View PRIVATE asset | ❌ | ✅ (own) | ✅ | ✅ |
| View INTERNAL asset | ❌ | ❌ | ❌ | ✅ |
| View asset metadata | ✅ (PUBLIC) | ✅ (own) | ✅ | ✅ |
| View asset versions | ❌ | ✅ (own) | ✅ | ✅ |
| Upload asset | ❌ | ✅ (own) | ✅ | ✅ |
| Update asset metadata | ❌ | ✅ (own) | ✅ | ✅ |
| Replace asset (new version) | ❌ | ✅ (own) | ✅ | ✅ |
| Delete asset | ❌ | ❌ | ❌ | ✅ |
| Archive/restore asset | ❌ | ❌ | ❌ | ✅ |
| Change visibility | ❌ | ❌ | ✅ | ✅ |
| Generate signed URL | ❌ | ✅ (own) | ✅ | ✅ |
| Purge CDN cache | ❌ | ❌ | ❌ | ✅ |
| Import assets | ❌ | ❌ | ❌ | ✅ |
| Export assets | ❌ | ✅ (own) | ✅ | ✅ |
| View asset audit log | ❌ | ❌ | ✅ | ✅ |

## 24. Security Considerations

- **Malware scanning** — All uploaded files are scanned for malware
  before the asset is marked ACTIVE. Infected files remain in UPLOADED
  state and are automatically deleted after a configurable period.
- **File type validation** — MIME type is validated on upload. Files
  with mismatched extension and content are flagged.
- **File size limits** — Configurable per deployment and per asset
  category. Large files are rejected at the upload boundary.
- **Storage encryption** — All files are encrypted at rest in the
  storage backend (server-side encryption).
- **Transit encryption** — All file transfers use TLS.
- **Signed URL security** — Signed URLs have configurable expiration
  (default 1 hour), are single-use by default, and their generation is
  logged. The signing key is rotated periodically.
- **CDN security** — If CDN is used, origin access is restricted to the
  CDN (origin pull model). The CDN distribution uses signed URLs or
  token-based authentication for PRIVATE and INTERNAL assets.
- **Path traversal prevention** — Storage keys are validated against
  path traversal patterns. The hash-derived key format prevents
  directory traversal by design.
- **Hash collision** — SHA-256 collision resistance is sufficient for
  this use case. A hash collision alert system may be implemented as a
  future extension.
- **Exif stripping** — For IMAGE assets, EXIF metadata containing
  location data or device information may be stripped on upload
  (configurable per deployment).
- **Access logging** — All asset access events (view, download, signed
  URL generation) are logged for PRIVATE and INTERNAL assets.

## 25. Retention and Archival

### Retention Policies

| Policy | Description | Default |
|--------|-------------|---------|
| **STANDARD** | Asset retained for standard period after last reference. | 3 years after last reference removed. |
| **EXTENDED** | Retained for extended period. Required for legal or compliance evidence. | 7 years after last reference removed. |
| **INDEFINITE** | Retained permanently. Used for critical assets (verified logos, accreditation certificates). | Never purged. |

### Archival Process

1. An asset with no remaining references enters a grace period
   (configurable, default 90 days).
2. If no new reference is created during the grace period, the asset is
   automatically transitioned to ARCHIVED.
3. Archived assets are retained until the retention policy expires.
4. After retention expiry, the file is purged from storage. The asset
   record (metadata, hash) is retained indefinitely.

### Legal Holds

- Assets under a legal or regulatory hold are exempt from archival and
  purging.
- Holds are placed by Administrators.
- Holds may reference specific assets, entity types, or date ranges.
- Assets under hold have a `holdUntil` field.

## 26. Compliance Considerations

| Consideration | Description |
|---------------|-------------|
| **GDPR (Europe)** | Assets containing personal data (profile photos, identification documents) support deletion requests. File deletion is logged. Hash and metadata may be retained after deletion. |
| **CCPA (California)** | Similar to GDPR: asset deletion and access rights. |
| **Copyright** | Assets may carry copyright and licensing metadata. The framework does not enforce copyright compliance but provides the fields to record it. |
| **Accessibility** | Image assets must support alt text (stored in metadata). Video assets must support caption tracks (stored as associated assets). |
| **Data Sovereignty** | Storage backends may be region-scoped. The storage abstraction supports selecting a backend based on jurisdiction. |
| **Evidence Retention** | Verification evidence assets follow the Verification Framework's retention policies (RFC-0008). |

## 27. Future Extensions

### AI-powered Metadata Generation

Automatic tagging, object detection, OCR, content moderation, and
embedding generation for uploaded assets. The `ai` metadata section is
designed as a placeholder.

### Smart Cropping

AI-powered cropping that generates thumbnails and previews focused on
the most important region of an image (e.g., a face, a logo).

### Video Transcoding Service

Automatic transcoding of uploaded video files to multiple resolutions
and formats (HLS, DASH) for adaptive streaming.

### Audio Transcription

Automatic speech-to-text transcription of audio and video assets,
stored as associated document assets.

### Asset Collections

Named, ordered collections of assets (e.g., "Press Kit 2026" containing
logo, banner, photos, and press release).

### Watermarking

Automatic watermark overlay on preview and thumbnail derivatives for
copyright protection.

### Asset Analytics

Track asset access counts, download statistics, and bandwidth usage per
asset and per entity.

### Publish/Unpublish Workflow

A workflow for scheduling when an asset becomes public or when it should
be taken down.

### Dynamic Image Transformation

On-the-fly image transformation (resize, crop, rotate, filter) via URL
parameters (e.g., `?w=200&h=300&fit=cover`).

## 28. Open Questions

1. Should assets support soft deletion only, or should there be a hard
   delete option for Administrators? If hard delete is allowed, what is
   the audit trail?

2. How are assets versioned across entity relationships? If two entities
   reference the same asset and one requests a new version, does the
   other entity automatically see the new version?

3. Should thumbnail and preview derivatives be generated synchronously
   (blocking the upload response) or asynchronously (returning the asset
   immediately with derivatives pending)?

4. What is the maximum file size for each asset category? Should this
   be a framework-level constant or a per-deployment configuration?

5. Should the framework support asset storage tiers (hot/warm/cold)
   where older or less-frequently accessed assets are automatically
   moved to cheaper storage?

6. How should assets be handled when an entity is deleted? Should asset
   relationships be cascade-deleted, or should assets be preserved for
   a retention period?

7. Should the framework support asset transformation pipelines (e.g.,
   upload PDF → generate preview images → run OCR → extract text)?

8. How are assets discovered and selected by users? Is there a
   centralised asset browser that searches across all entity-owned
   assets?

9. Should the framework support external asset references (URLs to
   files hosted on third-party systems) in addition to uploaded files?

10. What is the strategy for migrating assets between storage backends
    (e.g., local → S3, S3 → GCS) without downtime?

## 29. Acceptance Criteria

- [ ] Media Asset **Vision**, **Goals**, and **Non-Goals** are
      documented and reviewed.
- [ ] The **Media Asset Model** defines all core fields (id, category,
      type, label, description, filename, extension, mimeType, size,
      hash, width, height, duration, language, metadata, derivatives,
      versions, storage, cdn, checksum, status, visibility, audit).
- [ ] **Asset Categories** (7 categories: IMAGE, DOCUMENT, AUDIO,
      VIDEO, ARCHIVE, DATASET, OTHER) are defined as a closed enum.
- [ ] **Asset Types** are defined with 11+ image types, 12+ document
      types, 5+ audio types, 5+ video types, 4+ archive types, 4+
      dataset types, all extensible.
- [ ] **Ownership Model** documents many-to-many relationships (an
      asset may belong to multiple entities), primary owner, and
      orphaned asset handling.
- [ ] **Asset Lifecycle** defines UPLOADED, ACTIVE, ARCHIVED, and
      DELETED states with transition rules.
- [ ] **Versioning Strategy** defines immutable versions with
      previous/next version chain, version reasons (INITIAL, UPDATE,
      REBRAND, CORRECTION, FORMAT_CHANGE, OTHER), and historical
      version accessibility.
- [ ] **Derivative Assets** defines 12 derivative types (THUMBNAIL_SMALL
      through OCR_TEXT and CUSTOM) with the derivative model
      referencing full Asset records.
- [ ] **Metadata Model** defines four extensible sections (system,
      descriptive, ai, custom) with the `ai` section as a placeholder
      for future services.
- [ ] **MIME Type Handling** documents detection, content negotiation
      (future), and configurable allow lists.
- [ ] **File Naming Strategy** documents the content-addressed storage
      key format (`prefix/hash[0:2]/hash[2:4]/hash.ext`).
- [ ] **Checksums and Integrity** documents SHA-256 at upload, storage,
      serving, derivative generation, and periodic audit points.
- [ ] **Deduplication Strategy** documents content-addressed
      deduplication, conflict resolution, and global scope.
- [ ] **Storage Abstraction** documents 4 backend types (local, s3,
      gcs, azure) plus CDN, with the storage record schema and
      conceptual interface (store, retrieve, delete, exists, signedUrl,
      copy).
- [ ] **Access Control and Visibility** defines PUBLIC, PRIVATE, and
      INTERNAL levels with default visibility per asset type and signed
      URL configuration.
- [ ] **Search Requirements** document 15+ search dimensions including
      AI tag search (future).
- [ ] **Import/Export Requirements** document archive extraction,
      sidecar metadata, deduplication, and rate limiting.
- [ ] **Localization and Multilingual Metadata** defines the
      `localized` block with BCP-47 keys and localizable alt text.
- [ ] **Relationships** define the relationship model (entityType,
      entityId, assetType, primary, order, effective dates) with 10+
      entity types.
- [ ] **API Resource Shapes** define Asset (full), AssetSummary,
      AssetVersion, AssetUpload (input), and AssetUpdate (input).
- [ ] **Permissions** are defined for all 4 actor classes across 16
      actions.
- [ ] **Security Considerations** address malware scanning, file type
      validation, file size limits, storage encryption, transit
      encryption, signed URL security, CDN security, path traversal,
      hash collision, Exif stripping, and access logging.
- [ ] **Retention and Archival** defines STANDARD (3 years), EXTENDED
      (7 years), and INDEFINITE policies with grace period, automatic
      archival, and legal holds.
- [ ] **Compliance Considerations** address GDPR, CCPA, Copyright,
      Accessibility, Data Sovereignty, and Evidence Retention.
- [ ] **Future Extensions** (AI Metadata, Smart Cropping, Video
      Transcoding, Audio Transcription, Asset Collections, Watermarking,
      Analytics, Publish/Unpublish Workflow, Dynamic Transformation) are
      identified.
- [ ] **Open Questions** are documented (10 questions) and awaiting
      resolution.
