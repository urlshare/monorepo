import z from "zod";
import { API_KEY_ALPHABET, API_KEY_LENGTH } from "./generate-api-key.js";

export type ApiKeySchema = z.infer<typeof apiKeySchema>;

export const apiKeySchema = z
  .string()
  .trim()
  .length(API_KEY_LENGTH, `API Key must be exactly ${API_KEY_LENGTH} characters long.`)
  .regex(new RegExp(`^[${API_KEY_ALPHABET}]+$`), `Only ${API_KEY_ALPHABET} characters allowed.`);
