import { generateId, DEFAULT_ID_LENGTH } from "@workspace/shared/utils/generate-id";

export const FEED_ID_PREFIX = "feed_" as const;
export const FEED_ID_LENGTH = DEFAULT_ID_LENGTH + FEED_ID_PREFIX.length;

export const generateFeedId = (): string => generateId(FEED_ID_PREFIX);
