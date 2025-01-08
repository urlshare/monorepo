import { z } from "zod";

import { USER_URL_ID_PREFIX, USER_URL_ID_SIZE } from "./generate-user-url-id";

export const userUrlIdSchema = z
  .string()
  .trim()
  .startsWith(USER_URL_ID_PREFIX, { message: "ID passed is not a userUrl ID." })
  .length(USER_URL_ID_SIZE, { message: "Wrong ID size." });
