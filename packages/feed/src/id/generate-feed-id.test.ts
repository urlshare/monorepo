import { describe, it, expect } from "vitest";
import { generateFeedId } from "./generate-feed-id.js";

describe("generateFeedId", () => {
  it("should prefix id with url prefix", () => {
    const id = generateFeedId();

    expect(id).toMatch(new RegExp(`^feed_[a-zA-Z0-9]{22}$`));
  });
});
