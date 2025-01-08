import { generateCategoryId } from "@workspace/category/id/generate-category-id";
import { schema } from "@workspace/db/db";
import { generateUserId } from "@workspace/user/id/generate-user-id";

export const createCategory = (overwrites: Partial<schema.Category> = {}): schema.Category => ({
  id: generateCategoryId(),
  userId: generateUserId(),
  name: "Category name",
  urlsCount: 0,
  createdAt: new Date(),
  updatedAt: null,
  ...overwrites,
});
