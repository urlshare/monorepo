import { usernameSchema } from "@workspace/user-profile/username/username.schema";
import { apiKeySchema } from "@workspace/user/api-key/api-key.schema";
import { z } from "zod";

export type CreateUserProfileSchema = z.infer<typeof createUserProfileSchema>;

export const NOT_ALLOWED_NORMALIZED_USERNAMES = ["admin", "urlshare", "contact", "accounting", "security"];

const restrictedUsernameSchema = usernameSchema.refine(
  (username) => {
    return !NOT_ALLOWED_NORMALIZED_USERNAMES.includes(username.toLowerCase());
  },
  {
    message: "Username not allowed.",
  },
);

export const createUserProfileSchema = z.object({
  apiKey: apiKeySchema,
  username: restrictedUsernameSchema,
});
