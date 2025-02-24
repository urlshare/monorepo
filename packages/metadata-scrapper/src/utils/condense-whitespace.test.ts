import { it, describe, expect } from "vitest";
import { condenseWhitespace } from "./condense-whitespace";

describe("condenseWhitespace", () => {
  it("should remove extra whitespace, leaving only single space between words", () => {
    expect(condenseWhitespace("   a  b   \n\t  c  ")).toBe("a b c");
  });
});
