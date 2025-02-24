import { z } from "zod";
// import { isDate, isString, toString, isNumber } from "lodash";
// import { condenseWhitespace } from "./condense-whitespace";

export const isUrl = (url: unknown): boolean => {
  const result = z.string().trim().url().safeParse(url);

  return result.success;
};

export const nonEmptyString = (value: unknown): boolean => {
  const result = z.string().trim().min(1).safeParse(value);

  return result.success;
};

const isIso = (value: unknown): value is string => {
  return z.string().date().safeParse(value).success || z.string().datetime().safeParse(value).success;
};

// export const toDate = (value: unknown): string | undefined => {
//   if (isDate(value)) return value.toISOString();
//
//   if (!(isString(value) || isNumber(value))) return;
//
//   // remove whitespace for easier parsing
//   if (isString(value)) {
//     value = condenseWhitespace(value);
//   }
//
//   // convert isodates to restringify, because sometimes they are truncated
//   if (isIso(value)) {
//     return new Date(value).toISOString();
//   }
//
//   if (/^\d{4}$/.test(value as unknown as string)) return new Date(toString(value)).toISOString();
//
//   let isoDate;
//
//   if (isString(value)) {
//     for (const item of value.split("\n").filter(Boolean)) {
//       const parsed = chrono.parseDate(item);
//       isoDate = getISODate(parsed);
//       if (isoDate) break;
//     }
//   } else {
//     if (value >= 1e16 || value <= -1e16) {
//       // nanoseconds
//       value = Math.floor(value / 1000000);
//     } else if (value >= 1e14 || value <= -1e14) {
//       // microseconds
//       value = Math.floor(value / 1000);
//     } else if (!(value >= 1e11) || value <= -3e10) {
//       // seconds
//       value = value * 1000;
//     }
//     isoDate = getISODate(new Date(value));
//   }
//
//   return isoDate;
// };
//
// const getISODate = (date: Date) => (date && !Number.isNaN(date.getTime()) ? date.toISOString() : undefined);
