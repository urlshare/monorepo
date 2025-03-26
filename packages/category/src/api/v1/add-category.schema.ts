import { categoryNameSchema } from "@workspace/category/name/category-name.schema";
import { z } from "zod";

export type AddCategoryBody = z.infer<typeof addCategoryBodySchema>;

export const addCategoryBodySchema = z.object({
  name: categoryNameSchema,
});

export type AddCategorySuccessResponse = { success: true };
