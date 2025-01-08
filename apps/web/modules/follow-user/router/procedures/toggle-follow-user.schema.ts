import { userIdSchema } from "@workspace/user/id/user-id.schema";
import { z } from "zod";

export const toggleFollowUserSchema = z.object({
  userId: userIdSchema,
});
