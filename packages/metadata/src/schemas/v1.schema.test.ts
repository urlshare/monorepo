import { describe, it, expect } from "vitest";
import {
  MetadataData,
  CompressedMetadataData,
  compressMapper,
  compressMetadataData,
  decompressMetadataData,
} from "./v1.schema";

describe("compressMetadata", () => {
  describe("when some fields don't have the value", () => {
    it("should omit them", () => {
      const metadata: MetadataData = {
        author: undefined,
        date: "2025-02-02T04:00:00.000Z",
        description: "Description",
        faviconUrl: "https://example.com/favicon.jpg",
        imageUrl: "https://example.com/image.jpg",
        lang: "en",
        logoUrl: "https://example.com/logo.jpg",
        publisher: "Some Publisher",
        title: "Title",
        url: "https://example.com",
      };

      const compressedMetadata = compressMetadataData(metadata);

      expect(compressedMetadata).toEqual({
        date: "2025-02-02T04:00:00.000Z",
        description: "Description",
        faviconUrl: "https://example.com/favicon.jpg",
        imageUrl: "https://example.com/image.jpg",
        lang: "en",
        logoUrl: "https://example.com/logo.jpg",
        publisher: "Some Publisher",
        title: "Title",
        url: "https://example.com",
      });
      const keyForAuthor = compressMapper["author"];
      expect(compressedMetadata).not.toHaveProperty(keyForAuthor);
    });
  });
});

describe("decompress", () => {
  describe("when some keys are missing (e.g. had no value, thus been removed in compression)", () => {
    it("should not be brought back", () => {
      const compressedMetadata: CompressedMetadataData = {
        author: "Author",
        date: "2025-02-02T04:00:00.000Z",
        url: "https://example.com",
      };

      const metadata = decompressMetadataData(compressedMetadata);

      expect(metadata).toEqual({
        author: "Author",
        date: "2025-02-02T04:00:00.000Z",
        url: "https://example.com",
      });
    });
  });
});
