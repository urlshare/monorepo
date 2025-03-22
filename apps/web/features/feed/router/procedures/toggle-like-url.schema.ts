import z from "zod";

import { feedIdSchema } from "@workspace/feed/id/feed-id.schema";

export const toggleLikeUrlSchema = z.object({
  feedId: feedIdSchema,
});
