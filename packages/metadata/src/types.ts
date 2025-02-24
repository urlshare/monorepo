export type CompressMetadataData<UncompressedDaa, CompressedData> = (metadataData: UncompressedDaa) => CompressedData;
export type DecompressMetadataData<CompressedData, UncompressedData> = (
  compressedMetadataData: CompressedData,
) => UncompressedData;
