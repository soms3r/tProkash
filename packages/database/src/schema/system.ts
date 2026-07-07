import {
  pgTable,
  varchar,
  text,
  boolean,
  integer,
  jsonb,
  timestamp,
  index,
  unique,
  foreignKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { role } from "./reference";
import { person } from "./publishing";

export const user = pgTable("user", {
  userId: varchar("user_id", { length: 15 }).primaryKey(),
  personId: varchar("person_id", { length: 15 }),
  roleId: varchar("role_id", { length: 15 }).notNull().references(() => role.roleId),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name"),
  isActive: boolean("is_active").notNull().default(true),
  lastLogin: timestamp("last_login", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  personIdIdx: index("idx_user_person_id").on(table.personId).where(sql`deleted_at IS NULL`),
  roleIdIdx: index("idx_user_role_id").on(table.roleId).where(sql`deleted_at IS NULL`),
  emailIdx: index("idx_user_email").on(table.email).where(sql`deleted_at IS NULL`),
  isActiveIdx: index("idx_user_is_active").on(table.isActive).where(sql`deleted_at IS NULL`),
  personFk: foreignKey({ columns: [table.personId], foreignColumns: [person.personId] }),
}));

export const auditLog = pgTable("audit_log", {
  auditLogId: varchar("audit_log_id", { length: 15 }).primaryKey(),
  actorId: varchar("actor_id", { length: 15 }),
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  actorIdIdx: index("idx_audit_log_actor_id").on(table.actorId).where(sql`deleted_at IS NULL`),
  entityIdx: index("idx_audit_log_entity").on(table.entityType, table.entityId),
  actorFk: foreignKey({ columns: [table.actorId], foreignColumns: [user.userId] }),
}));

export const notification = pgTable("notification", {
  notificationId: varchar("notification_id", { length: 15 }).primaryKey(),
  userId: varchar("user_id", { length: 15 }).notNull().references(() => user.userId),
  notificationType: text("notification_type"),
  subject: text("subject"),
  body: text("body"),
  isRead: boolean("is_read").notNull().default(false),
  sentVia: text("sent_via").notNull().default("in_app"),
  sentDate: timestamp("sent_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  userIdIdx: index("idx_notification_user_id").on(table.userId).where(sql`deleted_at IS NULL`),
  isReadIdx: index("idx_notification_is_read").on(table.isRead).where(sql`deleted_at IS NULL`),
}));

export const searchIndex = pgTable("search_index", {
  searchIndexId: varchar("search_index_id", { length: 15 }).primaryKey(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  searchableText: text("searchable_text"),
  weight: integer("weight").notNull().default(1),
  languageCode: text("language_code"),
  lastIndexed: timestamp("last_indexed", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  searchIndexTsv: text("search_index_tsv").generatedAlwaysAs(
    sql`to_tsvector('english', coalesce(searchable_text, ''))`
  ),
}, (table) => ({
  entityIdx: index("idx_search_index_entity").on(table.entityType, table.entityId),
  ftsIdx: index("idx_search_index_fts").using("gin", table.searchIndexTsv),
  entityUnique: unique().on(table.entityType, table.entityId),
}));

export const apiClient = pgTable("api_client", {
  apiClientId: varchar("api_client_id", { length: 15 }).primaryKey(),
  userId: varchar("user_id", { length: 15 }).notNull().references(() => user.userId),
  clientId: text("client_id").notNull().unique(),
  clientSecretHash: text("client_secret_hash").notNull(),
  name: text("name"),
  description: text("description"),
  rateLimit: integer("rate_limit").notNull().default(1000),
  scope: text("scope"),
  isActive: boolean("is_active").notNull().default(true),
  lastUsed: timestamp("last_used", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  userIdIdx: index("idx_api_client_user_id").on(table.userId).where(sql`deleted_at IS NULL`),
  clientIdIdx: index("idx_api_client_client_id").on(table.clientId).where(sql`deleted_at IS NULL`),
  isActiveIdx: index("idx_api_client_is_active").on(table.isActive).where(sql`deleted_at IS NULL`),
}));

export const contactMethod = pgTable("contact_method", {
  contactMethodId: varchar("contact_method_id", { length: 15 }).primaryKey(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  contactType: text("contact_type"),
  value: text("value").notNull(),
  isPrimary: boolean("is_primary").notNull().default(false),
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  entityIdx: index("idx_contact_method_entity").on(table.entityType, table.entityId),
}));
