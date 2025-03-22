import { TRPCError } from "@trpc/server";

import { type PublicUserProfileVM, toPublicUserProfileVM } from "../../models/public-user-profile.vm";
import { publicProcedure } from "@/server/api/trpc";
import { getPublicUserProfileSchema } from "./get-public-user-profile.schema";
import { normalizeUsername } from "@workspace/user-profile/utils/normalize-username";

export const getPublicUserProfile = publicProcedure
  .input(getPublicUserProfileSchema)
  .query<PublicUserProfileVM>(async ({ ctx: { logger, requestId, db }, input: { username } }) => {
    const path = "userProfile.getPublicUserProfile";

    logger.info({ requestId, path, username }, "Get public user profile initiated.");

    const maybeUserProfile = await db.query.userProfiles.findFirst({
      where: (userProfiles, { eq }) => eq(userProfiles.usernameNormalized, normalizeUsername(username)),
    });

    if (maybeUserProfile) {
      return toPublicUserProfileVM(maybeUserProfile);
    }

    logger.info({ requestId, path, username }, "User not found");

    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  });
