import { TRPCError } from "@trpc/server";

import { schema, orm } from "@workspace/db/db";
import { updateCategorySchema } from "./update-category.schema";
import { protectedProcedure } from "@/server/api/trpc";

export const updateCategory = protectedProcedure
  .input(updateCategorySchema)
  .mutation(async ({ input: { id, name }, ctx: { logger, requestId, user, db } }) => {
    const path = "category.updateCategory";
    const userId = user.id;

    const maybeCategory = await db.query.categories.findFirst({
      where: (categories, { and, eq }) => and(eq(categories.id, id), eq(categories.userId, userId)),
    });

    if (!maybeCategory) {
      logger.error({ requestId, path }, `Category (${name}) doesn't exist.`);

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Category (${name}) doesn't exists.`,
      });
    }

    const maybeExists = await db.query.categories.findFirst({
      where: (categories, { and, eq, not }) =>
        and(eq(categories.userId, userId), eq(categories.name, name), not(eq(categories.id, id))),
    });

    if (maybeExists) {
      logger.error({ requestId, path }, `Category (${name}) exists.`);

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Category name exists. Use different category name.`,
      });
    }

    const [updatedCategory] = await db
      .update(schema.categories)
      .set({
        name,
      })
      .where(orm.eq(schema.categories.id, id))
      .returning();

    logger.info({ requestId, path, name }, "Category updated.");

    if (!updatedCategory) {
      logger.error({ requestId, path }, "Category could not be updated.");

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Category could not be updated, try again.",
      });
    }

    return updatedCategory;
  });
