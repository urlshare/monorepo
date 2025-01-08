import { publicProcedure } from "@/server/api/trpc";
import { getUserCategoriesSchema } from "./get-user-categories.schema";

export const getUserCategories = publicProcedure
  .input(getUserCategoriesSchema)
  .query(async ({ ctx: { logger, requestId, db }, input: { userId } }) => {
    const path = "category.getUserCategories";

    logger.info({ requestId, path, userId }, "Fetching user's categories.");

    const categories = await db.query.categories.findMany({
      columns: {
        id: true,
        name: true,
        urlsCount: true,
      },
      where: (categories, { eq }) => eq(categories.userId, userId),
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });

    logger.info({ requestId, path, userId }, "User's categories fetched.");

    return categories;
  });
