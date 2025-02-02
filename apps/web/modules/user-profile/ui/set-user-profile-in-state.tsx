"use client";

import { useUserStore } from "@/modules/user/store/user-store-provider";
import { api } from "@/trpc/react";
import { User } from "@supabase/supabase-js";
import { useEffect } from "react";

export const SetUserProfileInState = ({ user }: { user: User | null }) => {
  const { profile, setProfile, clearUser } = useUserStore((state) => state);
  const { data, isLoading } = api.userProfiles.getPrivateUserProfile.useQuery(undefined, {
    enabled: profile.id === "" && user !== null,
  });

  useEffect(() => {
    if (!isLoading && data && user) {
      setProfile(data);
    }

    if (user === null) {
      clearUser();
    }
  }, [data, isLoading, setProfile, clearUser, user]);

  return null;
};
