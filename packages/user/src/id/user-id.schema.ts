import { z } from "zod";
import { USER_ID_PREFIX } from "./generate-user-id";
import { DEFAULT_ID_LENGTH } from "@workspace/shared/utils/generate-id";

export type UserId = z.infer<typeof userIdSchema>;

export const userIdSchema = z
  .string()
  .trim()
  .startsWith(USER_ID_PREFIX, { message: "ID passed is not a user ID." })
  .length(USER_ID_PREFIX.length + DEFAULT_ID_LENGTH, { message: "Wrong ID size." });
