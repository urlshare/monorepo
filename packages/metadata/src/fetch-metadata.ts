import { defaultMetadataFetchAdapter } from "./fetch-adapters/default";
import { isTweetUrl, twitterMetadataFetchAdapter } from "./fetch-adapters/twitter";
// import { Metadata } from "./types";

// export type FetchMetadata = (url: string) => Promise<Metadata>;

export const fetchMetadata = async (url: string) => {
  if (isTweetUrl(url)) {
    return await twitterMetadataFetchAdapter(url);
  }

  return await defaultMetadataFetchAdapter(url);
};
