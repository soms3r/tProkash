import {
  pgTable,
  varchar,
  text,
  boolean,
  integer,
  numeric,
  timestamp,
  primaryKey,
  index,
  foreignKey,
} from "drizzle-orm/pg-core";
import { book, edition, person, publisher, collection } from "./publishing";
import { category, tag, keyword, contributionRole, role, permission } from "./reference";
import { distributor, bookstore } from "./supplychain";
import { organization, award, event, contract, submission } from "./community";
import { source } from "./media";

export const bookAuthor = pgTable("book_author", {
  bookId: varchar("book_id", { length: 15 }).notNull(),
  personId: varchar("person_id", { length: 15 }).notNull(),
  authorOrder: integer("author_order"),
}, (table) => ({
  pk: primaryKey({ columns: [table.bookId, table.personId] }),
  personIdIdx: index("idx_book_author_person_id").on(table.personId),
  bookFk: foreignKey({ columns: [table.bookId], foreignColumns: [book.bookId] }),
  personFk: foreignKey({ columns: [table.personId], foreignColumns: [person.personId] }),
}));

export const bookContributor = pgTable("book_contributor", {
  bookId: varchar("book_id", { length: 15 }).notNull(),
  personId: varchar("person_id", { length: 15 }).notNull(),
  contributionRoleId: varchar("contribution_role_id", { length: 15 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.bookId, table.personId, table.contributionRoleId] }),
  personIdIdx: index("idx_book_contributor_person_id").on(table.personId),
  roleIdIdx: index("idx_book_contributor_role_id").on(table.contributionRoleId),
  bookFk: foreignKey({ columns: [table.bookId], foreignColumns: [book.bookId] }),
  personFk: foreignKey({ columns: [table.personId], foreignColumns: [person.personId] }),
  roleFk: foreignKey({ columns: [table.contributionRoleId], foreignColumns: [contributionRole.contributionRoleId] }),
}));

export const bookPublisher = pgTable("book_publisher", {
  bookId: varchar("book_id", { length: 15 }).notNull(),
  publisherId: varchar("publisher_id", { length: 15 }).notNull(),
  role: text("role").notNull().default("publisher"),
}, (table) => ({
  pk: primaryKey({ columns: [table.bookId, table.publisherId] }),
  publisherIdIdx: index("idx_book_publisher_publisher_id").on(table.publisherId),
  bookFk: foreignKey({ columns: [table.bookId], foreignColumns: [book.bookId] }),
  publisherFk: foreignKey({ columns: [table.publisherId], foreignColumns: [publisher.publisherId] }),
}));

export const bookCategory = pgTable("book_category", {
  bookId: varchar("book_id", { length: 15 }).notNull(),
  categoryId: varchar("category_id", { length: 15 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.bookId, table.categoryId] }),
  categoryIdIdx: index("idx_book_category_category_id").on(table.categoryId),
  bookFk: foreignKey({ columns: [table.bookId], foreignColumns: [book.bookId] }),
  categoryFk: foreignKey({ columns: [table.categoryId], foreignColumns: [category.categoryId] }),
}));

export const bookCollection = pgTable("book_collection", {
  bookId: varchar("book_id", { length: 15 }).notNull(),
  collectionId: varchar("collection_id", { length: 15 }).notNull(),
  addedDate: timestamp("added_date", { withTimezone: true }),
}, (table) => ({
  pk: primaryKey({ columns: [table.bookId, table.collectionId] }),
  collectionIdIdx: index("idx_book_collection_collection_id").on(table.collectionId),
  bookFk: foreignKey({ columns: [table.bookId], foreignColumns: [book.bookId] }),
  collectionFk: foreignKey({ columns: [table.collectionId], foreignColumns: [collection.collectionId] }),
}));

export const bookTag = pgTable("book_tag", {
  bookId: varchar("book_id", { length: 15 }).notNull(),
  tagId: varchar("tag_id", { length: 15 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.bookId, table.tagId] }),
  tagIdIdx: index("idx_book_tag_tag_id").on(table.tagId),
  bookFk: foreignKey({ columns: [table.bookId], foreignColumns: [book.bookId] }),
  tagFk: foreignKey({ columns: [table.tagId], foreignColumns: [tag.tagId] }),
}));

export const bookKeyword = pgTable("book_keyword", {
  bookId: varchar("book_id", { length: 15 }).notNull(),
  keywordId: varchar("keyword_id", { length: 15 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.bookId, table.keywordId] }),
  keywordIdIdx: index("idx_book_keyword_keyword_id").on(table.keywordId),
  bookFk: foreignKey({ columns: [table.bookId], foreignColumns: [book.bookId] }),
  keywordFk: foreignKey({ columns: [table.keywordId], foreignColumns: [keyword.keywordId] }),
}));

export const bookAward = pgTable("book_award", {
  bookId: varchar("book_id", { length: 15 }).notNull(),
  awardId: varchar("award_id", { length: 15 }).notNull(),
  year: integer("year"),
}, (table) => ({
  pk: primaryKey({ columns: [table.bookId, table.awardId] }),
  awardIdIdx: index("idx_book_award_award_id").on(table.awardId),
  bookFk: foreignKey({ columns: [table.bookId], foreignColumns: [book.bookId] }),
  awardFk: foreignKey({ columns: [table.awardId], foreignColumns: [award.awardId] }),
}));

export const bookEvent = pgTable("book_event", {
  bookId: varchar("book_id", { length: 15 }).notNull(),
  eventId: varchar("event_id", { length: 15 }).notNull(),
  participationType: text("participation_type").notNull().default("featured"),
}, (table) => ({
  pk: primaryKey({ columns: [table.bookId, table.eventId] }),
  eventIdIdx: index("idx_book_event_event_id").on(table.eventId),
  bookFk: foreignKey({ columns: [table.bookId], foreignColumns: [book.bookId] }),
  eventFk: foreignKey({ columns: [table.eventId], foreignColumns: [event.eventId] }),
}));

export const editionDistributor = pgTable("edition_distributor", {
  editionId: varchar("edition_id", { length: 15 }).notNull(),
  distributorId: varchar("distributor_id", { length: 15 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
}, (table) => ({
  pk: primaryKey({ columns: [table.editionId, table.distributorId] }),
  distributorIdIdx: index("idx_edition_distributor_distributor_id").on(table.distributorId),
  editionFk: foreignKey({ columns: [table.editionId], foreignColumns: [edition.editionId] }),
  distributorFk: foreignKey({ columns: [table.distributorId], foreignColumns: [distributor.distributorId] }),
}));

export const distributorBookstore = pgTable("distributor_bookstore", {
  distributorId: varchar("distributor_id", { length: 15 }).notNull(),
  bookstoreId: varchar("bookstore_id", { length: 15 }).notNull(),
  contractRef: text("contract_ref"),
  isActive: boolean("is_active").notNull().default(true),
}, (table) => ({
  pk: primaryKey({ columns: [table.distributorId, table.bookstoreId] }),
  bookstoreIdIdx: index("idx_distributor_bookstore_bookstore_id").on(table.bookstoreId),
  distributorFk: foreignKey({ columns: [table.distributorId], foreignColumns: [distributor.distributorId] }),
  bookstoreFk: foreignKey({ columns: [table.bookstoreId], foreignColumns: [bookstore.bookstoreId] }),
}));

export const bookstoreInventory = pgTable("bookstore_inventory", {
  bookstoreId: varchar("bookstore_id", { length: 15 }).notNull(),
  editionId: varchar("edition_id", { length: 15 }).notNull(),
  quantityOnHand: integer("quantity_on_hand"),
  priceBdt: numeric("price_bdt", { precision: 12, scale: 2 }),
}, (table) => ({
  pk: primaryKey({ columns: [table.bookstoreId, table.editionId] }),
  editionIdIdx: index("idx_bookstore_inventory_edition_id").on(table.editionId),
  bookstoreFk: foreignKey({ columns: [table.bookstoreId], foreignColumns: [bookstore.bookstoreId] }),
  editionFk: foreignKey({ columns: [table.editionId], foreignColumns: [edition.editionId] }),
}));

export const contractParty = pgTable("contract_party", {
  contractId: varchar("contract_id", { length: 15 }).notNull(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  partyRole: text("party_role"),
}, (table) => ({
  pk: primaryKey({ columns: [table.contractId, table.entityType, table.entityId] }),
  entityIdx: index("idx_contract_party_entity").on(table.entityType, table.entityId),
  contractFk: foreignKey({ columns: [table.contractId], foreignColumns: [contract.contractId] }),
}));

export const contractBook = pgTable("contract_book", {
  contractId: varchar("contract_id", { length: 15 }).notNull(),
  bookId: varchar("book_id", { length: 15 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.contractId, table.bookId] }),
  bookIdIdx: index("idx_contract_book_book_id").on(table.bookId),
  contractFk: foreignKey({ columns: [table.contractId], foreignColumns: [contract.contractId] }),
  bookFk: foreignKey({ columns: [table.bookId], foreignColumns: [book.bookId] }),
}));

export const submissionAuthor = pgTable("submission_author", {
  submissionId: varchar("submission_id", { length: 15 }).notNull(),
  personId: varchar("person_id", { length: 15 }).notNull(),
  isPrimaryContact: boolean("is_primary_contact").notNull().default(false),
}, (table) => ({
  pk: primaryKey({ columns: [table.submissionId, table.personId] }),
  personIdIdx: index("idx_submission_author_person_id").on(table.personId),
  submissionFk: foreignKey({ columns: [table.submissionId], foreignColumns: [submission.submissionId] }),
  personFk: foreignKey({ columns: [table.personId], foreignColumns: [person.personId] }),
}));

export const eventParticipant = pgTable("event_participant", {
  eventId: varchar("event_id", { length: 15 }).notNull(),
  personId: varchar("person_id", { length: 15 }).notNull(),
  participantRole: text("participant_role").notNull().default("attendee"),
}, (table) => ({
  pk: primaryKey({ columns: [table.eventId, table.personId] }),
  personIdIdx: index("idx_event_participant_person_id").on(table.personId),
  eventFk: foreignKey({ columns: [table.eventId], foreignColumns: [event.eventId] }),
  personFk: foreignKey({ columns: [table.personId], foreignColumns: [person.personId] }),
}));

export const organizationMember = pgTable("organization_member", {
  organizationId: varchar("organization_id", { length: 15 }).notNull(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  membershipRole: text("membership_role").notNull().default("member"),
  joinDate: timestamp("join_date", { withTimezone: true }),
}, (table) => ({
  pk: primaryKey({ columns: [table.organizationId, table.entityType, table.entityId] }),
  entityIdx: index("idx_organization_member_entity").on(table.entityType, table.entityId),
  organizationFk: foreignKey({ columns: [table.organizationId], foreignColumns: [organization.organizationId] }),
}));

export const entityTag = pgTable("entity_tag", {
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  tagId: varchar("tag_id", { length: 15 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.entityType, table.entityId, table.tagId] }),
  tagIdIdx: index("idx_entity_tag_tag_id").on(table.tagId),
  tagFk: foreignKey({ columns: [table.tagId], foreignColumns: [tag.tagId] }),
}));

export const entitySource = pgTable("entity_source", {
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  sourceId: varchar("source_id", { length: 15 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.entityType, table.entityId, table.sourceId] }),
  sourceIdIdx: index("idx_entity_source_source_id").on(table.sourceId),
  sourceFk: foreignKey({ columns: [table.sourceId], foreignColumns: [source.sourceId] }),
}));

export const rolePermission = pgTable("role_permission", {
  roleId: varchar("role_id", { length: 15 }).notNull(),
  permissionId: varchar("permission_id", { length: 15 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
  permissionIdIdx: index("idx_role_permission_permission_id").on(table.permissionId),
  roleFk: foreignKey({ columns: [table.roleId], foreignColumns: [role.roleId] }),
  permissionFk: foreignKey({ columns: [table.permissionId], foreignColumns: [permission.permissionId] }),
}));
