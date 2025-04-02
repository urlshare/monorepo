import { TRPCError } from "@trpc/server";
import { categoryIdSchema } from "@workspace/category/id/category-id.schema";
import { userIdSchema } from "@workspace/user/id/user-id.schema";
import { z } from "zod";

import { protectedProcedure } from "@/server/api/trpc";

import { FeedVM, toFeedVM } from "../../models/feed.vm";
import { getUserFeedQuery } from "../../queries/get-user-feed";
import { feedSourceSchema } from "../../shared/feed-source";

type QuerySchema = z.infer<typeof querySchema>;

const querySchema = z.object({
  cursor: z.date().optional(),
  userId: userIdSchema,
  feedSource: feedSourceSchema,
  categoryIds: z.array(categoryIdSchema).optional().default([]),
});

export type GetUserFeedResponse = {
  feed: ReadonlyArray<FeedVM>;
  nextCursor?: QuerySchema["cursor"];
};

const itemsPerFetch = 10;

export const getUserFeed = protectedProcedure
  .input(querySchema)
  .query<GetUserFeedResponse>(async ({ ctx: { logger, requestId, user }, input }) => {
    // Needs to be hardcoded and reflect the wrapper (feed) and the name of the procedure (getUserFeeds)
    // Will need to come up with a better solution for this so that this is autogenerated and reflects
    // the path used in logger in isAuthenticated middleware, which detects exactly that path, based on
    // those variable names.
    const path = "feed.getUserFeed";

    try {
      logger.info({ requestId, path }, "Fetching user's feed list.");

      const feedRawEntries = await getUserFeedQuery({
        userId: input.userId,
        viewerId: user?.id,
        limit: itemsPerFetch,
        cursor: input.cursor,
        feedSource: input.feedSource,
        categoryIds: input.categoryIds,
      });

      const feed = feedRawEntries.map((entry) => toFeedVM(entry));

      logger.info({ requestId, path, userId: input.userId }, "User's feed list fetched.");

      let nextCursor: QuerySchema["cursor"] = undefined;

      if (feedRawEntries.length === itemsPerFetch && feedRawEntries.length > 0) {
        nextCursor = feedRawEntries[feedRawEntries.length - 1]?.feed_createdAt;
      }

      return {
        feed,
        nextCursor,
      };
    } catch (error) {
      logger.error({ requestId, path, error }, "Failed to fetch user's feed list.");

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch user's feed list.",
        cause: error,
      });
    }
  });
