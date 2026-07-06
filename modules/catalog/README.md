# Catalog Module

## Purpose

Manages the book catalog — books, editions, authors, contributors, series, collections, categories, and ISBNs. Acts as the central bibliographic hub of the ecosystem.

## Responsibilities

- Book entity CRUD and lifecycle management
- Edition management (different formats, versions, publication dates)
- Author and contributor management
- Series and collection management
- Category taxonomy management
- ISBN registry and validation
- Book-to-publisher, book-to-author, book-to-category relationships

## Owned Data

- `book` — Book entities
- `edition` — Editions of each book
- `isbn` — ISBN registry
- `person` — Authors and contributors
- `series`, `collection` — Grouping entities
- `category` — Category taxonomy
- `book_author`, `book_contributor`, `book_category`, `book_publisher`, `book_collection` — Junction tables
- `contribution_role` — Role types (author, editor, translator, illustrator, designer)

## Dependencies

- `core` — Base types, ID generation, validators
- `directory` — Publisher references for book-publisher relationships
- `identity` — User/role management for workflow actions

## Public Interfaces

- Book CRUD: `createBook` / `updateBook` / `getBook` / `listBooks`
- Edition management: `createEdition` / `updateEdition` / `getEdition`
- Author management: `createAuthor` / `updateAuthor` / `getAuthor`
- ISBN lookup: `lookupISBN(isbn)` / `registerISBN(isbn, bookId)`
- Category navigation: `getCategoryTree` / `getBooksByCategory`
- Search: `searchBooks(query, filters)`

## Future Features

- Book cover image management
- Table of contents extraction
- Subject/genre classification
- Related books recommendation
- Bulk catalog import (ISBN batch, publisher catalog ingest)

## Out of Scope

- Publisher directory management (see `directory` module)
- Printing/production tracking (see `printing` module)
- Bookstore inventory (see `bookstores` module)
- Reader reviews and ratings (see `community` module)
