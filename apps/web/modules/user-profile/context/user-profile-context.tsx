"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { useUserStore } from "@/modules/user/store/user-store-provider";
import { usePathname } from "next/navigation";

type ProfileContextType = {
  hasProfile: boolean | null;
  isLoading: boolean;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, setProfile } = useUserStore((state) => state);

  const { data, isLoading, refetch } = api.userProfiles.getPrivateUserProfile.useQuery(undefined, {
    enabled: profile === null,
  });

  // 🚀 Force re-check when route changes
  useEffect(() => {
    refetch(); // Ensure the backend is called when navigating
  }, [pathname, refetch]);

  useEffect(() => {
    if (!isLoading && data) {
      setProfile(data);
    }
  }, [data, isLoading, setProfile]);

  return (
    <ProfileContext.Provider value={{ hasProfile: cachedProfile ?? hasProfile ?? null, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
}
