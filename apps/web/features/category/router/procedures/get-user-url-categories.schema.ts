import { z } from "zod";
import { userUrlIdSchema } from "@workspace/user-url/id/user-url-id.schema";

export const getUserUrlCategoriesSchema = z.object({
  userUrlId: userUrlIdSchema,
});
