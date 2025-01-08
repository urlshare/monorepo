import { describe, it, expect } from "vitest";
import { generateCategoryId } from "./generate-category-id";

describe("generateCategoryId", () => {
  it("should prefix id with category prefix", () => {
    const id = generateCategoryId();

    expect(id).toMatch(new RegExp(`^cat_[a-zA-Z0-9]{22}$`));
  });
});
