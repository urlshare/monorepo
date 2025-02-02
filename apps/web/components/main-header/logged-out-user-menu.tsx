"use client";

import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const LoggedOutUserMenu = () => {
  const pathname = usePathname();

  return (
    <Link
      href="/auth/sign-in"
      className={cn(
        pathname === "/" ? "text-primary" : "text-secondary",
        "text-sm transition-colors hover:text-slate-800",
      )}
    >
      Sign in
    </Link>
  );
};
