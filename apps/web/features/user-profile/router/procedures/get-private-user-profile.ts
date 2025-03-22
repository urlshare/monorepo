import { TRPCError } from "@trpc/server";

import { PrivateUserProfileVM, toPrivateUserProfileVM } from "../../models/private-user-profile.vm";
import { protectedProcedure } from "@/server/api/trpc";

export const getPrivateUserProfile = protectedProcedure.query<PrivateUserProfileVM>(
  async ({ ctx: { logger, requestId, user, db } }) => {
    const path = "userProfile.getPrivateUserProfile";
    const userId = user.id;

    logger.info({ requestId, path, userId }, "Get private user profile initiated.");

    const maybeUserProfile = await db.query.userProfiles.findFirst({
      where: (userProfiles, { eq }) => eq(userProfiles.userId, userId),
      columns: {
        username: true,
        imageUrl: true,
      },
      with: {
        user: {
          columns: {
            apiKey: true,
          },
        },
      },
    });

    if (maybeUserProfile && maybeUserProfile.user) {
      return toPrivateUserProfileVM({
        ...maybeUserProfile,
        id: userId,
        apiKey: maybeUserProfile.user.apiKey,
      });
    }

    logger.info({ requestId, path, userId }, "User not found");

    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  },
);
