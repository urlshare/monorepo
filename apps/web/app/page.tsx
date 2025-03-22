"use client";

import { LoggedInUserContent } from "@/features/home-page/logged-in-user-content";
import { useUserStore } from "@/features/user/store/user-store-provider";

export default function Page() {
  const { loggedIn, profile } = useUserStore((state) => state);

  if (loggedIn) {
    return (
      <main>
        <div className="flex items-center justify-center">
          <LoggedInUserContent userId={profile.id} />
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Welcome to urlshare.app</h1>
        </div>
      </div>
    </main>
  );
}
