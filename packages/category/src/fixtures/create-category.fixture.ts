import { generateCategoryId } from "@workspace/category/id/generate-category-id";
import { schema } from "@workspace/db/db";
import { v4 as uuid } from "uuid";

export const createCategory = (overwrites: Partial<schema.Category> = {}): schema.Category => ({
  id: generateCategoryId(),
  userId: uuid(),
  name: "Category name",
  urlsCount: 0,
  createdAt: new Date(),
  updatedAt: null,
  ...overwrites,
});
