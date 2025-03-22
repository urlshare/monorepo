import { categoryNameSchema } from "@workspace/category/name/category-name.schema";
import { z } from "zod";

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;

export const createCategorySchema = z.object({
  name: categoryNameSchema,
});
