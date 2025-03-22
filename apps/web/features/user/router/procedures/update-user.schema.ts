import { apiKeySchema } from "@workspace/user/api-key/api-key.schema";
import { z } from "zod";

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const updateUserSchema = z.object({
  apiKey: apiKeySchema,
});
