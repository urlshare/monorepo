import { orm, schema } from "@workspace/db/db";
import { YesNo } from "@workspace/shared/types";

type ProfileData = Pick<schema.UserProfile, "username" | "imageUrl" | "userId">;
type ProfileFollowingMe = { isFollowingMe: YesNo };
type ProfileIFollow = { iFollow: YesNo };

type FollowersOfMyProfile = ReadonlyArray<ProfileData & ProfileIFollow>;
type FollowersOfNotMyProfileIAmLoggedIn = ReadonlyArray<ProfileData & ProfileFollowingMe & ProfileIFollow>;
type FollowersOfAnyProfileIAmNotLoggedIn = ReadonlyArray<ProfileData>;

export type FollowersRawEntries =
  | FollowersOfMyProfile
  | FollowersOfNotMyProfileIAmLoggedIn
  | FollowersOfAnyProfileIAmNotLoggedIn;

export const getFollowersQuery = (
  userId: schema.User["id"],
  viewerId: schema.User["id"] | null,
): orm.SQL<FollowersRawEntries> => {
  const myProfile = userId === viewerId;
  const notMyProfileIAmLoggedIn = viewerId !== null && !myProfile;

  if (myProfile) {
    return orm.sql`
      SELECT
        u.userId,
        u.username,
        u.imageUrl,
        CASE WHEN f2.followerId IS NULL THEN 'no' ELSE 'yes' END AS iFollow
      FROM ${schema.follows} f1
      JOIN ${schema.userProfiles} u ON u.userId = f1.followerId
      LEFT JOIN ${schema.follows} f2 
        ON f2.followerId = ${userId} 
        AND f2.followingId = u.userId
      WHERE f1.followingId = ${userId}
      ORDER BY f1.createdAt DESC
      LIMIT 100
    `;
  }

  if (notMyProfileIAmLoggedIn) {
    return orm.sql`
      SELECT 
          u.userId, 
          u.username, 
          u.imageUrl,
          CASE 
              WHEN f2.followerId IS NULL THEN 'no' 
              ELSE 'yes' 
          END AS iFollow,
          CASE 
              WHEN f3.followerId IS NULL THEN 'no' 
              ELSE 'yes' 
          END AS isFollowingMe
      FROM ${schema.follows} f1
      JOIN ${schema.userProfiles} u ON u.userId = f1.followerId
      LEFT JOIN ${schema.follows} f2 
          ON f2.followerId = ${viewerId} 
          AND f2.followingId = u.userId
      LEFT JOIN ${schema.follows} f3 
          ON f3.followerId = u.userId 
          AND f3.followingId = ${viewerId}
      WHERE f1.followingId = ${userId}
      ORDER BY f1.createdAt DESC
      LIMIT 100;
    `;
  }

  return orm.sql`
    SELECT 
        u.userId, 
        u.username, 
        u.imageUrl
    FROM ${schema.userProfiles} u
    JOIN ${schema.follows} f ON u.userId = f.followerId
    WHERE f.followingId = ${userId}
    ORDER BY f.createdAt DESC
    LIMIT 100;
  `;
};
