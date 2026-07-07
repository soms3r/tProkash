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
  unique,
  foreignKey,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { address } from "./reference";
import { publisher, person, book } from "./publishing";

export const reader = pgTable("reader", {
  readerId: varchar("reader_id", { length: 15 }).primaryKey(),
  personId: varchar("person_id", { length: 15 }),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  joinDate: date("join_date"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  personIdIdx: index("idx_reader_person_id").on(table.personId).where(sql`deleted_at IS NULL`),
  emailIdx: index("idx_reader_email").on(table.email).where(sql`deleted_at IS NULL`),
  isActiveIdx: index("idx_reader_is_active").on(table.isActive).where(sql`deleted_at IS NULL`),
  personFk: foreignKey({ columns: [table.personId], foreignColumns: [person.personId] }),
}));

export const review = pgTable("review", {
  reviewId: varchar("review_id", { length: 15 }).primaryKey(),
  bookId: varchar("book_id", { length: 15 }).notNull().references(() => book.bookId),
  readerId: varchar("reader_id", { length: 15 }).notNull().references(() => reader.readerId),
  rating: integer("rating").notNull(),
  title: text("title"),
  body: text("body"),
  isVerifiedPurchase: boolean("is_verified_purchase").notNull().default(false),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  bookIdIdx: index("idx_review_book_id").on(table.bookId).where(sql`deleted_at IS NULL`),
  readerIdIdx: index("idx_review_reader_id").on(table.readerId).where(sql`deleted_at IS NULL`),
  statusIdx: index("idx_review_status").on(table.status).where(sql`deleted_at IS NULL`),
  bookReaderUnique: unique().on(table.bookId, table.readerId),
  ratingCheck: check("ck_review_rating", sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
}));

export const organization = pgTable("organization", {
  organizationId: varchar("organization_id", { length: 15 }).primaryKey(),
  nameBn: text("name_bn").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  organizationType: text("organization_type"),
  websiteUrl: text("website_url"),
  addressId: varchar("address_id", { length: 15 }),
  description: text("description"),
  foundedYear: integer("founded_year"),
  verificationLevel: text("verification_level"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  slugIdx: index("idx_organization_slug").on(table.slug).where(sql`deleted_at IS NULL`),
  addressIdIdx: index("idx_organization_address_id").on(table.addressId).where(sql`deleted_at IS NULL`),
  addressFk: foreignKey({ columns: [table.addressId], foreignColumns: [address.addressId] }),
}));

export const award = pgTable("award", {
  awardId: varchar("award_id", { length: 15 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 15 }),
  nameBn: text("name_bn").notNull(),
  nameEn: text("name_en").notNull(),
  categoryName: text("category_name"),
  year: integer("year"),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  organizationIdIdx: index("idx_award_organization_id").on(table.organizationId).where(sql`deleted_at IS NULL`),
  isActiveIdx: index("idx_award_is_active").on(table.isActive).where(sql`deleted_at IS NULL`),
  organizationFk: foreignKey({ columns: [table.organizationId], foreignColumns: [organization.organizationId] }),
}));

export const event = pgTable("event", {
  eventId: varchar("event_id", { length: 15 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 15 }),
  nameBn: text("name_bn").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  eventType: text("event_type"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  venue: text("venue"),
  addressId: varchar("address_id", { length: 15 }),
  websiteUrl: text("website_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  organizationIdIdx: index("idx_event_organization_id").on(table.organizationId).where(sql`deleted_at IS NULL`),
  slugIdx: index("idx_event_slug").on(table.slug).where(sql`deleted_at IS NULL`),
  addressIdIdx: index("idx_event_address_id").on(table.addressId).where(sql`deleted_at IS NULL`),
  isActiveIdx: index("idx_event_is_active").on(table.isActive).where(sql`deleted_at IS NULL`),
  organizationFk: foreignKey({ columns: [table.organizationId], foreignColumns: [organization.organizationId] }),
  addressFk: foreignKey({ columns: [table.addressId], foreignColumns: [address.addressId] }),
}));

export const license = pgTable("license", {
  licenseId: varchar("license_id", { length: 15 }).primaryKey(),
  publisherId: varchar("publisher_id", { length: 15 }).notNull().references(() => publisher.publisherId),
  licenseType: text("license_type"),
  rightsGranted: text("rights_granted"),
  territory: text("territory").notNull().default("Bangladesh"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  isExclusive: boolean("is_exclusive").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  publisherIdIdx: index("idx_license_publisher_id").on(table.publisherId).where(sql`deleted_at IS NULL`),
}));

export const contract = pgTable("contract", {
  contractId: varchar("contract_id", { length: 15 }).primaryKey(),
  contractNumber: text("contract_number").notNull().unique(),
  contractType: text("contract_type"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  publisherId: varchar("publisher_id", { length: 15 }).notNull().references(() => publisher.publisherId),
  licenseId: varchar("license_id", { length: 15 }),
  royaltyPercentage: numeric("royalty_percentage", { precision: 12, scale: 2 }),
  advanceAmountBdt: numeric("advance_amount_bdt", { precision: 12, scale: 2 }),
  status: text("status").notNull().default("draft"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  contractNumberIdx: index("idx_contract_contract_number").on(table.contractNumber).where(sql`deleted_at IS NULL`),
  publisherIdIdx: index("idx_contract_publisher_id").on(table.publisherId).where(sql`deleted_at IS NULL`),
  licenseIdIdx: index("idx_contract_license_id").on(table.licenseId).where(sql`deleted_at IS NULL`),
  statusIdx: index("idx_contract_status").on(table.status).where(sql`deleted_at IS NULL`),
  licenseFk: foreignKey({ columns: [table.licenseId], foreignColumns: [license.licenseId] }),
}));

export const submission = pgTable("submission", {
  submissionId: varchar("submission_id", { length: 15 }).primaryKey(),
  publisherId: varchar("publisher_id", { length: 15 }).notNull().references(() => publisher.publisherId),
  title: text("title").notNull(),
  submissionType: text("submission_type").notNull().default("manuscript"),
  abstract: text("abstract"),
  status: text("status").notNull().default("draft"),
  submittedDate: date("submitted_date"),
  decisionDate: date("decision_date"),
  decisionNotes: text("decision_notes"),
  contractId: varchar("contract_id", { length: 15 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  publisherIdIdx: index("idx_submission_publisher_id").on(table.publisherId).where(sql`deleted_at IS NULL`),
  contractIdIdx: index("idx_submission_contract_id").on(table.contractId).where(sql`deleted_at IS NULL`),
  statusIdx: index("idx_submission_status").on(table.status).where(sql`deleted_at IS NULL`),
  contractFk: foreignKey({ columns: [table.contractId], foreignColumns: [contract.contractId] }),
}));
