import { describe, it, expect } from "vitest";
import { generateUserId } from "./generate-user-id";

describe("generateUserId", () => {
  it("should prefix id with user prefix", () => {
    const id = generateUserId();

    expect(id).toMatch(new RegExp(`^usr_[a-zA-Z0-9]{22}$`));
  });
});
