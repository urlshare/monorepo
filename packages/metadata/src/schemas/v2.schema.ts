import { z } from "zod";

const stringOrNull = (val: string) => (val === "" ? null : val);

const trimmedStringSchema = z.string().trim();
const urlAddressSchema = trimmedStringSchema.url();

const authorSchema = trimmedStringSchema;
const contentTypeSchema = trimmedStringSchema;
const datetimeSchema = trimmedStringSchema.datetime();
const descriptionSchema = trimmedStringSchema;
const imageUrlSchema = urlAddressSchema;
const languageSchema = trimmedStringSchema;
const logoUrlSchema = urlAddressSchema;
const publisherSchema = trimmedStringSchema;
const titleSchema = trimmedStringSchema;
const urlSchema = urlAddressSchema;

export const metadataDataSchema = z.object({
  author: authorSchema.catch("").transform(stringOrNull).nullable(),
  contentType: contentTypeSchema.catch("").transform(stringOrNull).nullable(),
  datetime: datetimeSchema.catch("").transform(stringOrNull).nullable(),
  description: descriptionSchema.catch("").transform(stringOrNull).nullable(),
  imageUrl: imageUrlSchema.catch("").transform(stringOrNull).nullable(),
  lang: languageSchema.catch("").transform(stringOrNull).nullable(),
  logoUrl: logoUrlSchema.catch("").transform(stringOrNull).nullable(),
  publisher: publisherSchema.catch("").transform(stringOrNull).nullable(),
  title: titleSchema.catch("").transform(stringOrNull).nullable(),
  url: urlSchema.catch("").transform(stringOrNull).nullable(),
});

export type MaybeMetadataData = z.input<typeof metadataDataSchema>;
export type MetadataData = z.output<typeof metadataDataSchema>;

export type CompressedMetadataData = {
  a?: z.output<typeof authorSchema>;
  j?: z.output<typeof contentTypeSchema>;
  b?: z.output<typeof datetimeSchema>;
  c?: z.output<typeof descriptionSchema>;
  d?: z.output<typeof imageUrlSchema>;
  e?: z.output<typeof languageSchema>;
  f?: z.output<typeof logoUrlSchema>;
  g?: z.output<typeof publisherSchema>;
  h?: z.output<typeof titleSchema>;
  i?: z.output<typeof urlSchema>;
};

export const compressMapper: Record<keyof MetadataData, keyof CompressedMetadataData> = {
  author: "a",
  contentType: "j",
  datetime: "b",
  description: "c",
  imageUrl: "d",
  lang: "e",
  logoUrl: "f",
  publisher: "g",
  title: "h",
  url: "i",
} as const;

export const compressMetadataData = (metadata: MetadataData): CompressedMetadataData => {
  return Object.entries(metadata).reduce((acc, [key, val]) => {
    if (val === null) {
      return acc;
    }

    const newKey = compressMapper[key as keyof MetadataData];
    acc[newKey] = val;

    return acc;
  }, {} as CompressedMetadataData);
};

export const decompressMetadataData = (compressedMetadata: CompressedMetadataData): MetadataData => {
  return Object.keys(compressMapper).reduce((acc, key) => {
    const compressedKey = compressMapper[key as keyof MetadataData];
    acc[key as keyof MetadataData] = compressedMetadata[compressedKey] ?? null;

    return acc;
  }, {} as MetadataData);
};

export const VERSION = 2 as const;
