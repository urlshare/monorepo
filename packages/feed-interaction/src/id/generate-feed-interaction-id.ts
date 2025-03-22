import { generateId, DEFAULT_ID_LENGTH } from "@workspace/shared/utils/generate-id";

export const FEED_INTERACTION_ID_PREFIX = "feed_int_" as const;
export const FEED_INTERACTION_ID_LENGTH = DEFAULT_ID_LENGTH + FEED_INTERACTION_ID_PREFIX.length;

export const generateFeedInteractionId = (): string => generateId(FEED_INTERACTION_ID_PREFIX);
