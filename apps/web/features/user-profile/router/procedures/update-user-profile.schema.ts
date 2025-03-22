import { apiKeySchema } from "@workspace/user/api-key/api-key.schema";
import { z } from "zod";

export type UpdateUserProfileSchema = z.infer<typeof updateUserProfileSchema>;

export const updateUserProfileSchema = z.object({
  apiKey: apiKeySchema,
});
