import { FeedSourceValue } from "../shared/feed-source";
import { db, orm, schema } from "@workspace/db/db";
import { Category, Feed, User } from "@workspace/db/types";

type GetUserFeedQueryOptions = {
  userId: User["id"];
  limit: number;
  cursor?: Feed["createdAt"];
  feedSource?: FeedSourceValue;
  categoryIds: Category["id"][];
};

const createCategoriesHavingQuery = (categoryIds: Category["id"][]) => {
  return orm.sql`
      COUNT(DISTINCT CASE 
        WHEN ${schema.categories.id} IN (${orm.sql.join(categoryIds, orm.sql.raw(","))}) 
        THEN ${schema.categories.id} 
      END) >= ${categoryIds.length}
    `;
};

export const getUserFeedQuery = ({ userId, limit, cursor, feedSource, categoryIds }: GetUserFeedQueryOptions) => {
  const query = db
    .select({
      user_username: schema.userProfiles.username,
      user_imageUrl: schema.userProfiles.imageUrl,
      user_userId: schema.userProfiles.userId,
      feed_id: schema.feeds.id,
      feed_createdAt: schema.feeds.createdAt,
      feed_liked: schema.feedInteractions.liked,
      url_url: schema.urls.url,
      url_metadata: schema.urls.metadata,
      url_likesCount: schema.usersUrls.likesCount,
      userUrl_id: schema.feeds.userUrlId,
      category_names: orm.sql<string | null>`STRING_AGG(DISTINCT ${schema.categories.name}, ', ')`,
    })
    .from(schema.feeds)
    .leftJoin(
      schema.feedInteractions,
      orm.and(orm.eq(schema.feedInteractions.feedId, schema.feeds.id), orm.eq(schema.feedInteractions.userId, userId)),
    )
    .leftJoin(schema.usersUrls, orm.eq(schema.feeds.userUrlId, schema.usersUrls.id))
    .leftJoin(schema.urls, orm.eq(schema.usersUrls.urlId, schema.urls.id))
    .leftJoin(schema.userUrlsCategories, orm.eq(schema.usersUrls.id, schema.userUrlsCategories.userUrlId))
    .leftJoin(schema.categories, orm.eq(schema.userUrlsCategories.categoryId, schema.categories.id))
    .leftJoin(schema.userProfiles, orm.eq(schema.usersUrls.userId, schema.userProfiles.userId))
    .groupBy(
      schema.feeds.id,
      schema.userProfiles.username,
      schema.userProfiles.imageUrl,
      schema.userProfiles.userId,
      schema.feeds.createdAt,
      schema.feedInteractions.liked,
      schema.urls.url,
      schema.urls.metadata,
      schema.usersUrls.likesCount,
      schema.feeds.userUrlId,
    )
    .orderBy(orm.desc(schema.feeds.createdAt));

  const includeCategories = categoryIds.length > 0;

  const userUrlsCategoriesFilter = orm.aliasedTable(schema.userUrlsCategories, "UserUrlCategoryFilter");

  const userCondition = orm.eq(schema.feeds.userId, userId);
  const authorCondition = orm.eq(schema.userProfiles.userId, userId);
  const categoryCondition = orm.inArray(userUrlsCategoriesFilter.categoryId, categoryIds);

  if (includeCategories) {
    query
      .leftJoin(userUrlsCategoriesFilter, orm.eq(schema.usersUrls.id, userUrlsCategoriesFilter.userUrlId))
      .having(createCategoriesHavingQuery(categoryIds));
  }

  if (feedSource === "author") {
    query.where(
      orm.and(
        userCondition,
        authorCondition,
        includeCategories ? categoryCondition : undefined,
        cursor ? orm.lt(schema.feeds.createdAt, cursor) : undefined,
      ),
    );
  } else {
    query.where(
      orm.and(
        userCondition,
        includeCategories ? categoryCondition : undefined,
        cursor ? orm.lt(schema.feeds.createdAt, cursor) : undefined,
      ),
    );
  }

  query.limit(limit);

  // const { sql, params } = query.toSQL();

  // const formattedSQL = sql.replace(/\$(\d+)/g, (_, index) => {
  //   const value = params[parseInt(index) - 1]; // Convert 1-based index to 0-based
  //   return typeof value === "string" ? `'${value}'` : String(value);
  // });

  // console.log(formattedSQL);

  return query;
};
