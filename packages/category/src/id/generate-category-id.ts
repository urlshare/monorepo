import { generateId, DEFAULT_ID_LENGTH } from "@workspace/shared/utils/generate-id";

export const CATEGORY_ID_PREFIX = "cat_";
export const CATEGORY_ID_LENGTH = DEFAULT_ID_LENGTH + CATEGORY_ID_PREFIX.length;

export const generateCategoryId = () => generateId(CATEGORY_ID_PREFIX);
