import { describe, it, expect } from "vitest";
import {
  MetadataData,
  CompressedMetadataData,
  compressMapper,
  compressMetadataData,
  decompressMetadataData,
} from "./v2.schema";

describe("compressMetadata", () => {
  it("should shorten the keys in order to save object's space", () => {
    const metadata: MetadataData = {
      author: "Author",
      datetime: "2025-02-02T04:00:00.000Z",
      description: "Description",
      imageUrl: "https://example.com/image.jpg",
      lang: "en",
      logoUrl: "https://example.com/logo.jpg",
      publisher: "Some Publisher",
      title: "Title",
      url: "https://example.com",
    };

    const compressedMetadata = compressMetadataData(metadata);

    expect(compressedMetadata).toEqual({
      a: "Author",
      b: "2025-02-02T04:00:00.000Z",
      c: "Description",
      d: "https://example.com/image.jpg",
      e: "en",
      f: "https://example.com/logo.jpg",
      g: "Some Publisher",
      h: "Title",
      i: "https://example.com",
    });
  });

  describe("when some fields don't have the value", () => {
    it("should omit them", () => {
      const metadata: MetadataData = {
        author: null,
        datetime: "2025-02-02T04:00:00.000Z",
        description: "Description",
        imageUrl: "https://example.com/image.jpg",
        lang: "en",
        logoUrl: "https://example.com/logo.jpg",
        publisher: "Some Publisher",
        title: "Title",
        url: "https://example.com",
      };

      const compressedMetadata = compressMetadataData(metadata);

      expect(compressedMetadata).toEqual({
        b: "2025-02-02T04:00:00.000Z",
        c: "Description",
        d: "https://example.com/image.jpg",
        e: "en",
        f: "https://example.com/logo.jpg",
        g: "Some Publisher",
        h: "Title",
        i: "https://example.com",
      });
      const keyForAuthor = compressMapper["author"];
      expect(compressedMetadata).not.toHaveProperty(keyForAuthor);
    });
  });
});

describe("decompress", () => {
  it("should bring back the original keys and keep values intact", () => {
    const compressedMetadata: CompressedMetadataData = {
      a: "Author",
      b: "2025-02-02T04:00:00.000Z",
      c: "Description",
      d: "https://example.com/image.jpg",
      e: "en",
      f: "https://example.com/logo.jpg",
      g: "Some Publisher",
      h: "Title",
      i: "https://example.com",
    };

    const metadata = decompressMetadataData(compressedMetadata);

    expect(metadata).toEqual({
      author: "Author",
      datetime: "2025-02-02T04:00:00.000Z",
      description: "Description",
      imageUrl: "https://example.com/image.jpg",
      lang: "en",
      logoUrl: "https://example.com/logo.jpg",
      publisher: "Some Publisher",
      title: "Title",
      url: "https://example.com",
    });
  });

  describe("when some keys are missing (e.g. had no value, thus been removed in compression)", () => {
    it("should include them with null-ish value", () => {
      const compressedMetadata: CompressedMetadataData = {
        a: "Author",
        b: "2025-02-02T04:00:00.000Z",
      };

      const metadata = decompressMetadataData(compressedMetadata);

      expect(metadata).toEqual({
        author: "Author",
        datetime: "2025-02-02T04:00:00.000Z",
        description: null,
        imageUrl: null,
        lang: null,
        logoUrl: null,
        publisher: null,
        title: null,
        url: null,
      });
    });
  });
});
