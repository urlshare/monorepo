import { cn } from "@workspace/ui/lib/utils";
import Link, { type LinkProps } from "next/link";
import { AnchorHTMLAttributes, FC } from "react";

export const A: FC<LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>> = ({ children, className, ...rest }) => {
  return (
    <Link {...rest} className={cn(className, "font-medium text-blue-600 hover:underline")}>
      {children}
    </Link>
  );
};
