# Navigation — v0.2 Public Pages

## Global Navigation

Persistent header on all pages containing:
- Logo / site name (links to Home)
- Search bar (collapsed to icon on mobile, expandable)
- Language toggle (বাংলা / English)
- Navigation links: Home, Publishers, Books, Authors, About, Datasets, API
- Footer: About, API, Datasets, Legal, Privacy, GitHub link

---

## Home (`/`)

**Purpose:** Entry point that communicates the project's value, displays key statistics, and provides quick access to search and browsing.

**Content:**
- Hero section: project name, tagline, call-to-action search bar
- Key statistics: total publishers, books, authors, datasets (from live data)
- Featured publishers (spotlight section — manually curated or random)
- Quick category browse: grid of book categories with counts
- About excerpt with link to full About page
- Latest dataset download link
- Footer with links

**States:**
- Empty: Not applicable (data is always present)
- Loading: Skeleton placeholders for stats and featured section
- Error: Graceful degradation — stats show dashes, featured section hidden
- Edge: Very large dataset — stats use cached/aggregated counts

---

## Search (`/search?q=...`)

**Purpose:** Primary discovery interface — full-text search across all entity types with filtering and sorting.

**Content:**
- Search results list grouped by entity type (Publishers, Books, Authors)
- Result cards showing: name (bn/en), type badge, verification badge, brief excerpt, entity-specific fields
- Faceted filters sidebar (collapsible on mobile):
  - Entity type (Publisher, Book, Author)
  - Category (book genres / publisher specialties)
  - Language
  - Verification status
  - Publisher status (active, inactive, defunct)
- Sort options: Relevance, Name (A-Z), Name (Z-A), Recently updated
- Pagination (20 results per page)
- Result count summary ("Showing X of Y results")
- Empty state: "No results found" with suggestions and search tips

**States:**
- Empty query: Prompt to enter a search term, show popular searches
- Loading: Skeleton result cards
- Error: "Search is temporarily unavailable" with retry button
- Edge cases: Very long query (truncate to 200 chars with warning), special characters (sanitize), zero results (suggestions)

**URL parameters:** `q`, `type`, `category`, `language`, `verification`, `status`, `sort`, `page`

---

## Publisher Profile (`/publishers/{pubId}`)

**Purpose:** Complete detail page for a single publisher. All data from the publisher template is displayed.

**Content:** (exact fields defined in `PUBLIC_PROFILE_SPEC.md`)
- Publisher name (bn/en), slug
- Status badge (Active, Inactive, Defunct, Suspended)
- Verification badge
- Contact info: website, email, phone, address
- Publisher identifiers: registration number, BIN, TIN, ISBN prefix
- Founded year
- Services offered
- Imprints list with links
- Books published (paginated list with cover/thumbnail, title, year, link)
- Source attribution

**States:**
- Found: Full profile display
- Not found: 404 page
- Loading: Skeleton layout
- Error: Error message with retry
- Edge cases: Publisher with no books (show "No books listed yet"), missing optional fields (hide section)

---

## Book Profile (`/books/{bookId}`)

**Purpose:** Complete detail page for a single book. All data from the book template is displayed.

**Content:** (exact fields defined in `PUBLIC_PROFILE_SPEC.md`)
- Book title (bn/en), slug
- Cover image (if available)
- Authors with links to author profiles
- Publisher with link to publisher profile
- Edition information (edition name, publication date, format)
- ISBN(s)
- Category / genre
- Description / blurb
- Language
- Page count
- Verification badge
- Source attribution

**States:**
- Found: Full profile display
- Not found: 404 page
- Loading: Skeleton layout
- Error: Error message with retry
- Edge cases: Book with no ISBN, missing description, multiple editions display

---

## Author Profile (`/authors/{authorId}`)

**Purpose:** Complete detail page for a single author with their bibliography.

**Content:** (exact fields defined in `PUBLIC_PROFILE_SPEC.md`)
- Author name (bn/en)
- Birth year, death year (if applicable)
- Biography
- Pseudonyms (if any)
- Books by this author (paginated list)
- Verification badge
- Source attribution

**States:**
- Found: Full profile display
- Not found: 404 page
- Loading: Skeleton layout
- Error: Error message with retry
- Edge cases: Author with no books (show "No books listed yet"), author with many books (paginated)

---

## About (`/about`)

**Purpose:** Communicate the project's mission, team, licensing, and contribution information.

**Content:**
- Project mission and vision
- Key features and data coverage
- Data license (ODbL 1.0) and documentation license (CC BY 4.0)
- Source code license (MIT)
- Verification methodology explanation
- Team / maintainer information
- How to contribute
- Link to GitHub repository
- Link to Constitution

---

## Datasets (`/datasets`)

**Purpose:** Downloadable, versioned open data packages.

**Content:**
- List of available datasets with name, version, description, record count
- Download buttons for each format (JSON, CSV)
- Dataset metadata (license, language, last updated)
- Dataset changelog link
- Data schema reference

**States:**
- Datasets available: Download list
- No datasets: "No datasets released yet" message
- Loading: Skeleton list

---

## API (`/api`)

**Purpose:** Public API documentation and reference.

**Content:**
- Base URL and version info
- Authentication instructions (API key)
- Endpoint reference: GET /publishers, GET /publishers/{id}, GET /books, GET /books/{id}, GET /authors, GET /authors/{id}, GET /search
- Request/response examples
- Rate limiting info
- Pagination parameters
- Error response format

---

## 404 (`/*`)

**Purpose:** Catch-all for unknown routes.

**Content:**
- "Page not found" message
- Search bar
- Links to Home, Publishers, Books, Authors
- Suggestion: "Did you mean to search for...?"

**States:**
- Standard 404 for unknown routes
- Near-miss suggestions for known entity types with invalid IDs
