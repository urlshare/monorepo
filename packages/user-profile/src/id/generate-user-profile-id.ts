import { generateId, DEFAULT_ID_LENGTH } from "@workspace/shared/utils/generate-id";

export const USER_PROFILE_ID_PREFIX = "usr_pd_";
export const USER_PROFILE_ID_LENGTH = DEFAULT_ID_LENGTH + USER_PROFILE_ID_PREFIX.length;

export const generateUserProfileId = () => generateId(USER_PROFILE_ID_PREFIX);
