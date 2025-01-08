import { describe, it, expect } from "vitest";
import { URL_ID_LENGTH, generateUrlId } from "@workspace/url/id/generate-url-id";
import { CATEGORY_ID_LENGTH, generateCategoryId } from "@workspace/category/id/generate-category-id";
import { CATEGORY_NAME_MAX_LENGTH } from "@workspace/category/name/category-name.schema";
import { REQUEST_ID_LENGTH, generateRequestId } from "@workspace/request/id/generate-request-id";
import { USER_PROFILE_ID_LENGTH, generateUserProfileId } from "@workspace/user-profile/id/generate-user-profile-id";
import { API_KEY_LENGTH, generateApiKey } from "@workspace/user/api-key/generate-api-key";
import { USERNAME_MAX_LENGTH } from "@workspace/user-profile/username/username.schema";
import { USER_URL_ID_SIZE, generateUserUrlId } from "@workspace/user-url/id/generate-user-url-id";
import { USER_ID_LENGTH, generateUserId } from "@workspace/user/id/generate-user-id";

describe("data lengths check", () => {
  it("if any data's length changes, this test must fail, as those sizes are used in schema", () => {
    expect(generateUrlId()).toHaveLength(26);
    expect(URL_ID_LENGTH).toEqual(26);

    expect(generateCategoryId()).toHaveLength(26);
    expect(CATEGORY_ID_LENGTH).toEqual(26);
    expect(CATEGORY_NAME_MAX_LENGTH).toEqual(30);

    expect(generateRequestId()).toHaveLength(26);
    expect(REQUEST_ID_LENGTH).toEqual(26);

    expect(generateUserProfileId()).toHaveLength(29);
    expect(USER_PROFILE_ID_LENGTH).toEqual(29);

    expect(USERNAME_MAX_LENGTH).toEqual(15);

    expect(generateApiKey()).toHaveLength(30);
    expect(API_KEY_LENGTH).toEqual(30);

    expect(generateUserUrlId()).toHaveLength(30);
    expect(USER_URL_ID_SIZE).toEqual(30);

    expect(generateUserId()).toHaveLength(26);
    expect(USER_ID_LENGTH).toEqual(26);
  });
});
