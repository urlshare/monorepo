import { z } from "zod";

import { FEED_ID_PREFIX, FEED_ID_LENGTH } from "./generate-feed-id";

export const feedIdSchema = z
  .string()
  .trim()
  .startsWith(FEED_ID_PREFIX, { message: "ID passed is not a feed ID." })
  .length(FEED_ID_LENGTH, { message: "Wrong ID size." });
