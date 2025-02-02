import { db, schema, orm } from "@workspace/db/db";
import { User } from "@workspace/db/types";

export const getUserCategories = async (userId: User["id"]) => {
  return await db.query.categories.findMany({
    columns: {
      id: true,
      name: true,
      urlsCount: true,
    },
    where: (categories, { eq }) => eq(categories.userId, userId),
    orderBy: (categories, { asc }) => [asc(categories.name)],
  });
};

type CategoryIds = schema.Category["id"][];

// TODO: see if those are needed, as they probably could be inlined

export const incrementUrlsCount = async ({ categoryIds }: { categoryIds: CategoryIds }) => {
  await db
    .update(schema.categories)
    .set({
      urlsCount: orm.sql`${schema.categories.urlsCount} + 1`,
    })
    .where(orm.inArray(schema.categories.id, categoryIds));
};

export const assignCategoriesToUserUrl = async ({
  categoryIds,
  userUrlId,
}: {
  categoryIds: CategoryIds;
  userUrlId: schema.UserUrl["id"];
}) => {
  await db.insert(schema.userUrlsCategories).values(categoryIds.map((categoryId) => ({ categoryId, userUrlId })));
};
