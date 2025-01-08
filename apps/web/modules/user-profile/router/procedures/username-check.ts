import { protectedProcedure } from "@/server/api/trpc.js";
import { normalizeUsername } from "../../utils/normalize-username.js";
import { usernameCheckSchema } from "./username-check.schema.js";

export const usernameCheck = protectedProcedure
  .input(usernameCheckSchema)
  .mutation(async ({ input: { username }, ctx: { logger, requestId, db } }) => {
    const path = "userProfileData.usernameCheck";

    logger.info({ requestId, path, username }, "Checking username availability.");

    const usernameNormalized = normalizeUsername(username);

    const match = await db.query.userProfiles.findFirst({
      where: (userProfiles, { eq }) => eq(userProfiles.usernameNormalized, usernameNormalized),
    });
    const usernameAvailable = match === null;

    logger.info({ requestId, path, username, usernameAvailable }, "Username availability checked.");

    return { usernameAvailable };
  });
