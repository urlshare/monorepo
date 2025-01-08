import { schema } from "@workspace/db/db";
import Link from "next/link";
import { FC } from "react";

import { ProfileListItem, ProfileListItemProps } from "./profile-list-item.js";

type FollowingFollowersListProps = {
  username: schema.UserProfile["username"];
  profiles: ReadonlyArray<ProfileListItemProps>;
  myProfile?: boolean;
};

export const FollowingList: FC<FollowingFollowersListProps> = ({ username, profiles, myProfile }) => {
  return (
    <section className="lg:min-h-[350px]">
      <h1 className="mb-5 text-lg font-bold">{myProfile ? "Profiles I follow" : `Profiles ${username} follows`}</h1>
      <ol className="flex flex-col gap-1.5">
        {profiles.map((profile) => {
          return (
            <li key={profile.username}>
              <Link href={`/${profile.username}`}>
                <ProfileListItem {...profile} />
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
};
