"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { List, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";

import { useUserStore } from "@/features/user/store/user-store-provider";
import { UserImage } from "@/features/user/ui/user-image";

import { SignOutButton } from "./sign-out-button";

export const LoggedInUserMenu = () => {
  const { profile } = useUserStore((state) => state);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserImage username={profile?.username || ""} imageUrl={profile?.imageUrl || ""} size="small" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{profile?.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2">
          <List size={12} />
          <Link href="/settings/categories">Categories</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <UserIcon size={12} />
          <Link href="/settings/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <LogOut size={12} />
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
