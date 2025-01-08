import { generateId, DEFAULT_ID_LENGTH } from "@workspace/shared/utils/generate-id";

export const USER_ID_PREFIX = "usr_";
export const USER_ID_LENGTH = DEFAULT_ID_LENGTH + USER_ID_PREFIX.length;

export const generateUserId = () => generateId(USER_ID_PREFIX);
