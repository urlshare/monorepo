import { generateId, DEFAULT_ID_LENGTH } from "@workspace/shared/utils/generate-id";

export const USER_URL_ID_PREFIX = "usr_url_";
export const USER_URL_ID_LENGTH = DEFAULT_ID_LENGTH + USER_URL_ID_PREFIX.length;

export const generateUserUrlId = () => generateId(USER_URL_ID_PREFIX);
