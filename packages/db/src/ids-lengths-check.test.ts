import { CATEGORY_ID_LENGTH, generateCategoryId } from "@workspace/category/id/generate-category-id";
import { CATEGORY_NAME_MAX_LENGTH } from "@workspace/category/name/category-name.schema";
import { FEED_ID_LENGTH, generateFeedId } from "@workspace/feed/id/generate-feed-id";
import {
  FEED_INTERACTION_ID_LENGTH,
  generateFeedInteractionId,
} from "@workspace/feed-interaction/id/generate-feed-interaction-id";
import { generateRequestId, REQUEST_ID_LENGTH } from "@workspace/request/id/generate-request-id";
import { generateUrlId, URL_ID_LENGTH } from "@workspace/url/id/generate-url-id";
import { API_KEY_LENGTH, generateApiKey } from "@workspace/user/api-key/generate-api-key";
import { generateUserProfileId, USER_PROFILE_ID_LENGTH } from "@workspace/user-profile/id/generate-user-profile-id";
import { USERNAME_MAX_LENGTH } from "@workspace/user-profile/username/schemas/username.schema";
import { generateUserUrlId, USER_URL_ID_LENGTH } from "@workspace/user-url/id/generate-user-url-id";
import { describe, expect, it } from "vitest";

describe("data lengths check", () => {
  it("if any data's length changes, this test must fail, as those sizes are used in schema", () => {
    expect(generateUrlId()).toHaveLength(26);
    expect(URL_ID_LENGTH).toEqual(26);

    expect(generateFeedId()).toHaveLength(27);
    expect(FEED_ID_LENGTH).toEqual(27);

    expect(generateFeedInteractionId()).toHaveLength(31);
    expect(FEED_INTERACTION_ID_LENGTH).toEqual(31);

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
    expect(USER_URL_ID_LENGTH).toEqual(30);
  });
});
