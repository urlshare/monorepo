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
import { SignOutButton } from "./sign-out-button";
import { UserImage } from "@/modules/user/ui/user-image";
import { useUserStore } from "@/modules/user/store/user-store-provider";

export const LoggedInUserMenu = () => {
  const { username, imageUrl } = useUserStore((state) => state.profile);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserImage username={username} imageUrl={imageUrl} size="small" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
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
