import { createTRPCRouter } from "@/server/api/trpc.js";
import { createUserProfile } from "./procedures/create-user-profile.js";
import { usernameCheck } from "./procedures/username-check.js";
import { getPrivateUserProfile } from "./procedures/get-private-user-profile.js";

export const userProfilesRouter = createTRPCRouter({
  getPrivateUserProfile,
  usernameCheck,
  createUserProfile,
});
