import { describe, expect,it } from "vitest";

import { generateUrlId } from "./generate-url-id.js";

describe("generateUrlId", () => {
  it("should prefix id with url prefix", () => {
    const id = generateUrlId();

    expect(id).toMatch(new RegExp(`^url_[a-zA-Z0-9]{22}$`));
  });
});
