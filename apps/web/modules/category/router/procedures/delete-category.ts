import { TRPCError } from "@trpc/server";

import { schema, orm } from "@workspace/db/db";
import { protectedProcedure } from "../../../../server/api/trpc";
import { deleteCategorySchema } from "./delete-category.schema";

export const deleteCategory = protectedProcedure
  .input(deleteCategorySchema)
  .mutation(async ({ input: { id }, ctx: { logger, requestId, user, db } }) => {
    const path = "category.deleteCategory";
    const userId = user.id;

    const maybeCategory = await db.query.categories.findFirst({
      where: (categories, { and, eq }) => and(eq(categories.userId, userId), eq(categories.id, id)),
    });

    if (!maybeCategory) {
      logger.error({ requestId, path }, `Category (${id}) doesn't exist.`);

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Category doesn't exists.`,
      });
    }

    await db.delete(schema.categories).where(orm.eq(schema.categories.id, id));

    logger.info({ requestId, path, id }, `Category (${id})} deleted.`);
  });
