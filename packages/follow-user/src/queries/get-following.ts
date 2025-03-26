import { orm, schema } from "@workspace/db/db";
import { type YesNo } from "@workspace/shared/types";

type ProfileData = Pick<schema.UserProfile, "username" | "imageUrl" | "userId">;
type ProfileFollowingMe = { isFollowingMe: YesNo };
type ProfileIFollow = { iFollow: YesNo };

type FollowingMyProfile = ReadonlyArray<ProfileData & ProfileFollowingMe>;
type FollowingNotMyProfileIAmLoggedIn = ReadonlyArray<ProfileData & ProfileFollowingMe & ProfileIFollow>;
type FollowingAnyProfileIAmNotLoggedIn = ReadonlyArray<ProfileData>;

export type FollowingRawEntries =
  | FollowingMyProfile
  | FollowingNotMyProfileIAmLoggedIn
  | FollowingAnyProfileIAmNotLoggedIn;

export const getFollowingQuery = (userId: schema.User["id"], viewerId: schema.User["id"] | null) => {
  const myProfile = userId === viewerId;
  const notMyProfileIAmLoggedIn = viewerId !== null && !myProfile;

  if (myProfile) {
    return orm.sql`
      SELECT 
          u.username, 
          u.imageUrl,
          CASE 
              WHEN f2.followingId IS NULL THEN 'no' 
              ELSE 'yes' 
          END AS isFollowingMe           
      FROM ${schema.follows} f1
      JOIN ${schema.userProfiles} u ON u.userId = f1.followingId
      LEFT JOIN ${schema.follows} f2 
          ON f2.followingId = f1.followerId 
          AND f2.followerId = u.userId
      WHERE f1.followerId = ${userId}
      ORDER BY f1.createdAt DESC
      LIMIT 100;
    `;
  }

  if (notMyProfileIAmLoggedIn) {
    return orm.sql`
      SELECT 
          u.userId,
          u.username, 
          u.imageUrl,
          CASE 
              WHEN f2.followingId IS NULL THEN 'no' 
              ELSE 'yes' 
          END AS isFollowingMe,
          CASE 
              WHEN f3.followingId IS NULL THEN 'no' 
              ELSE 'yes' 
          END AS iFollow
      FROM ${schema.follows} f1
      JOIN ${schema.userProfiles} u ON u.userId = f1.followingId
      LEFT JOIN ${schema.follows} f2 
          ON f1.followingId = f2.followerId 
          AND f2.followingId = ${viewerId}
      LEFT JOIN ${schema.follows} f3 
          ON f1.followingId = f3.followingId 
          AND f3.followerId = ${viewerId}
      WHERE f1.followerId = ${userId}
      ORDER BY f1.id DESC
      LIMIT 100;
    `;
  }

  return orm.sql`
    SELECT 
        u.userId, 
        u.username, 
        u.image
    FROM ${schema.follows} f
    JOIN ${schema.userProfiles} u ON u.userId = f.followingId
    WHERE f.followerId = ${userId}
    ORDER BY f.createdAt DESC
    LIMIT 100;
  `;
};
