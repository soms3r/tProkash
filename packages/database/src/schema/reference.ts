import {
  pgTable,
  varchar,
  text,
  boolean,
  integer,
  numeric,
  timestamp,
  index,
  unique,
  foreignKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const language = pgTable("language", {
  languageId: varchar("language_id", { length: 15 }).primaryKey(),
  code: varchar("code", { length: 255 }).notNull().unique(),
  nameBn: text("name_bn").notNull(),
  nameEn: text("name_en").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  codeIdx: index("idx_language_code").on(table.code).where(sql`deleted_at IS NULL`),
  isActiveIdx: index("idx_language_is_active").on(table.isActive).where(sql`deleted_at IS NULL`),
}));

export const category = pgTable("category", {
  categoryId: varchar("category_id", { length: 15 }).primaryKey(),
  parentId: varchar("parent_id", { length: 15 }),
  slug: text("slug").notNull().unique(),
  nameBn: text("name_bn").notNull(),
  nameEn: text("name_en").notNull(),
  description: text("description"),
  level: integer("level").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  parentIdIdx: index("idx_category_parent_id").on(table.parentId).where(sql`deleted_at IS NULL`),
  slugIdx: index("idx_category_slug").on(table.slug).where(sql`deleted_at IS NULL`),
  parentFk: foreignKey({ columns: [table.parentId], foreignColumns: [table.categoryId] }),
}));

export const contributionRole = pgTable("contribution_role", {
  contributionRoleId: varchar("contribution_role_id", { length: 15 }).primaryKey(),
  slug: text("slug").notNull().unique(),
  nameBn: text("name_bn").notNull(),
  nameEn: text("name_en").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  slugIdx: index("idx_contribution_role_slug").on(table.slug).where(sql`deleted_at IS NULL`),
}));

export const country = pgTable("country", {
  countryId: varchar("country_id", { length: 15 }).primaryKey(),
  code: text("code").notNull().unique(),
  nameBn: text("name_bn").notNull(),
  nameEn: text("name_en").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  codeIdx: index("idx_country_code").on(table.code).where(sql`deleted_at IS NULL`),
  isActiveIdx: index("idx_country_is_active").on(table.isActive).where(sql`deleted_at IS NULL`),
}));

export const city = pgTable("city", {
  cityId: varchar("city_id", { length: 15 }).primaryKey(),
  countryId: varchar("country_id", { length: 15 }).notNull().references(() => country.countryId),
  nameBn: text("name_bn").notNull(),
  nameEn: text("name_en").notNull(),
  isCapital: boolean("is_capital").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  countryIdIdx: index("idx_city_country_id").on(table.countryId).where(sql`deleted_at IS NULL`),
  isActiveIdx: index("idx_city_is_active").on(table.isActive).where(sql`deleted_at IS NULL`),
}));

export const address = pgTable("address", {
  addressId: varchar("address_id", { length: 15 }).primaryKey(),
  cityId: varchar("city_id", { length: 15 }).notNull().references(() => city.cityId),
  line1: text("line_1").notNull(),
  line2: text("line_2"),
  postalCode: text("postal_code"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  isPrimary: boolean("is_primary").notNull().default(false),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  cityIdIdx: index("idx_address_city_id").on(table.cityId).where(sql`deleted_at IS NULL`),
  entityIdx: index("idx_address_entity").on(table.entityType, table.entityId),
}));

export const tag = pgTable("tag", {
  tagId: varchar("tag_id", { length: 15 }).primaryKey(),
  nameBn: text("name_bn").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  slugIdx: index("idx_tag_slug").on(table.slug).where(sql`deleted_at IS NULL`),
  isActiveIdx: index("idx_tag_is_active").on(table.isActive).where(sql`deleted_at IS NULL`),
}));

export const keyword = pgTable("keyword", {
  keywordId: varchar("keyword_id", { length: 15 }).primaryKey(),
  word: text("word").notNull().unique(),
  languageCode: text("language_code"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  wordIdx: index("idx_keyword_word").on(table.word).where(sql`deleted_at IS NULL`),
  isActiveIdx: index("idx_keyword_is_active").on(table.isActive).where(sql`deleted_at IS NULL`),
}));

export const role = pgTable("role", {
  roleId: varchar("role_id", { length: 15 }).primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  isSystem: boolean("is_system").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  nameIdx: index("idx_role_name").on(table.name).where(sql`deleted_at IS NULL`),
  isActiveIdx: index("idx_role_is_active").on(table.isActive).where(sql`deleted_at IS NULL`),
}));

export const permission = pgTable("permission", {
  permissionId: varchar("permission_id", { length: 15 }).primaryKey(),
  resource: text("resource").notNull(),
  action: text("action").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  resourceActionUnique: unique().on(table.resource, table.action),
  resourceIdx: index("idx_permission_resource").on(table.resource).where(sql`deleted_at IS NULL`),
}));
