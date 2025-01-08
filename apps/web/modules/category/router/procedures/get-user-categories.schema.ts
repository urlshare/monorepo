import { z } from "zod";
import { userIdSchema } from "@workspace/user/id/user-id.schema";

export const getUserCategoriesSchema = z.object({
  userId: userIdSchema,
});
