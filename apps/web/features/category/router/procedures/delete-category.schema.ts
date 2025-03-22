import { z } from "zod";
import { categoryIdSchema } from "@workspace/category/id/category-id.schema";

export type DeleteCategorySchema = z.infer<typeof deleteCategorySchema>;

export const deleteCategorySchema = z.object({
  id: categoryIdSchema,
});
