import { TRPCError } from "@trpc/server";
import { schema } from "@workspace/db/db";

import { protectedProcedure } from "@/server/api/trpc";
import { createCategorySchema } from "./create-category.schema";

type CreatedCategoryResult = {
  categoryId: schema.Category["id"];
};

type CreateCategoryResult = CreatedCategoryResult;

export const createCategory = protectedProcedure
  .input(createCategorySchema)
  .mutation<CreateCategoryResult>(async ({ input: { name }, ctx: { logger, requestId, user, db } }) => {
    const path = "category.createCategory";
    const userId = user.id;

    const maybeCategory = await db.query.categories.findFirst({
      where: (categories, { and, eq }) => and(eq(categories.userId, userId), eq(categories.name, name)),
    });

    if (maybeCategory) {
      logger.error({ requestId, path }, `Category (${name}) exists.`);

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Category name exists. Use different category name.`,
      });
    }

    const [result] = await db
      .insert(schema.categories)
      .values({ userId, name })
      .returning({ insertedId: schema.categories.id });

    if (!result) {
      logger.error({ requestId, path }, `Category ID not retrieved for created category (${name}).`);

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Category could not be created.`,
      });
    }

    logger.info({ requestId, path, name }, "Category created.");

    return { categoryId: result.insertedId };
  });
