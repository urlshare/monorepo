import { createTRPCRouter } from "@/server/api/trpc.js";
import { updateUser } from "./procedures/update-user.js";

export const usersRouter = createTRPCRouter({
  updateUser,
});
