import { describe, it, expect } from "vitest";
import { generateFeedInteractionId } from "./generate-feed-interaction-id";

describe("generateFeedInteractionId", () => {
  it("should prefix id with feed interaction prefix", () => {
    const id = generateFeedInteractionId();

    expect(id).toMatch(new RegExp(`^feed_int_[a-zA-Z0-9]{22}$`));
  });
});
