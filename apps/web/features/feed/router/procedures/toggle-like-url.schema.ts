import { userUrlIdSchema } from "@workspace/user-url/id/user-url-id.schema";
import { z } from "zod";

export const toggleLikeUrlSchema = z.object({
  userUrlId: userUrlIdSchema,
});
