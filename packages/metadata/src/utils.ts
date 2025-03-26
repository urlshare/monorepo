// import { Metadata } from "./types";
//
// export const isImage = (metadata: Metadata) => metadata.contentType?.startsWith("image");
// export const isWebsite = (metadata: Metadata) => metadata.contentType?.includes("html");

import { compressMetadataData } from "@workspace/metadata/schemas/v1.schema";

import { CompressMetadataData } from "./types";

const compressor = <T, U>(metadata: T, compressFn: CompressMetadataData<T, U>): U => {
  return compressFn(metadata);
};
