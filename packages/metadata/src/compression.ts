import {
  type CompressedMetadataData as V1CompressedMetadataData,
  compressMetadataData as v1compressMetadataData,
  decompressMetadataData as v1decompressMetadataData,
  type MetadataData as V1MetadataData,
  metadataDataSchema as v1metadataDataSchema,
} from "./schemas/v1.schema";

export type Version = "v1";
type Data = {
  v1: V1MetadataData;
};
type CompressedData = {
  v1: V1CompressedMetadataData;
};
export type Metadata = {
  version: Version;
  data: Data[Version];
};
export type CompressedMetadata = {
  version: Version;
  data: CompressedData[Version];
};

export const getSchema = (version: Version) => {
  switch (version) {
    case "v1": {
      return v1metadataDataSchema;
    }
  }
};

export const compressMetadata = (version: Version, data: Record<string, unknown>): CompressedMetadata => {
  switch (version) {
    case "v1": {
      return {
        version,
        data: v1compressMetadataData(v1metadataDataSchema.parse(data)),
      };
    }
  }
};

export const decompressMetadata = ({ version, data }: CompressedMetadata): Metadata => {
  switch (version) {
    case "v1": {
      return {
        version,
        data: v1decompressMetadataData(data),
      };
    }
  }
};
