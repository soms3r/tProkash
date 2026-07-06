# Public Profile Specification — v0.2

Defines exactly what information appears on each public profile type.

---

## Publisher Profile

**URL pattern:** `/publishers/{publisherId}`

### Header section
| Field | Display | Source |
|-------|---------|--------|
| name_bn | Primary heading (Bengali) | publisher.name_bn |
| name_en | Secondary heading (English) | publisher.name_en |
| Status badge | Colored badge | publisher.status (active/inactive/defunct/suspended) |
| Verification badge | Icon + level label | publisher.verification_status |
| Last updated | "Updated X ago" | publisher.updated_at |

### About section
| Field | Display | Notes |
|-------|---------|-------|
| description_bn | Bengali description | Omit if empty |
| description_en | English description | Omit if empty |
| founded_year | "Founded in YYYY" | Omit if empty |

### Identifiers section
| Field | Display | Notes |
|-------|---------|-------|
| registration_number | Registration number | Omit if empty |
| bin_number | BIN number | Omit if empty |
| tin_number | TIN number | Omit if empty |
| isbn_prefix | ISBN Prefix | Omit if empty |

### Contact section
| Field | Display | Notes |
|-------|---------|-------|
| website | Clickable link | External icon, open in new tab |
| email | Clickable mailto link | Obfuscated from crawlers |
| phone | Phone number(s) | International format |
| address | Full address | Multi-line |
| city | City name | |
| country | Country name | Default: Bangladesh |

### Services section
| Field | Display | Notes |
|-------|---------|-------|
| services | Tag/list of services | From publisher.services array |
| service_categories | Grouped by category | Optional grouping |

### Imprints section (if any)
| Field | Display | Notes |
|-------|---------|-------|
| Imprint name (bn) | Heading | |
| Imprint name (en) | Subheading | |
| Imprint description | Text | Omit if empty |
| Link to imprint | Internal link | If imprints are separate entities |

### Books section (if any)
| Field | Display | Notes |
|-------|---------|-------|
| Book title (bn/en) | Card with title | |
| Author name | Subtitle | |
| Publication year | Year badge | |
| Cover thumbnail | Small image | Omit if no cover |
| Link to book profile | Clickable card | |

### Source section
| Field | Display | Notes |
|-------|---------|-------|
| Source name | "Data sourced from X" | |
| Source URL | Clickable link | |
| Confidence score | Visual indicator | If available |

---

## Book Profile

**URL pattern:** `/books/{bookId}`

### Header section
| Field | Display | Source |
|-------|---------|--------|
| title_bn | Primary heading (Bengali) | book.title_bn |
| title_en | Secondary heading (English) | book.title_en |
| Cover image | Image display | book.cover_url (if available) |
| Verification badge | Icon + level label | book.verification_status |
| Last updated | "Updated X ago" | book.updated_at |

### Metadata section
| Field | Display | Notes |
|-------|---------|-------|
| ISBN(s) | ISBN-10 / ISBN-13 | Show both if available |
| Language | Language name | From language lookup |
| Category | Category name(s) | Clickable, links to search |
| Page count | "X pages" | Omit if empty |
| Publication date | Formatted date | Omit if empty |
| Edition | Edition name/description | Omit if not specified |
| Series | Series name | Clickable (future), omit if empty |

### Authors section
| Field | Display | Notes |
|-------|---------|-------|
| Author name (bn/en) | Link to author profile | |
| Contribution role | Badge (Author, Editor, Translator, etc.) | From contribution_role |
| Multiple authors | Ordered list | In contribution order |

### Publisher section
| Field | Display | Notes |
|-------|---------|-------|
| Publisher name (bn/en) | Link to publisher profile | |
| Imprint name (if applicable) | Subtitle | Omit if empty |

### Description section
| Field | Display | Notes |
|-------|---------|-------|
| description_bn | Bengali blurb/description | Omit if empty |
| description_en | English blurb/description | Omit if empty |

### Source section
| Field | Display | Notes |
|-------|---------|-------|
| Source name | "Data sourced from X" | |
| Source URL | Clickable link | |

---

## Author Profile

**URL pattern:** `/authors/{authorId}`

### Header section
| Field | Display | Source |
|-------|---------|--------|
| name_bn | Primary heading (Bengali) | person.name_bn |
| name_en | Secondary heading (English) | person.name_en |
| Verification badge | Icon + level label | person.verification_status |
| Last updated | "Updated X ago" | person.updated_at |

### Biography section
| Field | Display | Notes |
|-------|---------|-------|
| biography_bn | Bengali biography | Omit if empty |
| biography_en | English biography | Omit if empty |
| birth_year | "Born YYYY" | Omit if empty |
| death_year | "Died YYYY" | Show only if deceased |
| birth_place | Birthplace name | Omit if empty |
| nationality | Nationality | Default: Bangladeshi |

### Pseudonyms section (if any)
| Field | Display | Notes |
|-------|---------|-------|
| Pseudonym name (bn/en) | "Also known as X" | List all pseudonyms |

### Bibliography section
| Field | Display | Notes |
|-------|---------|-------|
| Book title (bn/en) | Card | |
| Publication year | Year | |
| Role | Badge (Author, Co-author, Editor) | |
| Publisher name | Subtitle | |
| Cover thumbnail | Small image | |
| Link to book profile | Clickable card | |
| Sort | Chronological (newest first) | |

### Source section
| Field | Display | Notes |
|-------|---------|-------|
| Source name | "Data sourced from X" | |
| Source URL | Clickable link | |

---

## Field Display Rules (All Profiles)

1. **Missing data:** Sections with no data should be hidden entirely (not shown as empty).
2. **Bilingual toggle:** A toggle or tab control switches the primary display language between Bengali and English. The non-primary language appears as a subtitle.
3. **Long text:** Text longer than 500 characters shows a "Read more" truncation (expandable inline).
4. **Dates:** Display as relative ("Updated 3 days ago") for recent (≤30 days), absolute format for older.
5. **External links:** Open in new tab with external link icon.
6. **Verification badge:** Always visible at the top of the profile. Color-coded: green (verified), yellow (partially), blue (community), gray (needs review).
7. **IDs:** Internal tProkash IDs (PUB-A1B2C3D4E5) are not displayed in the public UI unless specifically requested.
