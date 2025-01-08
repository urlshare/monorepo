import { schema } from "@workspace/db/db";

export type PublicUserProfileVM = Pick<
  schema.UserProfile,
  "username" | "imageUrl" | "followingCount" | "followersCount" | "likesCount" | "urlsCount"
> & {
  id: schema.UserProfile["userId"];
  createdAt: schema.UserProfile["createdAt"];
};

export const toPublicUserProfileVM = ({
  username,
  imageUrl,
  followingCount,
  followersCount,
  likesCount,
  createdAt,
  userId,
  urlsCount,
}: schema.UserProfile): PublicUserProfileVM => {
  return { username, imageUrl, followingCount, followersCount, createdAt, id: userId, likesCount, urlsCount };
};
