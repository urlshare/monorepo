import type { Category } from "@workspace/db/types";

export type GetCategoriesSuccessResponse = { categories: Pick<Category, "id" | "name" | "urlsCount">[] };
