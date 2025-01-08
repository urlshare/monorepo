import { z } from "zod";

export const CATEGORY_NAME_MAX_LENGTH = 30;

export const categoryNameSchema = z
  .string()
  .trim()
  .min(1, { message: "Category name can't be empty." })
  .refine(
    (val) => val.length <= CATEGORY_NAME_MAX_LENGTH,
    (val) => ({
      message: `Category name too long. ${val.length} characters, max ${CATEGORY_NAME_MAX_LENGTH}.`,
    }),
  )
  .refine((val) => !val.includes(","), {
    message: `Category name can't include comma "," character.`,
  });
