import { z } from "zod";

import { categoryIdSchema } from "./category-id.schema";

// TODO: perhaps this can be a simple function, not a zod schema
const categoryIdsStringToCategoryIds = z
  .string()
  .trim()
  .transform((categoryIds) => {
    return categoryIds.split(",").filter((maybeCategoryId) => {
      return categoryIdSchema.safeParse(maybeCategoryId).success;
    });
  });

export const getCategoryIdsFromSearchQuery = (maybeCategoryIds?: string | string[]) => {
  if (!maybeCategoryIds) {
    return [];
  }

  const result = categoryIdsStringToCategoryIds.safeParse(maybeCategoryIds);

  if (!result.success) {
    return [];
  }

  return result.data;
};
