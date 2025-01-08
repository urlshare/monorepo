import { describe, it, expect } from "vitest";
import { generateUserUrlId } from "./generate-user-url-id";

describe("generateUserUrlId", () => {
  it("should prefix id with user url prefix", () => {
    const id = generateUserUrlId();

    expect(id).toMatch(new RegExp(`^usr_url_[a-zA-Z0-9]{22}$`));
  });
});
