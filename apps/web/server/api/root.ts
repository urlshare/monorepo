import { categoriesRouter } from "@/modules/category/router/categories";
import { createCallerFactory, createTRPCRouter } from "./trpc";
import { usersRouter } from "@/modules/user/router/users";
import { userProfilesRouter } from "@/modules/user-profile/router/user-profiles";
import { followUserRouter } from "@/modules/follow-user/router/follow-user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  followUser: followUserRouter,
  users: usersRouter,
  userProfiles: userProfilesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
