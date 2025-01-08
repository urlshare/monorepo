import { z } from "zod";

import { categoryNameSchema } from "@workspace/category/name/category-name.schema";

export const addCategoryWithApiKeyHandlerBodyPayloadSchema = z.object({
  name: categoryNameSchema,
});
