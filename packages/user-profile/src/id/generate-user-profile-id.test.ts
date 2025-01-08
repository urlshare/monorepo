import { describe, it, expect } from "vitest";
import { generateUserProfileId } from "./generate-user-profile-id.js";

describe("generateUserProfileId", () => {
  it("should prefix id with user profile prefix", () => {
    const id = generateUserProfileId();

    expect(id).toMatch(new RegExp(`^usr_pd_[a-zA-Z0-9]{22}$`));
  });
});
