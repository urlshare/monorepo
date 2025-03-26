import { describe, expect, it } from "vitest";

import {
  CompressedMetadataData,
  compressMapper,
  compressMetadataData,
  decompressMetadataData,
  MetadataData,
} from "./v1.schema";

describe("compressMetadata", () => {
  describe("when some fields don't have the value", () => {
    it("should omit them", () => {
      const metadata: MetadataData = {
        author: undefined,
        contentType: "text/html",
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
        contentType: "text/html",
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
        contentType: "text/html",
        date: "2025-02-02T04:00:00.000Z",
        url: "https://example.com",
      };

      const metadata = decompressMetadataData(compressedMetadata);

      expect(metadata).toEqual({
        author: "Author",
        contentType: "text/html",
        date: "2025-02-02T04:00:00.000Z",
        url: "https://example.com",
      });
    });
  });
});
