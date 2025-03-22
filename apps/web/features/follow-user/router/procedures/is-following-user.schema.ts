import { userIdSchema } from "@workspace/user/id/user-id.schema";
import { z } from "zod";

export const isFollowingUserSchema = z.object({
  userId: userIdSchema,
});
