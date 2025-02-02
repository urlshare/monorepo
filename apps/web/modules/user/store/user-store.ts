import type { User, UserProfile } from "@workspace/db/types";
import { createStore } from "zustand/vanilla";

export type UserState = {
  profile: {
    id: User["id"];
    username: UserProfile["username"];
    imageUrl: UserProfile["imageUrl"];
  };
};

export type UserActions = {
  setProfile: (userProfile: UserState["profile"]) => void;
  clearUser: () => void;
};

export type UserStore = UserState & UserActions;

export const initUserStore = (): UserState => {
  return {
    profile: {
      id: "",
      username: "",
      imageUrl: "",
    },
  };
};

export const defaultInitState: UserState = {
  profile: {
    id: "",
    username: "",
    imageUrl: "",
  },
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    setProfile: (userProfile: UserState["profile"]) => set((state) => ({ ...state, profile: userProfile })),
    clearUser: () => set(() => defaultInitState),
  }));
};
