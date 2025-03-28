"use client";

import { ReactNode } from "react";

import { LoggedInUserContent } from "@/features/home-page/logged-in-user-content";
import { useUserStore } from "@/features/user/store/user-store-provider";

export default function Page(): ReactNode {
  const { loggedIn, profile } = useUserStore((state) => state);

  if (loggedIn) {
    return (
      <>
        <div className="w-fixed w-full flex-shrink flex-grow-0 px-4">Lef column with menu and stuff</div>
        <div className="w-full flex-grow px-3 pt-1">
          <LoggedInUserContent userId={profile.id} />
        </div>
        <div className="w-fixed w-full flex-shrink flex-grow-0 px-2">RIght</div>
      </>
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
