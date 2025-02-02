import { TRPCError } from "@trpc/server";

import { updateUserSchema } from "./update-user.schema";
import { protectedProcedure } from "@/server/api/trpc";
import { orm, schema } from "@workspace/db/db";

export const updateUser = protectedProcedure
  .input(updateUserSchema)
  .mutation(async ({ input, ctx: { logger, requestId, user, db } }) => {
    const userId = user.id;
    const path = "user.updateUser";

    logger.info({ requestId, path }, "Updating user initiated.");

    const maybeUser = await db.query.users.findFirst({
      columns: {
        id: true,
      },
      where: (users, { eq }) => eq(users.id, userId),
    });

    if (!maybeUser) {
      logger.error({ requestId, path }, "Failed to update user.");

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User does not exist.",
      });
    }

    await db.update(schema.users).set(input).where(orm.eq(schema.users.id, userId));

    logger.info({ requestId, path }, "User profile update complete.");
  });
