import { createTRPCRouter } from "@/server/api/trpc";

import { isFollowingUser } from "./procedures/is-following-user";
import { toggleFollowUser } from "./procedures/toggle-follow-user";

export const followUserRouter = createTRPCRouter({
  isFollowingUser,
  toggleFollowUser,
});

export type FollowUserRouter = typeof followUserRouter;
