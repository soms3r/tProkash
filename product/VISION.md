# Product Vision — tProkash v0.2

## One-line vision

The open directory where anyone can discover, verify, and connect with every publisher, book, and author in Bangladesh.

## What v0.2 delivers

v0.2 is the first working product. It transforms the database schema, specs, and templates into a browsable, searchable, public directory. Users can:

- Browse and search a verified directory of Bangladeshi publishers
- View publisher profiles with contact info, services, imprints, and status
- Browse and search a book catalog with author and publisher links
- View book profiles with edition details, ISBNs, and author information
- View author profiles with biography and bibliography
- Download open datasets of the directory for offline use
- Access the platform via a public API (read-only)

## What v0.2 does NOT deliver

- User accounts, authentication, or login
- Community features (reviews, ratings, events)
- Publishing workflow (submissions, contracts)
- E-commerce or marketplace
- AI-powered features
- Admin dashboard

## Design principles for v0.2

1. **Read-first** — v0.2 is a read-only directory. Write features come in later sprints.
2. **Data completeness over UI polish** — Every field defined in the data templates must be visible on profiles, even if sparsely populated.
3. **Open by default** — All data is publicly accessible without authentication. No paywalls, no sign-up requirements.
4. **Mobile-ready** — All pages must render legibly on mobile viewports (320px+).
5. **Accessible** — WCAG 2.1 AA minimum for all public pages.
6. **Fast** — Sub-second page loads for profile pages; sub-3-second for search results.
