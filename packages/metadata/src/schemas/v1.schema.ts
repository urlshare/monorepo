import { CompressMetadataData, DecompressMetadataData } from "@workspace/metadata/types";
import { z } from "zod";

const trimmedStringSchema = z.string().trim();
const urlAddressSchema = trimmedStringSchema.url();

const authorSchema = trimmedStringSchema;
const dateSchema = trimmedStringSchema.datetime();
const descriptionSchema = trimmedStringSchema;
const faviconUrlSchema = urlAddressSchema;
const imageUrlSchema = urlAddressSchema;
const languageSchema = trimmedStringSchema;
const logoUrlSchema = urlAddressSchema;
const publisherSchema = trimmedStringSchema;
const titleSchema = trimmedStringSchema;
const urlSchema = urlAddressSchema;

export const metadataDataSchema = z.object({
  author: authorSchema.optional(),
  contentType: trimmedStringSchema,
  date: dateSchema.optional(),
  description: descriptionSchema.optional(),
  faviconUrl: imageUrlSchema.optional(),
  imageUrl: imageUrlSchema.optional(),
  lang: languageSchema.optional(),
  logoUrl: logoUrlSchema.optional(),
  publisher: publisherSchema.optional(),
  title: titleSchema.optional(),
  url: urlSchema,
});

export type MaybeMetadataData = z.input<typeof metadataDataSchema>;
export type MetadataData = z.output<typeof metadataDataSchema>;

export type CompressedMetadataData = {
  author?: z.output<typeof authorSchema>;
  contentType: z.output<typeof trimmedStringSchema>;
  date?: z.output<typeof dateSchema>;
  description?: z.output<typeof descriptionSchema>;
  faviconUrl?: z.output<typeof faviconUrlSchema>;
  imageUrl?: z.output<typeof imageUrlSchema>;
  lang?: z.output<typeof languageSchema>;
  logoUrl?: z.output<typeof logoUrlSchema>;
  publisher?: z.output<typeof publisherSchema>;
  title?: z.output<typeof titleSchema>;
  url: z.output<typeof urlSchema>;
};

export const compressMapper: Record<keyof MetadataData, keyof CompressedMetadataData> = {
  author: "author",
  contentType: "contentType",
  date: "date",
  description: "description",
  faviconUrl: "faviconUrl",
  imageUrl: "imageUrl",
  lang: "lang",
  logoUrl: "logoUrl",
  publisher: "publisher",
  title: "title",
  url: "url",
} as const;

export const compressMetadataData: CompressMetadataData<MetadataData, CompressedMetadataData> = (metadata) => {
  return Object.entries(metadata).reduce((acc, [key, val]) => {
    if (!val || (Array.isArray(val) && val.length === 0)) {
      return acc;
    }

    const newKey = compressMapper[key as keyof MetadataData];

    acc[newKey] = val;

    return acc;
  }, {} as CompressedMetadataData);
};

export const decompressMetadataData: DecompressMetadataData<CompressedMetadataData, MetadataData> = (
  compressedMetadata,
) => compressedMetadata;

export const VERSION = "v1" as const;
