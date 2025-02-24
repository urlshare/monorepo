// import { Metadata } from "./types";
//
// export const isImage = (metadata: Metadata) => metadata.contentType?.startsWith("image");
// export const isWebsite = (metadata: Metadata) => metadata.contentType?.includes("html");

import { CompressMetadataData } from "./types";
import { compressMetadataData } from "@workspace/metadata/schemas/v1.schema";

const compressor = <T, U>(metadata: T, compressFn: CompressMetadataData<T, U>): U => {
  return compressFn(metadata);
};
