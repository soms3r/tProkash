# Database Design

## Naming
snake_case
singular table names

Primary Keys:
author_id
book_id
publisher_id

Foreign Keys:
author_id -> author.author_id

Indexes:
- title
- isbn
- slug
- publisher_id
- author_id

Unique:
isbn
publisher.slug
language.code
