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
import { edition } from "./publishing";

export const printer = pgTable("printer", {
  printerId: varchar("printer_id", { length: 15 }).primaryKey(),
  nameBn: text("name_bn").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  websiteUrl: text("website_url"),
  addressId: varchar("address_id", { length: 15 }),
  services: text("services"),
  verificationLevel: text("verification_level"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  slugIdx: index("idx_printer_slug").on(table.slug).where(sql`deleted_at IS NULL`),
  addressIdIdx: index("idx_printer_address_id").on(table.addressId).where(sql`deleted_at IS NULL`),
  addressFk: foreignKey({ columns: [table.addressId], foreignColumns: [address.addressId] }),
}));

export const printBatch = pgTable("print_batch", {
  printBatchId: varchar("print_batch_id", { length: 15 }).primaryKey(),
  batchName: text("batch_name"),
  description: text("description"),
  scheduledDate: date("scheduled_date"),
  completedDate: date("completed_date"),
  status: text("status").notNull().default("planned"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  statusIdx: index("idx_print_batch_status").on(table.status).where(sql`deleted_at IS NULL`),
}));

export const printing = pgTable("printing", {
  printingId: varchar("printing_id", { length: 15 }).primaryKey(),
  editionId: varchar("edition_id", { length: 15 }).notNull().references(() => edition.editionId),
  printerId: varchar("printer_id", { length: 15 }).notNull().references(() => printer.printerId),
  printBatchId: varchar("print_batch_id", { length: 15 }),
  quantity: integer("quantity").notNull(),
  quantityDelivered: integer("quantity_delivered").notNull().default(0),
  startDate: date("start_date"),
  completionDate: date("completion_date"),
  costBdt: numeric("cost_bdt", { precision: 12, scale: 2 }),
  status: text("status").notNull().default("scheduled"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  editionIdIdx: index("idx_printing_edition_id").on(table.editionId).where(sql`deleted_at IS NULL`),
  printerIdIdx: index("idx_printing_printer_id").on(table.printerId).where(sql`deleted_at IS NULL`),
  printBatchIdIdx: index("idx_printing_print_batch_id").on(table.printBatchId).where(sql`deleted_at IS NULL`),
  statusIdx: index("idx_printing_status").on(table.status).where(sql`deleted_at IS NULL`),
  quantityCheck: check("ck_printing_quantity", sql`${table.quantity} > 0`),
  printBatchFk: foreignKey({ columns: [table.printBatchId], foreignColumns: [printBatch.printBatchId] }),
}));

export const warehouse = pgTable("warehouse", {
  warehouseId: varchar("warehouse_id", { length: 15 }).primaryKey(),
  nameBn: text("name_bn").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  addressId: varchar("address_id", { length: 15 }),
  capacity: integer("capacity"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  slugIdx: index("idx_warehouse_slug").on(table.slug).where(sql`deleted_at IS NULL`),
  addressIdIdx: index("idx_warehouse_address_id").on(table.addressId).where(sql`deleted_at IS NULL`),
  isActiveIdx: index("idx_warehouse_is_active").on(table.isActive).where(sql`deleted_at IS NULL`),
  addressFk: foreignKey({ columns: [table.addressId], foreignColumns: [address.addressId] }),
}));

export const inventory = pgTable("inventory", {
  inventoryId: varchar("inventory_id", { length: 15 }).primaryKey(),
  editionId: varchar("edition_id", { length: 15 }).notNull().references(() => edition.editionId),
  warehouseId: varchar("warehouse_id", { length: 15 }).notNull().references(() => warehouse.warehouseId),
  quantityOnHand: integer("quantity_on_hand").notNull().default(0),
  quantityReserved: integer("quantity_reserved").notNull().default(0),
  reorderThreshold: integer("reorder_threshold").notNull().default(10),
  lastRestockedDate: date("last_restocked_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  editionIdIdx: index("idx_inventory_edition_id").on(table.editionId).where(sql`deleted_at IS NULL`),
  warehouseIdIdx: index("idx_inventory_warehouse_id").on(table.warehouseId).where(sql`deleted_at IS NULL`),
  editionWarehouseUnique: unique().on(table.editionId, table.warehouseId),
  quantityOnHandCheck: check("ck_inventory_quantity_on_hand", sql`${table.quantityOnHand} >= 0`),
  quantityReservedCheck: check("ck_inventory_quantity_reserved", sql`${table.quantityReserved} >= 0`),
}));

export const distributor = pgTable("distributor", {
  distributorId: varchar("distributor_id", { length: 15 }).primaryKey(),
  nameBn: text("name_bn").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  websiteUrl: text("website_url"),
  addressId: varchar("address_id", { length: 15 }),
  serviceAreas: text("service_areas"),
  verificationLevel: text("verification_level"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  slugIdx: index("idx_distributor_slug").on(table.slug).where(sql`deleted_at IS NULL`),
  addressIdIdx: index("idx_distributor_address_id").on(table.addressId).where(sql`deleted_at IS NULL`),
  addressFk: foreignKey({ columns: [table.addressId], foreignColumns: [address.addressId] }),
}));

export const bookstore = pgTable("bookstore", {
  bookstoreId: varchar("bookstore_id", { length: 15 }).primaryKey(),
  nameBn: text("name_bn").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  websiteUrl: text("website_url"),
  addressId: varchar("address_id", { length: 15 }),
  storeType: text("store_type").notNull().default("physical"),
  isActive: boolean("is_active").notNull().default(true),
  verificationLevel: text("verification_level"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  slugIdx: index("idx_bookstore_slug").on(table.slug).where(sql`deleted_at IS NULL`),
  addressIdIdx: index("idx_bookstore_address_id").on(table.addressId).where(sql`deleted_at IS NULL`),
  isActiveIdx: index("idx_bookstore_is_active").on(table.isActive).where(sql`deleted_at IS NULL`),
  addressFk: foreignKey({ columns: [table.addressId], foreignColumns: [address.addressId] }),
}));
