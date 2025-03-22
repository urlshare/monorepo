import { CompressedMetadata, decompressMetadata, Metadata } from "@workspace/metadata/compression";

import { Category, Feed, Url, UserProfile, UserUrl } from "@workspace/db/types";

type RawFeedEntry = {
  user_username: UserProfile["username"] | null;
  user_userId: UserProfile["userId"] | null;
  user_imageUrl: UserProfile["imageUrl"] | null;
  feed_id: Feed["id"];
  feed_createdAt: Feed["createdAt"];
  feed_liked: Feed["liked"];
  url_url: Url["url"] | null;
  url_metadata: CompressedMetadata | null;
  url_likesCount: UserUrl["likesCount"] | null;
  userUrl_id: UserUrl["id"];
  category_names: string | null;
};

// Had to cast here due to obtaining the data using JOINS, which can return null values.
// I know which values can't be null, therefore casting those.
// TODO - add schema to avoid casting? Not sure if this is necessary, to avoid additional complexity.
export const toFeedVM = (entry: RawFeedEntry): FeedVM => {
  return {
    id: entry.feed_id,
    createdAt: entry.feed_createdAt.toISOString(),
    user: {
      id: entry.user_userId as UserProfile["userId"],
      imageUrl: entry.user_imageUrl,
      username: entry.user_username as UserProfile["username"],
    },
    url: {
      url: entry.url_url as string,
      metadata: decompressMetadata(entry.url_metadata as CompressedMetadata),
      likesCount: entry.url_likesCount as UserUrl["likesCount"],
      liked: entry.feed_liked,
      categoryNames: entry.category_names ? entry.category_names.split(",") : [],
    },
    userUrlId: entry.userUrl_id,
  };
};

type ISODateString = string;

export type FeedVM = {
  id: Feed["id"];
  createdAt: ISODateString;
  user: {
    id: UserProfile["userId"];
    imageUrl: UserProfile["imageUrl"];
    username: UserProfile["username"];
  };
  url: {
    url: Url["url"];
    metadata: Metadata;
    liked: Feed["liked"];
    likesCount: UserUrl["likesCount"];
    categoryNames: Category["name"][];
  };
  userUrlId: UserUrl["id"];
};
