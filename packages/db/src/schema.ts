import { generateUrlId, URL_ID_LENGTH } from "@workspace/url/id/generate-url-id";
import { generateUserProfileId, USER_PROFILE_ID_LENGTH } from "@workspace/user-profile/id/generate-user-profile-id";

import { sql, InferSelectModel, relations } from "drizzle-orm";
import { authUsers } from "drizzle-orm/supabase";
import {
  bigint,
  bigserial,
  char,
  index,
  integer,
  json,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { USERNAME_MAX_LENGTH } from "@workspace/user-profile/username/username.schema";
import { CATEGORY_ID_LENGTH, generateCategoryId } from "@workspace/category/id/generate-category-id";
import { CATEGORY_NAME_MAX_LENGTH } from "@workspace/category/name/category-name.schema";
import { generateUserUrlId, USER_URL_ID_SIZE } from "@workspace/user-url/id/generate-user-url-id";
import { generateUserId, USER_ID_LENGTH } from "@workspace/user/id/generate-user-id";
import { API_KEY_LENGTH } from "@workspace/user/api-key/generate-api-key";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
const createTable = pgTableCreator((name) => `urlshare_${name}`);

export const users = createTable("users", {
  id: char("id", { length: USER_ID_LENGTH })
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateUserId()),
  userId: uuid("user_id")
    .notNull()
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
  userId: char("user_id", { length: USER_ID_LENGTH })
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
  // Reserved for SHA1 hash - required as long URLs will create too long index keys
  // or even long enough ones that will not work with some databases
  urlHash: char("url_hash", { length: 40 }).unique().notNull(),
  metadata: json("metadata").default({}).notNull(),
});

export type Url = InferSelectModel<typeof urls>;

export const usersUrls = createTable(
  "users_urls",
  {
    id: char("id", { length: USER_URL_ID_SIZE })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateUserUrlId()),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
    userId: char("user_id", { length: USER_ID_LENGTH })
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
    userId: char("user_id", { length: USER_ID_LENGTH })
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
    userUrlId: char("user_url_id", { length: USER_URL_ID_SIZE })
      .notNull()
      .references(() => usersUrls.id, { onDelete: "cascade" }),
    categoryId: char("category_id", { length: CATEGORY_ID_LENGTH })
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
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
    id: bigserial("id", { mode: "number" }).notNull().primaryKey(),
    followerId: char("follower_id", { length: USER_ID_LENGTH })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: char("following_id", { length: USER_ID_LENGTH })
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

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  urls: many(usersUrls),
  categories: many(categories),
  followers: many(follows, { relationName: "followers" }),
  following: many(follows, { relationName: "following" }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const urlsRelations = relations(urls, ({ many }) => ({
  usersUrls: many(usersUrls),
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
