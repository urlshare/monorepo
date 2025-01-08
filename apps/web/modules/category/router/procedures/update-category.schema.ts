import { categoryIdSchema } from "@workspace/category/id/category-id.schema";
import { categoryNameSchema } from "@workspace/category/name/category-name.schema";
import { z } from "zod";

export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;

export const updateCategorySchema = z.object({
  id: categoryIdSchema,
  name: categoryNameSchema,
});
