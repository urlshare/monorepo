import { describe, it, expect } from "vitest";
import { generateId } from "./generate-id";

describe("generateId", () => {
  describe("prefix configuration", () => {
    it("should generate the default prefix, if not specified", () => {
      const id = generateId();

      expect(id).toMatch(/^[a-zA-Z0-9]{22}$/);
    });

    it("should generate a specific prefix, if passed", () => {
      const id = generateId("prefix-");

      expect(id).toMatch(/^prefix-[a-zA-Z0-9]{22}$/);
    });
  });

  describe("size configuration", () => {
    it("should generate the default size, if not specified", () => {
      const id = generateId();

      expect(id).toHaveLength(22);
    });

    it("should generate a specific size, if passed", () => {
      const id = generateId("", 66);

      expect(id).toHaveLength(66);
    });
  });

  describe("alphabet configuration", () => {
    it("should generate the default alphabet, if not specified", () => {
      const id = generateId();

      expect(id).toMatch(/^[a-zA-Z0-9]{22}$/);
    });

    it("should generate a specific alphabet, if passed", () => {
      const id = generateId("", 66, "abc");

      expect(id).toMatch(/^[abc]{66}$/);
    });
  });
});
