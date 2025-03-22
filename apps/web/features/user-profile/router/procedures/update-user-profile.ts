import { protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { updateUserProfileSchema } from "./update-user-profile.schema";
import { orm, schema } from "@workspace/db/db";

export const updateUserProfile = protectedProcedure
  .input(updateUserProfileSchema)
  .mutation(async ({ input, ctx: { logger, requestId, user, db } }) => {
    const userId = user.id;
    const path = "userProfile.updateUserProfile";

    logger.info({ requestId, path }, "Updating user profile initiated.");

    const maybeUser = await db.query.users.findFirst({
      columns: {
        id: true,
      },
      where: (users, { eq }) => eq(users.id, userId),
    });

    if (!maybeUser) {
      logger.error({ requestId, path }, "Failed to update user profile.");

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User profile does not exist.",
      });
    }

    await db.update(schema.users).set(input).where(orm.eq(schema.users.id, userId));

    logger.info({ requestId, path }, "User profile update complete.");

    return true;
  });
