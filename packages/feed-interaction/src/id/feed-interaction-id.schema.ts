import { z } from "zod";

import { FEED_INTERACTION_ID_LENGTH, FEED_INTERACTION_ID_PREFIX } from "./generate-feed-interaction-id";

export const feedIntegrationIdSchema = z
  .string()
  .trim()
  .startsWith(FEED_INTERACTION_ID_PREFIX, { message: "ID passed is not a feed ID." })
  .length(FEED_INTERACTION_ID_LENGTH, { message: "Wrong ID size." });
