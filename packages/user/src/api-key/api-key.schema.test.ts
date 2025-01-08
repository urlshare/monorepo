import { describe, it, expect } from "vitest";
import { ApiKeySchema, apiKeySchema } from "./api-key.schema.js";
import { SafeParseError, SafeParseSuccess } from "zod";
import { API_KEY_ALPHABET, generateApiKey } from "./generate-api-key.js";

describe("apiKeySchema", () => {
  it("should be exactly 30 characters long", () => {
    const exactLength = 30;
    const tooShort = exactLength - 1;
    const tooLong = exactLength + 1;

    const exactLengthApiKey = "a".repeat(exactLength);
    const tooShortApiKey = "a".repeat(tooShort);
    const tooLongApiKey = "a".repeat(tooLong);

    expect(() => apiKeySchema.parse(exactLengthApiKey)).not.toThrow();

    const tooShortResult = apiKeySchema.safeParse(tooShortApiKey) as SafeParseError<ApiKeySchema>;
    expect(tooShortResult.success).toEqual(false);
    expect(tooShortResult.error.format()._errors).toContain("API Key must be exactly 30 characters long.");

    const tooLongResult = apiKeySchema.safeParse(tooLongApiKey) as SafeParseError<ApiKeySchema>;
    expect(tooLongResult.success).toEqual(false);
    expect(tooLongResult.error.format()._errors).toContain("API Key must be exactly 30 characters long.");
  });

  it("should allow only the ID generator dictionary characters to be used", () => {
    const validApiKey = generateApiKey();

    expect(() => apiKeySchema.parse(validApiKey)).not.toThrow();

    const invalidCharactersExamples = ["ą".repeat(30), "-".repeat(30)];

    invalidCharactersExamples.forEach((apiKey) => {
      const result = apiKeySchema.safeParse(apiKey) as SafeParseError<ApiKeySchema>;

      expect(result.success).toEqual(false);
      expect(result.error.format()._errors).toContain(`Only ${API_KEY_ALPHABET} characters allowed.`);
    });
  });

  it("should trim entered API key", () => {
    const apiKey = "a".repeat(30);
    const apiKeysWithSpacesAroundThem = [
      ` ${apiKey}`,
      `${apiKey} `,
      ` ${apiKey} `,
      `   ${apiKey}   `,
      `\n\t   ${apiKey}   \t\n`,
    ];

    apiKeysWithSpacesAroundThem.forEach((apiKeyWithSpaces) => {
      const result = apiKeySchema.safeParse(apiKeyWithSpaces) as SafeParseSuccess<ApiKeySchema>;

      expect(result.data).toEqual(apiKey);
    });
  });
});
