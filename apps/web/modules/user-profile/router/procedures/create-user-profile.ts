import { TRPCError } from "@trpc/server";
import { orm, schema } from "@workspace/db/db";

import { normalizeUsername } from "../../utils/normalize-username.js";
import { createUserProfileSchema } from "./create-user-profile.schema.js";
import { protectedProcedure } from "@/server/api/trpc.js";

export const createUserProfile = protectedProcedure
  .input(createUserProfileSchema)
  .mutation(async ({ input, ctx: { logger, requestId, user, db } }) => {
    const userId = user.id;
    const path = "userProfile.createUserProfile";

    logger.info({ requestId, path }, "Creating user profile initiated.");

    const maybeUserProfileData = await db.query.userProfiles.findFirst({
      columns: {
        id: true,
      },
      where: (userProfiles, { eq }) => eq(userProfiles.userId, userId),
    });

    if (maybeUserProfileData) {
      logger.error({ requestId, path }, "Failed to store the URL.");

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User profile already exists.",
      });
    }

    const userProfile = await db.transaction(async (tx) => {
      await tx
        .update(schema.users)
        .set({
          role: "USER",
          apiKey: input.apiKey,
        })
        .where(orm.eq(schema.users.id, userId));

      const [result] = await tx
        .insert(schema.userProfiles)
        .values({
          userId,
          username: input.username,
          usernameNormalized: normalizeUsername(input.username),
          imageUrl: user.user_metadata.avatar_url,
        })
        .returning();

      return result;
    });

    if (!userProfile) {
      logger.error({ requestId, path }, "Failed to create user profile.");

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to create user profile.",
      });
    }

    logger.info({ requestId, path }, "User profile creation complete.");

    return userProfile;
  });
