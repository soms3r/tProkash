import {
  pgTable,
  varchar,
  text,
  boolean,
  integer,
  date,
  timestamp,
  index,
  foreignKey,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { publisher, book } from "./publishing";

export const mediaAsset = pgTable("media_asset", {
  mediaAssetId: varchar("media_asset_id", { length: 15 }).primaryKey(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  mediaType: text("media_type"),
  title: text("title"),
  url: text("url").notNull(),
  publishedDate: date("published_date"),
  sourceName: text("source_name"),
  isApproved: boolean("is_approved").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  entityIdx: index("idx_media_asset_entity").on(table.entityType, table.entityId),
}));

export const digitalAsset = pgTable("digital_asset", {
  digitalAssetId: varchar("digital_asset_id", { length: 15 }).primaryKey(),
  bookId: varchar("book_id", { length: 15 }).notNull().references(() => book.bookId),
  assetType: text("asset_type"),
  filename: text("filename"),
  mimeType: text("mime_type"),
  fileSizeBytes: integer("file_size_bytes"),
  url: text("url"),
  description: text("description"),
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  bookIdIdx: index("idx_digital_asset_book_id").on(table.bookId).where(sql`deleted_at IS NULL`),
}));

export const dataset = pgTable("dataset", {
  datasetId: varchar("dataset_id", { length: 15 }).primaryKey(),
  publisherId: varchar("publisher_id", { length: 15 }),
  nameBn: text("name_bn").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  version: text("version"),
  description: text("description"),
  licenseType: text("license_type").notNull().default("ODbL 1.0"),
  fileUrl: text("file_url"),
  rowCount: integer("row_count"),
  publishedDate: date("published_date"),
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  slugIdx: index("idx_dataset_slug").on(table.slug).where(sql`deleted_at IS NULL`),
  publisherIdIdx: index("idx_dataset_publisher_id").on(table.publisherId).where(sql`deleted_at IS NULL`),
  publisherFk: foreignKey({ columns: [table.publisherId], foreignColumns: [publisher.publisherId] }),
}));

export const source = pgTable("source", {
  sourceId: varchar("source_id", { length: 15 }).primaryKey(),
  sourceType: text("source_type"),
  title: text("title"),
  url: text("url"),
  referenceNumber: text("reference_number"),
  publishedDate: date("published_date"),
  authorName: text("author_name"),
  isVerified: boolean("is_verified").notNull().default(false),
  confidenceScore: integer("confidence_score").notNull().default(0),
  verificationStatus: text("verification_status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  confidenceCheck: check("ck_source_confidence_score", sql`${table.confidenceScore} >= 0 AND ${table.confidenceScore} <= 100`),
}));

export const verification = pgTable("verification", {
  verificationId: varchar("verification_id", { length: 15 }).primaryKey(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  verificationStatus: text("verification_status").notNull(),
  confidenceScore: integer("confidence_score").notNull().default(0),
  verifiedBy: varchar("verified_by", { length: 15 }).notNull(),
  sourceId: varchar("source_id", { length: 15 }),
  notes: text("notes"),
  verifiedDate: date("verified_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  entityIdx: index("idx_verification_entity").on(table.entityType, table.entityId),
  verifiedByIdx: index("idx_verification_verified_by").on(table.verifiedBy).where(sql`deleted_at IS NULL`),
  sourceIdIdx: index("idx_verification_source_id").on(table.sourceId).where(sql`deleted_at IS NULL`),
  confidenceCheck: check("ck_verification_confidence_score", sql`${table.confidenceScore} >= 0 AND ${table.confidenceScore} <= 100`),
  sourceFk: foreignKey({ columns: [table.sourceId], foreignColumns: [source.sourceId] }),
}));

export const changeHistory = pgTable("change_history", {
  changeHistoryId: varchar("change_history_id", { length: 15 }).primaryKey(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  fieldName: text("field_name").notNull(),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  changedBy: varchar("changed_by", { length: 15 }),
  changeReason: text("change_reason"),
  sourceId: varchar("source_id", { length: 15 }),
  changedAt: timestamp("changed_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  entityIdx: index("idx_change_history_entity").on(table.entityType, table.entityId).where(sql`deleted_at IS NULL`),
  changedByIdx: index("idx_change_history_changed_by").on(table.changedBy).where(sql`deleted_at IS NULL`),
  sourceIdIdx: index("idx_change_history_source_id").on(table.sourceId).where(sql`deleted_at IS NULL`),
  changedAtIdx: index("idx_change_history_changed_at").on(table.changedAt).where(sql`deleted_at IS NULL`),
  sourceFk: foreignKey({ columns: [table.sourceId], foreignColumns: [source.sourceId] }),
}));
