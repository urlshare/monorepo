import {
  metadataDataSchema as v1metadataDataSchema,
  compressMetadataData as v1compressMetadataData,
  decompressMetadataData as v1decompressMetadataData,
  type MetadataData as V1MetadataData,
  type CompressedMetadataData as V1CompressedMetadataData,
} from "./schemas/v1.schema";

type Version = "v1";
type Data = {
  v1: V1MetadataData;
};
type CompressedData = {
  v1: V1CompressedMetadataData;
};
type Metadata<V extends Version> = {
  version: V;
  data: Data[V];
};
type CompressedMetadata<V extends Version> = {
  version: V;
  data: CompressedData[V];
};

export const getSchema = (version: Version) => {
  switch (version) {
    case "v1": {
      return v1metadataDataSchema;
    }
  }
};

export const compressMetadata = (
  version: Version,
  data: Record<string, unknown>,
): CompressedMetadata<typeof version> => {
  switch (version) {
    case "v1": {
      return {
        version,
        data: v1compressMetadataData(v1metadataDataSchema.parse(data)),
      };
    }
  }
};

export const decompressMetadata = ({ version, data }: CompressedMetadata<Version>): Metadata<typeof version> => {
  switch (version) {
    case "v1": {
      return {
        version,
        data: v1decompressMetadataData(data),
      };
    }
  }
};
