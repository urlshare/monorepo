import { TRPCError } from "@trpc/server";

import { toggleFollowUserSchema } from "./toggle-follow-user.schema";
import { orm, schema } from "@workspace/db/db";
import { protectedProcedure } from "@/server/api/trpc";

type ToggleFollowUserResult = {
  status: "following" | "unfollowed";
  userId: schema.User["id"];
};

export const toggleFollowUser = protectedProcedure
  .input(toggleFollowUserSchema)
  .mutation<ToggleFollowUserResult>(
    async ({ input: { userId: followingId }, ctx: { logger, requestId, user, db } }) => {
      const path = "followUser.toggleFollowUser";
      const followerId = user.id;

      logger.info({ requestId, path, followerId, followingId }, "Toggle following user initiated.");

      try {
        const maybeFollowing = await db.query.follows.findFirst({
          where: (follows, { and, eq }) =>
            and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)),
        });

        const notFollowing = Boolean(maybeFollowing) === false;

        if (notFollowing) {
          await db.transaction(async (tx) => {
            await tx.insert(schema.follows).values({
              followerId,
              followingId,
            });

            await tx
              .update(schema.userProfiles)
              .set({
                followingCount: orm.sql`${schema.userProfiles.followingCount} + 1`,
              })
              .where(orm.eq(schema.userProfiles.userId, followerId));

            await tx
              .update(schema.userProfiles)
              .set({
                followersCount: orm.sql`${schema.userProfiles.followersCount} + 1`,
              })
              .where(orm.eq(schema.userProfiles.userId, followingId));
          });

          logger.info({ requestId, path, followerId, followingId }, "Followed user.");

          return { status: "following", userId: followingId };
        } else {
          await db.transaction(async (tx) => {
            await tx
              .delete(schema.follows)
              .where(
                orm.and(orm.eq(schema.follows.followerId, followerId), orm.eq(schema.follows.followingId, followingId)),
              );

            await tx
              .update(schema.userProfiles)
              .set({
                followingCount: orm.sql`${schema.userProfiles.followingCount} - 1`,
              })
              .where(orm.eq(schema.userProfiles.userId, followerId));

            await tx
              .update(schema.userProfiles)
              .set({
                followersCount: orm.sql`${schema.userProfiles.followersCount} - 1`,
              })
              .where(orm.eq(schema.userProfiles.userId, followingId));
          });

          logger.info({ requestId, path, followerId, followingId }, "Unfollowed user.");

          return { status: "unfollowed", userId: followingId };
        }
      } catch (error) {
        logger.error({ requestId, path, followerId, followingId, error }, "Failed to (un)follow a user.");

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to (un)follow this user. Try again.",
          cause: error,
        });
      }
    },
  );
