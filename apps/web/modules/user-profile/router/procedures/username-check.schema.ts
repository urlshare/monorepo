import { usernameSchema } from "@workspace/user-profile/username/username.schema";
import { z } from "zod";

export const usernameCheckSchema = z.object({
  username: usernameSchema,
});
