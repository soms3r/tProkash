import {
  pgTable,
  varchar,
  text,
  boolean,
  integer,
  numeric,
  date,
  timestamp,
  index,
  foreignKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { address, language } from "./reference";

export const publisher = pgTable("publisher", {
  publisherId: varchar("publisher_id", { length: 15 }).primaryKey(),
  nameBn: text("name_bn").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  websiteUrl: text("website_url"),
  foundedYear: integer("founded_year"),
  status: text("status").notNull().default("active"),
  descriptionBn: text("description_bn"),
  descriptionEn: text("description_en"),
  logoUrl: text("logo_url"),
  verificationLevel: text("verification_level").notNull().default("Needs Review"),
  addressId: varchar("address_id", { length: 15 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  slugIdx: index("idx_publisher_slug").on(table.slug).where(sql`deleted_at IS NULL`),
  addressIdIdx: index("idx_publisher_address_id").on(table.addressId).where(sql`deleted_at IS NULL`),
  statusIdx: index("idx_publisher_status").on(table.status).where(sql`deleted_at IS NULL`),
  addressFk: foreignKey({ columns: [table.addressId], foreignColumns: [address.addressId] }),
}));

export const imprint = pgTable("imprint", {
  imprintId: varchar("imprint_id", { length: 15 }).primaryKey(),
  publisherId: varchar("publisher_id", { length: 15 }).notNull().references(() => publisher.publisherId),
  nameBn: text("name_bn").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  publisherIdIdx: index("idx_imprint_publisher_id").on(table.publisherId).where(sql`deleted_at IS NULL`),
  slugIdx: index("idx_imprint_slug").on(table.slug).where(sql`deleted_at IS NULL`),
}));

export const person = pgTable("person", {
  personId: varchar("person_id", { length: 15 }).primaryKey(),
  nameBn: text("name_bn").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  birthYear: integer("birth_year"),
  deathYear: integer("death_year"),
  biographyBn: text("biography_bn"),
  biographyEn: text("biography_en"),
  websiteUrl: text("website_url"),
  pseudonymOfId: varchar("pseudonym_of_id", { length: 15 }),
  verificationLevel: text("verification_level"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  slugIdx: index("idx_person_slug").on(table.slug).where(sql`deleted_at IS NULL`),
  pseudonymOfIdIdx: index("idx_person_pseudonym_of_id").on(table.pseudonymOfId).where(sql`deleted_at IS NULL`),
  pseudonymFk: foreignKey({ columns: [table.pseudonymOfId], foreignColumns: [table.personId] }),
}));

export const series = pgTable("series", {
  seriesId: varchar("series_id", { length: 15 }).primaryKey(),
  publisherId: varchar("publisher_id", { length: 15 }),
  nameBn: text("name_bn").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  slugIdx: index("idx_series_slug").on(table.slug).where(sql`deleted_at IS NULL`),
  publisherIdIdx: index("idx_series_publisher_id").on(table.publisherId).where(sql`deleted_at IS NULL`),
  isActiveIdx: index("idx_series_is_active").on(table.isActive).where(sql`deleted_at IS NULL`),
  publisherFk: foreignKey({ columns: [table.publisherId], foreignColumns: [publisher.publisherId] }),
}));

export const book = pgTable("book", {
  bookId: varchar("book_id", { length: 15 }).primaryKey(),
  titleBn: text("title_bn").notNull(),
  titleEn: text("title_en").notNull(),
  subtitleBn: text("subtitle_bn"),
  subtitleEn: text("subtitle_en"),
  slug: text("slug").notNull().unique(),
  descriptionBn: text("description_bn"),
  descriptionEn: text("description_en"),
  imprintId: varchar("imprint_id", { length: 15 }),
  seriesId: varchar("series_id", { length: 15 }),
  seriesNumber: integer("series_number"),
  numPages: integer("num_pages"),
  publicationYear: integer("publication_year"),
  verificationLevel: text("verification_level"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  bookTsv: text("book_tsv").generatedAlwaysAs(
    sql`to_tsvector('english', coalesce(title_en, '') || ' ' || coalesce(description_en, ''))`
  ),
}, (table) => ({
  slugIdx: index("idx_book_slug").on(table.slug).where(sql`deleted_at IS NULL`),
  imprintIdIdx: index("idx_book_imprint_id").on(table.imprintId).where(sql`deleted_at IS NULL`),
  seriesIdIdx: index("idx_book_series_id").on(table.seriesId).where(sql`deleted_at IS NULL`),
  ftsIdx: index("idx_book_fts").using("gin", table.bookTsv).where(sql`deleted_at IS NULL`),
  imprintFk: foreignKey({ columns: [table.imprintId], foreignColumns: [imprint.imprintId] }),
  seriesFk: foreignKey({ columns: [table.seriesId], foreignColumns: [series.seriesId] }),
}));

export const edition = pgTable("edition", {
  editionId: varchar("edition_id", { length: 15 }).primaryKey(),
  bookId: varchar("book_id", { length: 15 }).notNull().references(() => book.bookId),
  languageId: varchar("language_id", { length: 15 }).notNull().references(() => language.languageId),
  editionNumber: integer("edition_number").notNull(),
  editionName: text("edition_name"),
  format: text("format").notNull().default("paperback"),
  publicationDate: date("publication_date"),
  numCopies: integer("num_copies").notNull().default(0),
  priceBdt: numeric("price_bdt", { precision: 12, scale: 2 }),
  status: text("status").notNull().default("planned"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  bookIdIdx: index("idx_edition_book_id").on(table.bookId).where(sql`deleted_at IS NULL`),
  languageIdIdx: index("idx_edition_language_id").on(table.languageId).where(sql`deleted_at IS NULL`),
  statusIdx: index("idx_edition_status").on(table.status).where(sql`deleted_at IS NULL`),
}));

export const isbn = pgTable("isbn", {
  isbnId: varchar("isbn_id", { length: 15 }).primaryKey(),
  editionId: varchar("edition_id", { length: 15 }).notNull().references(() => edition.editionId),
  code: varchar("code", { length: 20 }).notNull().unique(),
  format: text("format").notNull(),
  issuedDate: date("issued_date"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  editionIdIdx: index("idx_isbn_edition_id").on(table.editionId).where(sql`deleted_at IS NULL`),
  codeIdx: index("idx_isbn_code").on(table.code).where(sql`deleted_at IS NULL`),
  isActiveIdx: index("idx_isbn_is_active").on(table.isActive).where(sql`deleted_at IS NULL`),
}));

export const collection = pgTable("collection", {
  collectionId: varchar("collection_id", { length: 15 }).primaryKey(),
  nameBn: text("name_bn").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  isPublic: boolean("is_public").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  slugIdx: index("idx_collection_slug").on(table.slug).where(sql`deleted_at IS NULL`),
  isPublicIdx: index("idx_collection_is_public").on(table.isPublic).where(sql`deleted_at IS NULL`),
}));
