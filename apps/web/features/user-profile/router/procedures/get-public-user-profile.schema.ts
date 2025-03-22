import { usernameSchema } from "@workspace/user-profile/username/schemas/username.schema";
import { z } from "zod";

export type GetPublicUserProfile = z.infer<typeof getPublicUserProfileSchema>;

export const getPublicUserProfileSchema = z.object({
  username: usernameSchema,
});
