# Core Database Architecture

Version: 1.1.0

## Goals
- Relational database (3NF)
- Database-first design
- Vendor-neutral SQL (PostgreSQL primary, MySQL/SQLite compatible)
- Stable IDs
- API-ready

## Core Entities
Author
Book
Publisher
Edition
ISBN
Language
Category
Editor
Translator
Designer
Printer
Distributor
Bookstore
Organization
Event

## Junction Tables
book_author
book_publisher
book_editor
book_translator
book_designer
publisher_category
publisher_service

## Common Columns
created_at
updated_at
deleted_at
created_by
updated_by

Soft delete uses deleted_at.
