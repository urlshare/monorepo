import { describe, it, expect } from "vitest";
import { generateApiKey } from "./generate-api-key.js";

describe("generateApiKey", () => {
  it("should generate a 30 chars length alphanumerical string", () => {
    const id = generateApiKey();

    expect(id).toMatch(new RegExp(`^[a-zA-Z0-9_]{30}$`));
  });
});
