import { TRPCError } from "@trpc/server";

import { toggleLikeUrlSchema } from "./toggle-like-url.schema";
import { Feed, UserUrl } from "@workspace/db/types";
import { protectedProcedure } from "@/server/api/trpc";
import { schema, orm } from "@workspace/db/db";

type ToggleLikeUrlResult = {
  status: "liked" | "unliked";
  likesCount: UserUrl["likesCount"];
  feedId: Feed["id"];
};

type UrlNotFound = {
  status: "notFound";
  feedId: Feed["id"];
};

export const toggleLikeUrl = protectedProcedure
  .input(toggleLikeUrlSchema)
  .mutation<UrlNotFound | ToggleLikeUrlResult>(async ({ input: { feedId }, ctx: { logger, requestId, user, db } }) => {
    const path = "likeUrl.toggleLikeUrl";
    const userId = user.id;

    logger.info({ requestId, path, userId, feedId }, "Toggle liking the URL.");

    try {
      const [maybeFeed] = await db
        .select({
          liked: schema.feeds.liked,
          userId: schema.feeds.userId,
          userUrlId: schema.feeds.userUrlId,
          authorId: schema.usersUrls.userId,
        })
        .from(schema.feeds)
        .leftJoin(schema.usersUrls, orm.eq(schema.feeds.userUrlId, schema.usersUrls.id))
        .where(orm.eq(schema.feeds.id, feedId))
        .limit(1);

      const feedNotFound = maybeFeed === undefined;

      if (feedNotFound) {
        return { status: "notFound", feedId };
      }

      const idOfProfileOwningTheUrl = maybeFeed.authorId;

      if (idOfProfileOwningTheUrl === null) {
        throw new Error("The URL author ID is null.");
      }

      // Liking
      if (!maybeFeed.liked) {
        const likesCount = await db.transaction(async (tx) => {
          const [[result]] = await Promise.all([
            tx
              .update(schema.usersUrls)
              .set({
                likesCount: orm.sql`${schema.usersUrls.likesCount} + 1`,
              })
              .where(orm.eq(schema.usersUrls.id, maybeFeed.userUrlId))
              .returning({ likesCount: schema.usersUrls.likesCount }),

            tx
              .update(schema.userProfiles)
              .set({
                likedCount: orm.sql`${schema.userProfiles.likedCount} + 1`,
              })
              .where(orm.eq(schema.userProfiles.userId, idOfProfileOwningTheUrl)),

            tx
              .update(schema.userProfiles)
              .set({
                likesCount: orm.sql`${schema.userProfiles.likesCount} + 1`,
              })
              .where(orm.eq(schema.userProfiles.userId, userId)),

            tx
              .update(schema.feeds)
              .set({
                liked: true,
              })
              .where(orm.eq(schema.feeds.id, feedId)),
          ]);

          return result?.likesCount as number;
        });

        logger.info({ requestId, path, userId, feedId }, "Liked the URL.");

        return { status: "liked", feedId, likesCount };
      }

      // Unliking
      const likesCount = await db.transaction(async (tx) => {
        const [[result]] = await Promise.all([
          tx
            .update(schema.usersUrls)
            .set({
              likesCount: orm.sql`${schema.usersUrls.likesCount} - 1`,
            })
            .where(orm.eq(schema.usersUrls.id, maybeFeed.userUrlId))
            .returning({ likesCount: schema.usersUrls.likesCount }),

          tx
            .update(schema.userProfiles)
            .set({
              likedCount: orm.sql`${schema.userProfiles.likedCount} - 1`,
            })
            .where(orm.eq(schema.userProfiles.userId, idOfProfileOwningTheUrl)),

          tx
            .update(schema.userProfiles)
            .set({
              likesCount: orm.sql`${schema.userProfiles.likesCount} - 1`,
            })
            .where(orm.eq(schema.userProfiles.userId, userId)),

          tx
            .update(schema.feeds)
            .set({
              liked: false,
            })
            .where(orm.eq(schema.feeds.id, feedId)),
        ]);

        return result?.likesCount as number;
      });

      logger.info({ requestId, path, userId, feedId }, "Unliked the URL.");

      return { status: "unliked", feedId, likesCount };
    } catch (error) {
      logger.error({ requestId, path, userId, feedId, error }, "Failed to (un)like a URL.");

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to (un)the URL. Try again.",
        cause: error,
      });
    }
  });
