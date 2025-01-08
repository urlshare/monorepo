import { TRPCError } from "@trpc/server";

import { PrivateUserProfileVM, toPrivateUserProfileVM } from "../../models/private-user-profile.vm.js";
import { protectedProcedure } from "@/server/api/trpc.js";

export const getPrivateUserProfile = protectedProcedure.query<PrivateUserProfileVM>(
  async ({ ctx: { logger, requestId, user, db } }) => {
    const path = "userProfile.getPrivateUserProfile";
    const userId = user.id;

    logger.info({ requestId, path, userId }, "Get private user profile initiated.");

    const maybeUserProfile = await db.query.userProfiles.findFirst({
      where: (userProfiles, { eq }) => eq(userProfiles.userId, userId),
      columns: {
        username: true,
      },
      with: {
        users: {
          columns: {
            id: true,
            apiKey: true,
          },
        },
      },
    });

    if (maybeUserProfile && maybeUserProfile.users) {
      return toPrivateUserProfileVM({
        ...maybeUserProfile,
        id: maybeUserProfile.users.id,
        apiKey: maybeUserProfile.users.apiKey,
      });
    }

    logger.info({ requestId, path, userId }, "User not found");

    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  },
);
