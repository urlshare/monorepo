import { CATEGORY_ID_LENGTH, generateCategoryId } from "@workspace/category/id/generate-category-id";
import { CATEGORY_NAME_MAX_LENGTH } from "@workspace/category/name/category-name.schema";
import { FEED_ID_LENGTH, generateFeedId } from "@workspace/feed/id/generate-feed-id";
import { FEED_INTERACTION_ID_LENGTH } from "@workspace/feed-interaction/id/generate-feed-interaction-id";
import { CompressedMetadata } from "@workspace/metadata/compression";
import { generateUrlId, URL_ID_LENGTH } from "@workspace/url/id/generate-url-id";
import { API_KEY_LENGTH } from "@workspace/user/api-key/generate-api-key";
import { generateUserProfileId, USER_PROFILE_ID_LENGTH } from "@workspace/user-profile/id/generate-user-profile-id";
import { USERNAME_MAX_LENGTH } from "@workspace/user-profile/username/schemas/username.schema";
import { generateUserUrlId, USER_URL_ID_LENGTH } from "@workspace/user-url/id/generate-user-url-id";
import { InferSelectModel, relations, sql } from "drizzle-orm";
import {
  bigint,
  bigserial,
  boolean,
  char,
  index,
  integer,
  jsonb,
  pgTableCreator,
  primaryKey,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
const createTable = pgTableCreator((name) => `urlshare_${name}`);

// TODO: add role, as it will be used for basic/pro users
export const users = createTable("users", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  apiKey: char("api_key", { length: API_KEY_LENGTH }),
});

export type User = InferSelectModel<typeof users>;

export const userProfiles = createTable("user_profiles", {
  id: char("id", { length: USER_PROFILE_ID_LENGTH })
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateUserProfileId()),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  username: varchar("username", { length: USERNAME_MAX_LENGTH }).unique().notNull(),
  usernameNormalized: varchar("username_normalized", { length: USERNAME_MAX_LENGTH }).unique().notNull(),
  imageUrl: text("image_url"),
  followingCount: integer("following_count").default(0).notNull(),
  followersCount: integer("followers_count").default(0).notNull(),
  likesCount: integer("likes_count").default(0).notNull(),
  likedCount: bigint("liked_count", { mode: "number" }).default(0).notNull(),
  urlsCount: integer("urls_count").default(0).notNull(),
});

export type UserProfile = InferSelectModel<typeof userProfiles>;

export const urls = createTable("urls", {
  id: char("id", { length: URL_ID_LENGTH })
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateUrlId()),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  url: text("url").notNull(),
  // This is a hash of url, title, image url. Even it image url is not present, hash will be created without it
  compoundHash: char("compound_hash", { length: 64 }).unique().notNull(),
  metadata: jsonb("metadata").default({}).notNull().$type<CompressedMetadata>(),
});

export type Url = InferSelectModel<typeof urls>;

export const urlHashes = createTable(
  "url_hashes",
  {
    compoundHash: char("compound_hash", { length: 64 })
      .primaryKey()
      .notNull()
      .references(() => urls.compoundHash, { onDelete: "cascade" }),
    // Hash of the URL alone, must not be unique, as the compound hash is the unique one
    urlHash: char("url_hash", { length: 40 }).notNull(),
    // How many times urlHash with combination of compoundHash has been used.
    // When the same urlHash is used with different compoundHash, it means the same URL
    // has different metadata (that are used to generate compoundHash), and we can tell
    // that a URL (urlHash) has been shared multiple times differently.
    // Ideally, we want every unique urlHash value appearing only once in this table.
    // If it will be more, use url_hashes_compound_hashes_counts for the count.
    count: integer("count").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index().on(table.urlHash), unique().on(table.compoundHash, table.urlHash)],
);

export type UrlHashes = InferSelectModel<typeof urlHashes>;

// This table is created so that counting the number of compound hashes for a urlHash is faster,
// as it is stored and updated in this table. Therefore it will be easy to find any urlHash
// that is used multiple times with different compound hashes.
// Use url_hashes table for the actual data, in combination with urls table.
export const urlHashesCompoundHashesCounts = createTable("url_hashes_compound_hashes_counts", {
  urlHash: char("url_hash", { length: 40 }).primaryKey().notNull(),
  compoundHashesCount: integer("compound_hashes_count").default(0).notNull(),
});

export type UrlHashCompoundHashesCount = InferSelectModel<typeof urlHashesCompoundHashesCounts>;

export const usersUrls = createTable(
  "users_urls",
  {
    id: char("id", { length: USER_URL_ID_LENGTH })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateUserUrlId()),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    urlId: char("url_id", { length: URL_ID_LENGTH })
      .notNull()
      .references(() => urls.id, { onDelete: "cascade" }),
    likesCount: integer("likes_count").default(0).notNull(),
  },
  (table) => [index().on(table.userId), index().on(table.urlId)],
);

export type UserUrl = InferSelectModel<typeof usersUrls>;

export const categories = createTable(
  "categories",
  {
    id: char("id", { length: CATEGORY_ID_LENGTH })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateCategoryId()),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
    name: varchar("name", { length: CATEGORY_NAME_MAX_LENGTH }).notNull(),
    urlsCount: integer("urls_count").default(0).notNull(),
  },
  (table) => [unique().on(table.userId, table.name), index().on(table.userId)],
);

export type Category = InferSelectModel<typeof categories>;

export const userUrlsCategories = createTable(
  "user_urls_categories",
  {
    userUrlId: char("user_url_id", { length: USER_URL_ID_LENGTH })
      .notNull()
      .references(() => usersUrls.id, { onDelete: "cascade" }),
    categoryId: char("category_id", { length: CATEGORY_ID_LENGTH })
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    categoryOrder: smallint("category_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userUrlId, table.categoryId] }),
    index().on(table.userUrlId),
    index().on(table.categoryId),
  ],
);

export type UserUrlCategory = InferSelectModel<typeof userUrlsCategories>;

export const follows = createTable(
  "follows",
  {
    // Needed for future queueing of follow/unfollow actions
    // This id, being sequential, is a unique value for each follower.
    // createdAt might not be unique, as multiple follows can happen at the same time.
    id: bigserial("id", { mode: "number" }).notNull().primaryKey(),
    followerId: uuid("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: uuid("following_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    unique().on(table.followerId, table.followingId),
    index().on(table.followerId),
    index().on(table.followingId),
  ],
);

export type Follow = InferSelectModel<typeof follows>;

export const feeds = createTable(
  "feeds",
  {
    id: char("id", { length: FEED_ID_LENGTH })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateFeedId()),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    userUrlId: char("user_url_id", { length: USER_URL_ID_LENGTH })
      .notNull()
      .references(() => usersUrls.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  },
  (table) => [index().on(table.userId), index().on(table.userUrlId)],
);

export type Feed = InferSelectModel<typeof feeds>;

export const feedInteractions = createTable(
  "feed_interactions",
  {
    id: char("id", { length: FEED_INTERACTION_ID_LENGTH })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateFeedId()),
    feedId: char("feed_id", { length: FEED_ID_LENGTH })
      .notNull()
      .references(() => feeds.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    liked: boolean("liked").default(false).notNull(),
  },
  (table) => [unique().on(table.feedId, table.userId), index().on(table.feedId), index().on(table.userId)],
);

export type FeedInteraction = InferSelectModel<typeof feedInteractions>;

export const feedsRelations = relations(feeds, ({ one }) => ({
  users: one(users, {
    fields: [feeds.userId],
    references: [users.id],
  }),
  userUrls: one(usersUrls, {
    fields: [feeds.userUrlId],
    references: [usersUrls.id],
  }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  urls: many(usersUrls),
  categories: many(categories),
  followers: many(follows, { relationName: "followers" }),
  following: many(follows, { relationName: "following" }),
  feeds: many(feeds),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const urlsRelations = relations(urls, ({ one, many }) => ({
  usersUrls: many(usersUrls),
  urlHashes: one(urlHashes, {
    fields: [urls.compoundHash],
    references: [urlHashes.compoundHash],
  }),
}));

export const urlHashesRelations = relations(urlHashes, ({ one }) => ({
  url: one(urls, {
    fields: [urlHashes.compoundHash],
    references: [urls.compoundHash],
  }),
}));

export const usersUrlsRelations = relations(usersUrls, ({ one, many }) => ({
  user: one(users, {
    fields: [usersUrls.userId],
    references: [users.id],
  }),
  url: one(urls, {
    fields: [usersUrls.urlId],
    references: [urls.id],
  }),
  categories: many(userUrlsCategories),
  feeds: many(feeds),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  urls: many(userUrlsCategories),
}));

export const userUrlsCategoriesRelations = relations(userUrlsCategories, ({ one }) => ({
  usersUrl: one(usersUrls, {
    fields: [userUrlsCategories.userUrlId],
    references: [usersUrls.id],
  }),
  category: one(categories, {
    fields: [userUrlsCategories.categoryId],
    references: [categories.id],
  }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: "followers",
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
    relationName: "following",
  }),
}));
